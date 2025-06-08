title: Databend 查询优化器工作原理
---

## 核心概念

Databend 的查询优化器 (Query Optimizer) 基于几项关键的抽象概念构建，它们协同作用，将 SQL 查询转换为高效的执行计划 (Execution Plan)：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符 (Relational Operator) 的树形表示     │
│ Pipeline        │ 优化阶段的序列                                  │
│ Rules           │ 模式匹配转换                                    │
│ Cost Model      │ 用于执行估算的数学模型 (Cost Model)             │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息来指导优化决策：

**表统计信息：**

- `num_rows`: 表中的行数
- `data_size`: 表数据的字节大小
- `number_of_blocks`: 存储块数量
- `number_of_segments`: 段数量

**列统计信息：**

- `min`: 列中的最小值
- `max`: 列中的最大值
- `null_count`: 空值数量
- `number_of_distinct_values`: 唯一值数量

## 优化管道

Databend 的查询优化器遵循一套精心设计的管道 (Pipeline)，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器管道                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关子查询转换为连接                                 │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集并传播表和列的统计信息                             │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    估算基数和选择性                                       │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    简化复杂的聚合操作                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    在有利时合并并上移过滤器                               │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    应用标准转换规则                                       │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    拆分聚合以实现并行执行                                 │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划找到最优的连接顺序                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将半连接转换为内连接                           │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     移除冗余的连接条件                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
│  │     探索备选的连接顺序                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳的物理实现                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     消除冗余计算                                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化的物理计划                              │
│                为高效执行做好准备                               │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管道实际运行

Databend 的查询优化器通过四个不同的阶段将 SQL 查询转换为高效的执行计划。下面我们来逐一审视每个阶段及其组件优化器：

### 查询准备与统计信息 (步骤 1-3)

