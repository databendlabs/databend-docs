title: Databend 查询优化器工作原理
---

## 核心概念

Databend 的查询优化器 (Query Optimizer) 基于若干关键抽象构建，它们协同工作，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系算子的树形表示                              │
│ Pipeline        │ 一系列优化阶段                                  │
│ Rules           │ 基于模式匹配的转换规则                          │
│ Cost Model      │ 用于估算执行成本的数学模型                      │
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

## 优化管线 (Pipeline)

Databend 的查询优化器遵循精心设计的管线 (Pipeline)，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器管线                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关子查询转换为联接                                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集并传播表和列的统计信息                            │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    估算基数和选择性                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    简化复杂的聚合操作                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    在有利时合并筛选器并将其上提                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    应用标准转换规则                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    拆分聚合以实现并行执行                                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划寻找最优联接顺序                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将半联接转换为内联接                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     移除冗余的联接条件                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (如果启用联接重排序)               │    │
│  │     探索其他联接顺序                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳物理实现                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (条件性)                   │    │
│  │     消除冗余计算                                        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化后的物理计划                            │
│                     准备高效执行                                │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管线实战

Databend 的查询优化器通过四个不同的阶段将 SQL 查询转换为高效的执行计划。下面我们来逐一审视每个阶段及其组件优化器：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询去关联 (SubqueryDecorrelatorOptimizer)**

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
# 相关子查询转换为联接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为筛选器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将相关子查询转换为联接，从而大幅提升其执行速度。

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
# MIN 聚合被统计信息中的预计算值替换
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，使用表统计信息中的常量值替换某些聚合函数（如 MIN、MAX），从而避免全表扫描。

**3. 统计信息收集 (CollectStatisticsOptimizer)**

**SQL 示例：**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**之前：**

```
Filter (region = 'Asia')
└─ Scan (orders)
   [无统计信息]
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

**作用：** 从存储层为表和列收集实际的统计信息，并将其附加到扫描节点。此外，还通过在需要时添加随机筛选器来处理行级采样。

### 基于逻辑规则的优化（步骤 4-7）

**4. 聚合标准化 (RuleNormalizeAggregateOptimizer)**

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

1. 将 COUNT(非空列) 重写为 COUNT(*)
2. 为多个计数表达式重用单个 COUNT(*)
3. 当计数的列已包含在 GROUP BY 子句中时，消除 DISTINCT

**5. 筛选器上提 (PullUpFilterOptimizer)**

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
# 筛选器上提到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将筛选条件从计划树的较低节点上提到顶部，这使得更全面的筛选器优化成为可能。对于内联接，它还会将联接条件提取到筛选器中，从而将它们转换为带筛选器的交叉联接。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 将一组转换规则递归地应用于查询计划。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器持续应用规则，直到无法进行更多转换。

**关键规则包括：**

#### 筛选器下推规则

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
# 筛选器下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将筛选器下推至存储层，允许 Databend 跳过读取不相关的数据块。

#### LIMIT 下推规则

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
# LIMIT 通过排序下推
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 LIMIT 子句在计划中下推，以减少昂贵操作处理的数据量。

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
# 冗余筛选器被移除
Scan (orders)
```

**作用：** 消除不必要的算子，如冗余的筛选器、排序或投影。

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

**作用：** 将单个聚合操作拆分为两个阶段（Partial 和 Final），以实现分布式执行。部分聚合可以在每个节点上本地执行，而最终聚合则合并这些部分结果。这是并行聚合处理的先决条件。

### 联接策略优化（步骤 8-11）

**8. 联接顺序优化 (DPhpyOptimizer)**

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

**之后（优化顺序）：**

```
# 基于成本估算的优化联接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移到外侧
```

**作用：** 基于表统计信息和联接条件，使用动态规划来寻找最优的联接顺序。优化器：

1. 构建表示表之间联接关系的查询图
2. 使用动态规划算法（DPhyp，即 Dynamic Programming Hyper-graph）来枚举所有可能的联接顺序
3. 对于包含多个表的复杂查询，自适应地切换到贪心算法
4. 基于表的基数 (cardinality) 和选择性 (selectivity) 估算每个联接顺序的成本
5. 选择估算成本最低的联接顺序

