---
title: Databend 查询优化器工作原理
---

## 核心概念

Databend 的查询优化器（Query Optimizer）是基于几个关键的抽象构建的，这些抽象协同工作，将 SQL 查询（Query）转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系算子的树形表示                            │
│ Pipeline        │ 优化阶段的序列                                │
│ Rules           │ 模式匹配转换                                  │
│ Cost Model      │ 用于执行估算的数学模型                        │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息来指导优化决策：

**表统计信息（Table Statistics）：**

- `num_rows`：表中的行数
- `data_size`：表数据的大小（字节）
- `number_of_blocks`：存储块的数量
- `number_of_segments`：段的数量

**列统计信息（Column Statistics）：**

- `min`：列中的最小值
- `max`：列中的最大值
- `null_count`：空值的数量
- `number_of_distinct_values`：唯一值的数量

## 优化器流水线

Databend 的查询优化器（Query Optimizer）遵循一个精心设计的流水线，将 SQL 查询（Query）转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器流水线（Optimizer Pipeline）             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将关联子查询转换为连接                               │    │
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
│  │    在有益时合并并上移过滤器                             │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    应用标准的转换规则                                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    拆分聚合以进行并行执行                               │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划寻找最优的连接顺序                       │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将半连接转换为内连接                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     移除冗余的连接条件                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
│  │     探索备选的连接顺序                                  │    │
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
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     消除冗余计算                                        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化后的物理计划                            │
│                      可供高效执行                               │
└─────────────────────────────────────────────────────────────────┘
```

## 优化器流水线实战

Databend 的查询优化器（Query Optimizer）通过四个不同的阶段将 SQL 查询（Query）转换为高效的执行计划。让我们来逐一审视每个阶段及其组件优化器：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询去关联（SubqueryDecorrelatorOptimizer）**

**SQL 示例：**

```sql
SELECT * FROM customers c
WHERE c.total_orders > (SELECT AVG(total_orders) FROM customers WHERE region = c.region)
```

**优化前：**

```
Filter (c.total_orders > Subquery)
└─ Scan (customers as c)
   └─ Subquery: (correlated)
      └─ Aggregate (AVG(total_orders))
         └─ Filter (region = c.region)
            └─ Scan (customers)
```

**优化后：**

```sql
# 关联子查询被转换为连接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件成为一个过滤器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将关联子查询转换为连接（Join），使其执行速度更快。

**2. 基于统计信息的聚合优化（RuleStatsAggregateOptimizer）**

**SQL 示例：**

```sql
SELECT MIN(price) FROM products
```

**优化前：**

```
Aggregate (MIN(price))
└─ EvalScalar
   └─ Scan (products)
```

**优化后：**

```sql
# MIN 聚合被替换为从统计信息中预先计算的值
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，用表统计信息中的常量值替换某些聚合函数（MIN, MAX），从而避免全表扫描。

**3. 统计信息收集（CollectStatisticsOptimizer）**

**SQL 示例：**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**优化前：**

```
Filter (region = 'Asia')
└─ Scan (orders)
   [No statistics]
```

**优化后：**

```
Filter (region = 'Asia')
└─ Scan (orders)
   Statistics:  # 从存储中收集
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集表和列的实际统计信息，并将其附加到扫描节点上。还通过在需要时添加随机过滤器来处理行级采样。

### 基于逻辑规则的优化（步骤 4-7）

**4. 聚合规范化（RuleNormalizeAggregateOptimizer）**

**SQL 示例：**

```sql
SELECT COUNT(id), COUNT(*), COUNT(DISTINCT region) FROM orders GROUP BY region
```

**优化前：**

```
Aggregate (
  GROUP BY [region],
  COUNT(id),
  COUNT(*),
  COUNT(DISTINCT region)
)
└─ Scan (orders)
```

**优化后：**

```sql
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

1. 将 COUNT(非空列) 重写为 COUNT(\*)
2. 对多个计数表达式复用单个 COUNT(\*)
3. 当计数的列已在 GROUP BY 中时，消除 DISTINCT

**5. 过滤器上拉（PullUpFilterOptimizer）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.region = 'Asia' AND c.status = 'active'
```

**优化前：**

```
Filter (c.status = 'active')
└─ Filter (o.region = 'Asia')
   └─ Join (o.customer_id = c.id)
      ├─ Scan (orders as o)
      └─ Scan (customers as c)
```