**1. 子查询去关联 (Subquery Decorrelation) (SubqueryDecorrelatorOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM customers c
WHERE c.total_orders > (SELECT AVG(total_orders) FROM customers WHERE region = c.region)
```

**之前：**

```
Filter (c.total_orders > Subquery)
└─ Scan (customers as c)
   └─ Subquery: (correlated)
      └─ Aggregate (AVG(total_orders))
         └─ Filter (region = c.region)
            └─ Scan (customers)
```

**之后：**

```
# 相关子查询被转换为连接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为过滤器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将相关子查询 (Correlated Subquery) 转换为连接 (Join)，使其执行速度大幅提升。

**2. 基于统计的聚合优化 (RuleStatsAggregateOptimizer)**

**SQL 示例：**

```sql
SELECT MIN(price) FROM products
```

**之前：**

```
Aggregate (MIN(price))
└─ EvalScalar
   └─ Scan (products)
```

**之后：**

```
# MIN 聚合被替换为来自统计信息的预计算值
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，用表统计信息中的常量值替换某些聚合函数 (MIN, MAX)，从而避免全表扫描。

**3. 统计信息收集 (CollectStatisticsOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**之前：**

```
Filter (region = 'Asia')
└─ Scan (orders)
   [No statistics]
```

**之后：**

```
Filter (region = 'Asia')
└─ Scan (orders)
   Statistics:  # 从存储层收集
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集表和列的实际统计信息，并将其附加到扫描节点。此外，还通过在需要时添加随机过滤器来处理行级采样。

### 基于规则的逻辑优化 (步骤 4-7)

**4. 聚合规范化 (RuleNormalizeAggregateOptimizer)**

**SQL 示例：**

```sql
SELECT COUNT(id), COUNT(*), COUNT(DISTINCT region) FROM orders GROUP BY region
```

**之前：**

```
Aggregate (
  GROUP BY [region],
  COUNT(id),
  COUNT(*),
  COUNT(DISTINCT region)
)
└─ Scan (orders)
```

**之后：**

```
# 优化的聚合
EvalScalar (COUNT(*) AS count_id, COUNT(*) AS count_star)
└─ Aggregate (
     GROUP BY [region],
     COUNT(*),
     COUNT()
   )
   └─ Scan (orders)
```

**作用：** 通过以下方式优化聚合函数：

1. 将 `COUNT(non-nullable)` 重写为 `COUNT(*)`
2. 为多个计数表达式复用单个 `COUNT(*)`
3. 当计数的列已包含在 `GROUP BY` 子句中时，消除 `DISTINCT`

**5. 过滤器上拉 (PullUpFilterOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.region = 'Asia' AND c.status = 'active'
```

**之前：**

```
Filter (c.status = 'active')
└─ Filter (o.region = 'Asia')
   └─ Join (o.customer_id = c.id)
      ├─ Scan (orders as o)
      └─ Scan (customers as c)
```

**之后：**

```
# 过滤器被上拉至顶层
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤条件从较低的节点上拉到计划树的顶部，从而实现更全面的过滤器优化。对于内连接，它还会将连接条件拉入过滤器，将其转换为带过滤器的交叉连接。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 对查询计划递归地应用一组转换规则。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器会持续应用规则，直到没有更多转换可以进行。

**关键规则包括：**

#### 过滤器下推 (Filter Pushdown) 规则

**SQL 示例：**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**之前：**

```
Filter (region = 'Asia')
└─ Scan (orders)
```

**之后 (PushDownFilterScan 规则)：**

```
# 过滤器被下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器下推到存储层，使 Databend 能够跳过读取不相关的数据块。

#### 限制下推 (Limit Pushdown) 规则

**SQL 示例：**

```sql
SELECT * FROM orders ORDER BY order_date LIMIT 10
```

**之前：**

```
Limit (10)
└─ Sort (order_date)
   └─ Scan (orders)
```

**之后 (PushDownLimitSort 规则)：**

```
# 限制被下推穿过排序节点
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 `LIMIT` 子句下推到计划中，以减少昂贵操作需要处理的数据量。

#### 消除规则

**SQL 示例：**

```sql
SELECT * FROM orders WHERE 1=1
```

**之前：**

```
Filter (1=1)
└─ Scan (orders)
```

**之后 (EliminateFilter 规则)：**

```
# 冗余的过滤器被移除
Scan (orders)
```

**作用：** 消除不必要的运算符，如冗余的过滤器、排序或投影。

**7. 聚合拆分 (RecursiveRuleOptimizer - SplitAggregate)**

**SQL 示例：**

```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**之前：**

```
# 单阶段聚合 (模式: Initial)
Aggregate (
  mode=Initial,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Scan (orders)
```

**之后：**

```
# 两阶段聚合
Aggregate (
  mode=Final,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Aggregate (
     mode=Partial,
     groups=[region],
     aggregates=[SUM(amount)]
   )
   └─ Scan (orders)
```

**作用：** 将单个聚合操作拆分为两个阶段 (Partial 和 Final)，从而实现分布式执行。部分聚合可以在每个节点上本地执行，而最终聚合则合并这些部分结果。这是并行聚合处理的先决条件。

### 连接策略优化 (步骤 8-11)

**8. 连接顺序优化 (DPhpyOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE c.region = 'Asia'
```

**之前 (原始顺序)：**

```
Join
├─ Join
│  ├─ orders
│  └─ customers (region='Asia')
└─ products
```

**之后 (优化顺序)：**

```
# 基于成本估算的优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表被移到外层
```

**作用：** 使用动态规划 (Dynamic Programming) 根据表统计信息和连接条件找到最优的连接顺序 (Join Order)。优化器会：

1. 构建一个表示表之间连接关系的查询图
2. 使用动态规划算法 (DPhyp - Dynamic Programming Hyper-graph) 枚举所有可能的连接顺序
3. 对于包含多个表的复杂查询，自适应地切换到贪心算法
4. 基于表的基数 (Cardinality) 和选择性 (Selectivity) 估算每个连接顺序的成本
5. 选择估算成本最低的连接顺序

此优化器对于涉及多个连接的查询尤为重要，因为连接顺序会极大地影响查询性能。

**9. Single Join 到 Inner Join 的转换 (SingleToInnerOptimizer)**

**SQL 示例：**

```sql
SELECT o.* FROM orders o LEFT SINGLE JOIN customers c ON o.customer_id = c.id
```

**之前：**

```
LeftSingleJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**之后：**

```
# Single Join 被转换为 Inner Join
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定安全时，会将 "single" 连接类型 (LeftSingle, RightSingle) 转换为更高效的内连接 (Inner Join)。这种情况发生在优化器使用 `single_to_inner` 标志标记一个连接时，表示该连接可以被安全地转换而不改变查询语义。

**10. 连接条件去重 (DeduplicateJoinConditionOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM t1, t2, t3 WHERE t1.id = t2.id AND t2.id = t3.id AND t3.id = t1.id
```

**之前：**

```
Join (t2.id = t3.id AND t3.id = t1.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**之后：**

```
# 移除了传递性的连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集 (Union-Find) 算法来识别并移除冗余的连接条件，特别是那些可以由其他条件传递推导出的条件。该优化器会：

1. 最初将每列分配到其自身的等价组中
2. 处理每个连接条件，合并相等列的等价组
3. 跳过两列已在同一等价组中的条件
4. 保留维持相同查询语义所需的最小连接条件集

此优化减少了查询执行期间需要评估的连接条件数量，简化了连接操作并可能提升性能。

**11. 连接交换 (CommuteJoin Rule)**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前 (orders 表大于 customers 表)：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表 (1000 万行)
└─ Scan (customers as c)  # 较小的表 (10 万行)
```

**之后 (应用 CommuteJoin 规则)：**

```
# 连接顺序被交换，将较小的表置于左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小的表被移到左侧
└─ Scan (orders as o)  # 较大的表被移到右侧
```

**作用：** 应用连接的交换律来优化物理执行。此规则会：

1. 比较左右输入的基数 (估算的行数)
2. 对于内连接和某些外连接，如果左侧的行数少于右侧，则交换输入
3. 相应地调整连接条件和连接类型 (例如，`LEFT` 变为 `RIGHT`)

由于 Databend 通常在哈希连接 (Hash Join) 中将右侧作为构建端，此优化可确保使用较小的表来构建哈希表，从而通过减少内存使用和哈希表构建时间来提高连接性能。

### 基于成本的物理计划选择 (步骤 12)

**12. 基于成本的实现选择 (CascadesOptimizer)**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现选项的成本，选择执行查询的最高效方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的备选方案                                  │
│                                                           │
│     操作 A                 操作 B                          │
│     成本: 1000      vs.    成本: 100  ✓                    │
│                                                           │
│  2. 选择成本最低的选项                                      │
│                                                           │
│  3. 从选定的选项构建最终计划                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**对于我们的示例查询：**

```
┌─────────────────────────────────────────────────────────┐
│ 操作                  │ 备选方案            │ 成本      │
├───────────────────────┼─────────────────────┼───────────┤
│ SCAN customers        │ FullTableScan       │ 1000      │
│ WHERE region='Asia'   │ FilterScan  ✓       │  100      │
├───────────────────────┼─────────────────────┼───────────┤
│ JOIN                  │ NestedLoopJoin      │ 2000      │
│                       │ HashJoin  ✓         │  500      │
├───────────────────────┼─────────────────────┼───────────┤
│ AGGREGATE             │ SortAggregate       │  800      │
│ GROUP BY customer_name│ HashAggregate  ✓    │  300      │
└───────────────────────┴─────────────────────┴───────────┘
```

**成本计算方式：**

```
┌───────────────────────────────────────────────────────────┐
│ 操作              │ 实际代码实现                           │
├───────────────────┼───────────────────────────────────────┤
│ Scan              │ group.stat_info.cardinality *         │
│                   │ compute_per_row                       │
├───────────────────┼───────────────────────────────────────┤
│ Join              │ build_card * hash_table_per_row +     │
│                   │ probe_card * compute_per_row          │
├───────────────────┼───────────────────────────────────────┤
│ Aggregate         │ card * aggregate_per_row              │
├───────────────────┼───────────────────────────────────────┤
│ Exchange (Hash)   │ cardinality * network_per_row +       │
│                   │ cardinality * compute_per_row         │
└───────────────────┴───────────────────────────────────────┘
```

**成本因子使用以下默认值定义：**

```
┌───────────────────────────────────────────────────────────┐
│ 成本因子            │ 默认值                              │
├─────────────────────┼─────────────────────────────────────┤
│ compute_per_row     │ 1                                   │
├─────────────────────┼─────────────────────────────────────┤
│ hash_table_per_row  │ 10                                  │
├─────────────────────┼─────────────────────────────────────┤
│ aggregate_per_row   │ 5                                   │
├─────────────────────┼─────────────────────────────────────┤
│ network_per_row     │ 50                                  │
└─────────────────────┴─────────────────────────────────────┘
```

**注意：** 这些值显示了不同操作的相对成本。例如，网络操作 (50) 的成本远高于简单计算 (1)，而哈希表 (10) 的成本也高于聚合 (5)。

这些成本因子与基数 (行数) 估算相结合，用于计算每个操作的总成本。优化器随后会选择总成本最低的实现。

成本是递归计算的——一个计划的总成本包括其所有操作及其子操作的成本。

## 总结

Databend 的查询优化器采用一个精密的多阶段管道，将用户的 SQL 查询转换为高效的物理执行计划 (Physical Execution Plan)。它利用 SExpr 进行计划表示、丰富的转换规则集、详细的统计信息和成本模型 (Cost Model) 等核心概念，来探索和评估各种备选计划。

该过程包括：

1.  **准备：** 对子查询进行去关联并收集必要的统计信息。
2.  **逻辑优化：** 应用基于规则的转换 (如过滤器下推、聚合规范化) 来优化逻辑计划结构。
3.  **连接优化：** 使用动态规划等技术战略性地确定最佳的连接顺序和方法。
4.  **物理规划：** 使用 Cascades 框架选择最具成本效益的物理运算符 (例如，哈希连接 (Hash Join) vs. 嵌套循环连接 (Nested Loop Join))。

通过系统地应用这些步骤，优化器旨在最小化资源使用 (CPU、内存、I/O) 并最大化查询执行速度。