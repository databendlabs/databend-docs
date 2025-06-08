---
title: Databend 查询优化器工作原理
---

## 核心概念

Databend 的查询优化器 (Query Optimizer) 基于若干关键抽象构建，这些抽象协同工作，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系算子的树形表示                            │
│ Pipeline        │ 优化阶段的序列                                │
│ Rules           │ 模式匹配转换规则                              │
│ Cost Model      │ 用于执行成本估算的数学模型                    │
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

## 优化流水线

Databend 的查询优化器遵循精心设计的流水线，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器流水线                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将关联子查询转换为联接                             │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集并传播表和列的统计信息                           │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    估算基数和选择性                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    简化复杂的聚合操作                                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    在有利时合并和上提过滤器                             │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    应用标准转换规则                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    拆分聚合以实现并行执行                               │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划寻找最优联接顺序                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将 Single Join 转换为 Inner Join             │    │
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
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
│  │     探索其他联接顺序                                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳的物理实现方案                              │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     消除冗余计算                                        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化后的物理计划 (Physical Plan)            │
│                可供高效执行                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 优化流水线实际运行

Databend 的查询优化器通过四个不同的阶段将 SQL 查询转换为高效的执行计划。让我们逐一审视每个阶段及其包含的优化器：

### 查询准备与统计信息 (步骤 1-3)

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
# 关联子查询被转换为联接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为一个过滤器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将关联子查询 (correlated subquery) 转换为联接 (join)，从而大幅提升执行速度。

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
# MIN 聚合被替换为来自统计信息的预计算值
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，用表统计信息中的常量值替换某些聚合函数 (例如 `MIN`、`MAX`)，从而避免全表扫描。

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

**作用：** 从存储层收集表和列的实际统计信息，并附加到扫描节点。此外，当需要时，它还会通过添加随机过滤器来支持行级采样。

### 基于逻辑规则的优化 (步骤 4-7)

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
# 优化后的聚合
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
2. 为多个计数表达式复用同一个 `COUNT(*)`
3. 当计数的列已包含在 `GROUP BY` 子句中时，消除 `DISTINCT`

**5. 过滤器上提 (PullUpFilterOptimizer)**

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
# 过滤器被上提到顶层
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤条件从较低的节点上提到计划树的顶部，从而实现更全面的过滤器优化。对于 `Inner Join`，它还会将联接条件上提到过滤器中，将其转换为带过滤器的 `Cross Join`。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 以递归方式对查询计划应用一组转换规则。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器会持续应用规则，直至计划不再发生变化。

**关键规则包括：**

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

**之后 (PushDownFilterScan 规则)：**

```
# 过滤器被下推至扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器下推到存储层，使 Databend 能够跳过读取不相关的数据块。

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
# LIMIT 被下推穿过排序节点
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 `LIMIT` 子句下推到计划树的更深层级，以减少昂贵操作所需处理的数据量。

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
# 冗余过滤器被移除
Scan (orders)
```

**作用：** 消除不必要的算子，如冗余的过滤器、排序或投影。

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

**作用：** 将单个聚合操作拆分为 `Partial` (部分) 和 `Final` (最终) 两个阶段，从而实现分布式执行。`Partial` 聚合可以在每个节点上本地执行，而 `Final` 聚合则负责合并各个部分结果。这是实现并行聚合处理的前提。

### 联接策略优化 (步骤 8-11)