**优化后：**

```sql
# 过滤器被上拉到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将下层节点的过滤条件上拉到计划树的顶部，从而实现更全面的过滤器优化。对于内连接（Inner Join），它还会将连接（Join）条件拉入过滤器，将其转换为带过滤器的交叉连接。

**6. 默认重写规则（RecursiveRuleOptimizer）**

**作用：** 将一组转换规则递归地应用于查询计划。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器会持续应用规则，直到无法进行更多转换为止。

**关键规则包括：**

#### 过滤器下推规则（Filter Pushdown Rules）

**SQL 示例：**

```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**优化前：**

```
Filter (region = 'Asia')
└─ Scan (orders)
```

**优化后（PushDownFilterScan 规则）：**

```sql
# 过滤器被下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器下推到存储层，使 Databend 能够跳过读取不相关的数据块。

#### Limit 下推规则（Limit Pushdown Rules）

**SQL 示例：**

```sql
SELECT * FROM orders ORDER BY order_date LIMIT 10
```

**优化前：**

```
Limit (10)
└─ Sort (order_date)
   └─ Scan (orders)
```

**优化后（PushDownLimitSort 规则）：**

```sql
# Limit 被下推穿过排序
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 LIMIT 子句下推到计划中，以减少昂贵操作处理的数据量。

#### 消除规则（Elimination Rules）

**SQL 示例：**

```sql
SELECT * FROM orders WHERE 1=1
```

**优化前：**

```
Filter (1=1)
└─ Scan (orders)
```

**优化后（EliminateFilter 规则）：**

```sql
# 冗余过滤器被移除
Scan (orders)
```

**作用：** 消除不必要的操作符，如冗余的过滤器、排序或投影。

**7. 聚合拆分（RecursiveRuleOptimizer - SplitAggregate）**

**SQL 示例：**

