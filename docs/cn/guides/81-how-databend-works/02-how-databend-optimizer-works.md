# Databend 优化器如何工作

## 核心概念

Databend 的查询优化器建立在几个关键抽象之上，这些抽象协同工作以将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                    │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符的树状表示                              │
│ Pipeline        │ 优化阶段的序列                                  │
│ Rules           │ 模式匹配转换                                    │
│ Cost Model      │ 用于执行估计的数学模型                            │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息来指导优化决策：

**表统计信息：**
- `num_rows`: 表中的行数
- `data_size`: 表数据的大小（以字节为单位）
- `number_of_blocks`: 存储块的数量
- `number_of_segments`: 段的数量

**列统计信息：**
- `min`: 列中的最小值
- `max`: 列中的最大值
- `null_count`: 空值的数量
- `number_of_distinct_values`: 唯一值的数量

## 优化 Pipeline

Databend 的查询优化器遵循精心设计的 Pipeline，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                           优化器 Pipeline                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关的子查询转换为连接                              │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集和传播表和列的统计信息                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    估计基数和选择性                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    简化复杂的聚合操作                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    在有益时组合并将过滤器向上移动                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    应用标准转换规则                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    拆分聚合以进行并行执行                                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划查找最佳连接顺序                        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    尽可能将半连接转换为内连接                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     删除冗余的连接条件                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (如果启用了连接重排序)                   │    │
│  │     探索替代的连接顺序                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳的物理实现                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (有条件)                      │    │
│  │     消除冗余的计算                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           优化的物理计划                           │
│                      准备好进行高效执行                             │
└─────────────────────────────────────────────────────────────────┘
```

## 优化 Pipeline 实践

Databend 的查询优化器经过四个不同的阶段，将 SQL 查询转换为高效的执行计划。让我们检查每个阶段及其组件优化器：

### 查询准备和统计信息（步骤 1-3）

**1. 子查询去关联（SubqueryDecorrelatorOptimizer）**


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
# 相关子查询转换为连接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为过滤器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将相关子查询转换为连接，使其执行速度更快。

**2. 基于统计信息的聚合优化 (RuleStatsAggregateOptimizer)**

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
# MIN 聚合被来自统计信息的预计算值替换
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 尽可能地用表统计信息中的常量值替换某些聚合函数（MIN、MAX），从而避免全表扫描。

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
   Statistics:  # 从存储收集
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集表和列的实际统计信息，并将它们附加到扫描节点。 还会通过在需要时添加随机过滤器来处理行级采样。

### 基于逻辑规则的优化（步骤 4-7）

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
1. 将 COUNT(non-nullable) 重写为 COUNT(*)
2. 为多个计数表达式重用单个 COUNT(*)
3. 在对已在 GROUP BY 中的列进行计数时消除 DISTINCT

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
# 过滤器拉到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤器条件从较低的节点拉到计划树的顶部，从而可以进行更全面的过滤器优化。 对于内连接，它还会将连接条件拉入过滤器，将其转换为带有过滤器的交叉连接。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 将一组转换规则递归地应用于查询计划。 每条规则都匹配计划中的特定模式，并将其转换为更有效的形式。 优化器会一直应用规则，直到无法进行更多转换为止。

**主要规则包括：**

#### 过滤器下推规则

**SQL 示例：**
```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**之前：**
```
Filter (region = 'Asia')
└─ Scan (orders)
```

**之后 (PushDownFilterScan rule):**
```
# 过滤器下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器推送到存储层，允许 Databend 跳过读取不相关的数据块。

#### Limit 下推规则

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

**之后 (PushDownLimitSort rule):**
```
# Limit 通过排序下推
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 LIMIT 子句下推到计划中，以减少昂贵操作处理的数据量。

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

**之后 (EliminateFilter rule):**
```
# 删除冗余过滤器
Scan (orders)
```

**作用：** 消除不必要的操作符，如冗余过滤器、排序或投影。

**7. 聚合拆分 (RecursiveRuleOptimizer - SplitAggregate)**

**SQL 示例：**
```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**之前：**
```
# 单阶段聚合 (mode: Initial)
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

**作用：** 将单个聚合操作拆分为两个阶段（Partial 和 Final），从而实现分布式执行。 部分聚合可以在每个节点上本地执行，最终聚合将合并部分结果。 这是并行聚合处理的先决条件。

### 连接策略优化（步骤 8-11）