此优化器对于涉及多个联接的查询尤为重要，因为联接顺序会极大地影响查询性能。

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
# Single Join 转换为 Inner Join
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定安全时，将 “single” 联接类型（LeftSingle、RightSingle）转换为更高效的内联接。这种情况发生在优化器使用 `single_to_inner` 标志标记一个联接，表明该联接可以被安全地转换而不改变查询语义。

**10. 联接条件去重 (DeduplicateJoinConditionOptimizer)**

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
# 移除传递性联接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集 (Union-Find) 算法来识别并移除冗余的联接条件，特别是那些可以由其他条件传递推导出的条件。此优化器：

1. 首先，将每个列分配到其自身的等价组中
2. 然后，处理每个联接条件，合并相等列的等价组
3. 跳过两个列已属于同一等价组的条件
4. 保留维持相同查询语义所需的最小联接条件集

此优化减少了查询执行期间需要评估的联接条件数量，从而简化了联接操作并可能提升性能。

**11. 联接交换 (CommuteJoin Rule)**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前（orders 表大于 customers 表）：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表 (10M rows)
└─ Scan (customers as c)  # 较小的表 (100K rows)
```

**之后（应用 CommuteJoin 规则）：**

```
# 联接顺序交换，将较小的表放在左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小的表移到左侧
└─ Scan (orders as o)  # 较大的表移到右侧
```

**作用：** 应用联接的交换律来优化物理执行。此规则：

1. 比较左、右输入的基数（估算的行数）
2. 对于内联接和某些外联接，如果左侧的行数少于右侧，则交换输入
3. 并相应地调整联接条件和联接类型（例如，LEFT 变为 RIGHT）

由于 Databend 在哈希联接 (Hash Join) 中通常使用右侧作为构建端 (Build Side)，此优化可确保使用较小的表来构建哈希表，从而通过减少内存使用和哈希表构建时间来提升联接性能。

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择 (CascadesOptimizer)**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现方案的成本，选择执行查询的最高效方式。

**Cascades 工作原理如下：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个算子的备选实现                                │
│                                                           │
│     算子 A                 算子 B                          │
│     成本: 1000      vs.    成本: 100  ✓                    │
│                                                           │
│  2. 选择成本最低的方案                                    │
│                                                           │
│  3. 基于所选方案构建最终计划                              │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**以上述查询为例：**

```
┌─────────────────────────────────────────────────────────┐
│ 算子                  │ 备选实现            │ 成本      │
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

**成本计算方式如下：**

```
┌───────────────────────────────────────────────────────────┐
│ 算子              │ 实际代码实现                           │
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

**成本因子及其默认值如下：**

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

**注意：** 这些值反映了不同操作的相对成本。例如，网络操作（50）远比简单计算（1）昂贵，而哈希表构建（10）比聚合（5）更昂贵。

这些成本因子与基数（行数）估算相结合，用于计算每个算子的总成本。优化器随后会选择总成本最低的实现方案。

成本是递归计算的——一个计划的总成本包括其所有算子及其子节点的成本。

## 总结

Databend 的查询优化器采用一个复杂的多阶段管线 (Pipeline)，将用户 SQL 查询转换为高效的物理执行计划。它利用 SExpr（用于计划表示）、丰富的转换规则集、详细的统计信息和成本模型等核心概念，来探索和评估各种备选计划。

该过程包括：

1.  **准备：** 对子查询进行去关联，并收集必要的统计信息。
2.  **逻辑优化：** 应用基于规则的转换（如筛选器下推、聚合标准化）来优化逻辑计划的结构。
3.  **联接优化：** 使用动态规划等技术，从策略上确定最佳的联接顺序和方法。
4.  **物理规划：** 使用 Cascades 框架选择最具成本效益的物理算子（例如，哈希联接 vs. 嵌套循环联接）。

通过系统地应用这些步骤，优化器旨在最大限度地减少资源使用（CPU、内存、I/O）并最大化查询执行速度。