```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**优化前：**

```sql
# 单阶段聚合（模式：初始）
Aggregate (
  mode=Initial,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Scan (orders)
```

**优化后：**

```sql
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

**作用：** 将单个聚合操作拆分为两个阶段（部分聚合和最终聚合），从而实现分布式执行。部分聚合可以在每个节点上本地执行，最终聚合则合并部分结果。这是并行聚合处理的先决条件。

### 连接策略优化（步骤 8-11）

**8. 连接顺序优化（DPhpyOptimizer）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE c.region = 'Asia'
```

**优化前（原始顺序）：**

```
Join
├─ Join
│  ├─ orders
│  └─ customers (region='Asia')
└─ products
```

**优化后（优化顺序）：**

```sql
# 基于成本估算的优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表被移到外层
```

**作用：** 使用动态规划来寻找基于表统计信息和连接（Join）条件的最优连接顺序。优化器会：

1. 构建一个表示表之间连接（Join）关系的查询图
2. 使用动态规划算法（DPhyp - Dynamic Programming Hyper-graph）枚举所有可能的连接顺序
3. 对于包含多张表的复杂查询，自适应地切换到贪心算法
4. 根据表的基数和选择性估算每个连接顺序的成本
5. 选择估算成本最低的连接顺序

这个优化器对于涉及多个连接（Join）的查询尤其重要，因为连接顺序会极大地影响查询性能。

**9. Single Join 到 Inner Join 的转换（SingleToInnerOptimizer）**

**SQL 示例：**

```sql
SELECT o.* FROM orders o LEFT SINGLE JOIN customers c ON o.customer_id = c.id
```

**优化前：**

```
LeftSingleJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**优化后：**

```sql
# Single join 被转换为 inner join
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定可以安全地转换时，将 "single" 连接类型（LeftSingle, RightSingle）转换为更高效的内连接（Inner Join）。这种情况发生在优化器用 `single_to_inner` 标志标记了一个连接（Join），表明该连接（Join）可以在不改变查询语义的情况下安全转换。

**10. 连接条件去重（DeduplicateJoinConditionOptimizer）**

**SQL 示例：**

```sql
SELECT * FROM t1, t2, t3 WHERE t1.id = t2.id AND t2.id = t3.id AND t3.id = t1.id
```

**优化前：**

```
Join (t2.id = t3.id AND t3.id = t1.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**优化后：**

```sql
# 移除了传递性的连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集（Union-Find）算法来识别和移除冗余的连接（Join）条件，特别是那些由其他条件传递性地推导出的条件。该优化器会：

1. 最初将每个列分配到其自己的等价组中
2. 处理每个连接（Join）条件，合并相等列的等价组
3. 跳过两个列已在同一等价组中的条件
4. 保留维持相同查询语义所需的最小连接（Join）条件集

此优化减少了查询执行期间需要评估的连接（Join）条件数量，简化了连接（Join）操作，并可能提高性能。

**11. 连接交换（CommuteJoin 规则）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**优化前（orders 表大于 customers 表）：**

```sql
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表（1000 万行）
└─ Scan (customers as c)  # 较小的表（10 万行）
```

**优化后（应用 CommuteJoin 规则）：**

```sql
# 交换连接顺序，将较小的表放在左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小的表被移到左侧
└─ Scan (orders as o)  # 较大的表被移到右侧
```

**作用：** 应用连接（Join）的交换律来优化物理执行。此规则：

1. 比较左侧和右侧输入的基数（估算的行数）
2. 对于内连接（Inner Join）和某些外连接，如果左侧的行数少于右侧，则交换输入
3. 相应地调整连接（Join）条件和连接（Join）类型（例如，LEFT 变为 RIGHT）

由于 Databend 在哈希连接中通常使用右侧作为构建端，此优化确保使用较小的表来构建哈希表，从而通过减少内存使用和哈希表构建时间来提高连接（Join）性能。

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择（CascadesOptimizer）**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现选项的成本，选择执行查询的最有效方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
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
│ 操作                  │ 备选方案            │ 成本      │
├───────────────────────┼─────────────────────┼───────────┤
│ 扫描 customers        │ FullTableScan       │ 1000      │
│ WHERE region='Asia'   │ FilterScan  ✓       │  100      │
├───────────────────────┼─────────────────────┼───────────┤
│ 连接                  │ NestedLoopJoin      │ 2000      │
│                       │ HashJoin  ✓         │  500      │
├───────────────────────┼─────────────────────┼───────────┤
│ 聚合                  │ SortAggregate       │  800      │
│ GROUP BY customer_name│ HashAggregate  ✓    │  300      │
└───────────────────────┴─────────────────────┴───────────┘
```

**成本如何计算：**

```
┌───────────────────────────────────────────────────────────┐
│ 操作              │ 实际代码实现                          │
├───────────────────┼───────────────────────────────────────┤
│ 扫描              │ group.stat_info.cardinality *         │
│                   │ compute_per_row                       │
├───────────────────┼───────────────────────────────────────┤
│ 连接              │ build_card * hash_table_per_row +     │
│                   │ probe_card * compute_per_row          │
├───────────────────┼───────────────────────────────────────┤
│ 聚合              │ card * aggregate_per_row              │
├───────────────────┼───────────────────────────────────────┤
│ 交换 (哈希)       │ cardinality * network_per_row +       │
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

**注意：** 这些值显示了不同操作的相对成本。例如，网络操作（50）比简单计算（1）昂贵得多，而哈希表（10）比聚合（5）更昂贵。

这些成本因子与基数（行数）估算相结合，用于计算每个操作的总成本。然后，优化器选择总成本最低的实现。

成本是递归计算的——一个计划的总成本包括其所有操作及其子操作的成本。

## 总结

Databend 的查询优化器（Query Optimizer）采用了一个复杂的多阶段流水线，将用户的 SQL 查询（Query）转换为高效的物理执行计划。它利用了诸如 SExpr（用于计划表示）、丰富的转换规则集、详细的统计信息和成本模型等核心概念，来探索和评估各种计划备选方案。

该过程包括：

1.  **准备阶段：** 对子查询进行去关联，并收集必要的统计信息。
2.  **逻辑优化：** 应用基于规则的转换（如过滤器下推、聚合规范化）来优化逻辑计划结构。
3.  **连接优化：** 使用动态规划等技术，策略性地确定最佳的连接顺序和方法。
4.  **物理计划：** 使用 Cascades 框架选择成本效益最高的物理操作符（例如，哈希连接 vs. 嵌套循环连接）。

通过系统地应用这些步骤，优化器旨在最小化资源使用（CPU、内存、I/O）并最大化查询执行速度。