**8. 连接顺序优化 (DPhpyOptimizer)**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE c.region = 'Asia'
```

**之前（原始顺序）：**
```
Join
├─ Join
│  ├─ orders
│  └─ customers (region='Asia')
└─ products
```

**之后（优化后的顺序）：**
```
# 基于成本估算优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移到外面
```

**作用：** 使用动态规划根据表统计信息和连接条件找到最佳连接顺序。 优化器：

1. 构建一个查询图，表示表之间的连接关系
2. 使用动态规划算法 (DPhyp - Dynamic Programming Hyper-graph) 枚举所有可能的连接顺序
3. 对于具有许多表的复杂查询，自适应地切换到贪婪算法
4. 根据表基数和选择性估算每个连接顺序的成本
5. 选择估计成本最低的连接顺序

此优化器对于涉及多个连接的查询尤为重要，在这些查询中，连接顺序会极大地影响查询性能。

**9. 单连接到内连接转换 (SingleToInnerOptimizer)**

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
# 单连接转换为内连接
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定这样做是安全的时候，将“single”连接类型（LeftSingle、RightSingle）转换为更有效的内连接。 当优化器使用 `single_to_inner` 标志标记连接时，会发生这种情况，表明可以安全地转换连接而不会更改查询语义。

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
# 删除传递连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用 Union-Find 算法识别并删除冗余连接条件，特别是那些由其他条件传递隐含的条件。 此优化器：

1. 最初将每列分配到其自己的等价组
2. 处理每个连接条件，合并相等列的等价组
3. 跳过两列已在同一等价组中的条件
4. 保留维护相同查询语义所需的最小连接条件集

此优化减少了查询执行期间需要评估的连接条件的数量，简化了连接操作并可能提高了性能。

**11. 连接交换 (CommuteJoin Rule)**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前（orders 大于 customers）：**
```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表（10M 行）
└─ Scan (customers as c)  # 较小的表（100K 行）
```

**之后（应用 CommuteJoin 规则）：**
```
# 交换连接顺序以将较小的表放在左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小的表移到左侧
└─ Scan (orders as o)  # 较大的表移到右侧
```

**作用：** 应用连接的交换律来优化物理执行。 此规则：

1. 比较左右输入的基数（估计的行数）
2. 对于内连接和某些外连接，如果左侧的行数少于右侧，则交换输入
3. 相应地调整连接条件和连接类型（例如，LEFT 变为 RIGHT）

由于 Databend 通常使用右侧作为哈希连接中的构建侧，因此此优化可确保使用较小的表来构建哈希表，从而通过减少内存使用量和哈希表构建时间来提高连接性能。

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择 (CascadesOptimizer)**

**SQL 示例：**
```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现选项的成本，选择执行查询的最有效方式。

**Cascades 的工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES OPTIMIZER                      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. COMPARE ALTERNATIVES FOR EACH OPERATION               │
│                                                           │
│     Operation A                Operation B                │
│     Cost: 1000      vs.       Cost: 100  ✓                │
│                                                           │
│  2. SELECT LOWEST-COST OPTION                             │
│                                                           │
│  3. BUILD FINAL PLAN FROM SELECTED OPTIONS                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**对于我们的示例查询：**


```
┌─────────────────────────────────────────────────────────┐
│ OPERATION             │ ALTERNATIVES        │ COST      │
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
│ OPERATION         │ ACTUAL CODE IMPLEMENTATION            │
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
│ COST FACTOR         │ DEFAULT VALUE                       │
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

**注意：** 这些值显示了不同操作的相对成本。例如，网络操作 (50) 比简单计算 (1) 昂贵得多，哈希表 (10) 比聚合 (5) 昂贵。

这些成本因子与基数（行数）估计相结合，以计算每个操作的总成本。然后，优化器选择总成本最低的实现。

成本是递归计算的 - 计划的总成本包括其所有操作及其子操作。

## 总结

Databend 的查询优化器采用复杂的多阶段管道，将用户 SQL 查询转换为高效的物理执行计划。它利用 SExpr 等核心概念进行计划表示、丰富的转换规则集、详细的统计信息和成本模型来探索和评估各种计划备选方案。

该过程包括：
1.  **准备：** 对子查询进行去关联并收集必要的统计信息。
2.  **逻辑优化：** 应用基于规则的转换（如过滤器下推、聚合规范化）来优化逻辑计划结构。
3.  **Join 优化：** 使用动态规划等技术，策略性地确定最佳 Join 顺序和方法。
4.  **物理规划：** 使用 Cascades 框架选择最具成本效益的物理运算符（例如，Hash Join 与 Nested Loop Join）。

通过系统地应用这些步骤，优化器旨在最大限度地减少资源使用（CPU、内存、I/O）并最大限度地提高查询执行速度。