**8. 联接顺序优化 (DPhpyOptimizer)**

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
# 基于成本估算优化后的联接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表被移至外层
```

**作用：** 使用动态规划 (dynamic programming)，根据表统计信息和联接条件，寻找最优的联接顺序。该优化器会：

1. 构建表示表之间联接关系的查询图
2. 使用动态规划超图算法 (DPhyp - Dynamic Programming Hyper-graph) 枚举所有可能的联接顺序
3. 对于包含多张表的复杂查询，自适应地切换到贪心算法 (greedy algorithm)
4. 基于表的基数 (cardinality) 和选择性 (selectivity) 估算每种联接顺序的成本
5. 选择估算成本最低的联接顺序

此优化器对于涉及多表联接的查询尤为重要，因为联接顺序会极大地影响查询性能。

**9. `Single Join` 到 `Inner Join` 的转换 (SingleToInnerOptimizer)**

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

**作用：** 当优化器确定可以安全转换时，会将 `Single Join` 类型 (`LeftSingle`, `RightSingle`) 转换为更高效的 `Inner Join`。这通常发生在优化器为某个联接添加了 `single_to_inner` 标记之后，该标记表明此联接可以在不改变查询语义的前提下安全地进行转换。

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
# 移除了传递性联接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集 (Union-Find) 算法来识别并移除冗余的联接条件，特别是那些由其他条件传递推导出的条件。该优化器会：

1. 首先将每个列分配到其自身的等价组中
2. 处理每个联接条件，将相等的列所在的等价组进行合并
3. 如果某个条件的两边列已属于同一个等价组，则跳过该条件
4. 保留维持相同查询语义所需的最小联接条件集合

此优化减少了查询执行期间需要评估的联接条件数量，从而简化了联接操作，并有可能提升性能。

**11. 联接交换 (CommuteJoin Rule)**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前 (orders 比 customers 大)：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表 (10M rows)
└─ Scan (customers as c)  # 较小的表 (100K rows)
```

**之后 (应用 CommuteJoin 规则)：**

```
# 交换联接顺序，将小表置于左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小的表被移至左侧
└─ Scan (orders as o)  # 较大的表被移至右侧
```

**作用：** 应用联接的交换律 (commutativity) 来优化物理执行。该规则会：

1. 比较左、右两侧输入的基数 (即估算的行数)
2. 对于 `Inner Join` 和某些 `Outer Join`，如果左侧的行数少于右侧，则交换两侧输入
3. 并相应地调整联接条件和联接类型 (例如，`LEFT` 变为 `RIGHT`)

由于 Databend 在哈希联接 (Hash Join) 中通常使用右侧输入作为构建端 (build side)，此优化可确保使用较小的表来构建哈希表，从而通过减少内存使用和哈希表构建时间来提升联接性能。

### 基于成本的物理计划选择 (步骤 12)

**12. 基于成本的实现选择 (CascadesOptimizer)**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现方案的成本，选择最高效的查询执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的可选方案                                │
│                                                           │
│     方案 A                 方案 B                          │
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
│ 操作                  │ 可选方案            │ 成本      │
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

**成本因子及其默认值定义如下：**

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

**注意：** 这些值反映了不同操作之间的相对成本。例如，网络操作 (50) 的成本远高于简单计算 (1)，而构建哈希表 (10) 的成本也高于聚合 (5)。

这些成本因子与基数 (行数) 估算相结合，用于计算每个操作的总成本。优化器最终会选择总成本最低的实现方案。

成本是递归计算的——一个计划的总成本是其所有操作及其子操作的成本之和。

## 总结

Databend 的查询优化器采用一个精密的多阶段流水线，将用户的 SQL 查询转换为高效的物理执行计划。它利用 SExpr (用于计划表示)、丰富的转换规则集、详细的统计信息和成本模型 (Cost Model) 等核心概念，来探索和评估各种可选的执行计划。

该过程包括：

1.  **准备**：对子查询进行去关联，并收集必要的统计信息。
2.  **逻辑优化**：应用基于规则的转换 (如过滤器下推、聚合规范化) 来优化逻辑计划的结构。
3.  **联接优化**：使用动态规划等技术，从战略上确定最佳的联接顺序和方法。
4.  **物理规划**：使用 Cascades 框架选择成本效益最高的物理算子 (例如，`Hash Join` 与 `Nested Loop Join`)。

通过系统地应用这些步骤，优化器旨在最小化资源使用 (CPU、内存、I/O) 并最大化查询执行速度。