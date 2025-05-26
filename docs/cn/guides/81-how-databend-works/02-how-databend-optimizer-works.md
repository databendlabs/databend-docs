# Databend 优化器工作原理

## 核心概念

Databend 的查询优化器建立在几个关键抽象之上，这些抽象协同工作，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ Core Optimizer Components                                       │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ Tree representation of relational operators   │
│ Pipeline        │ Sequence of optimization phases               │
│ Rules           │ Pattern-matching transformations              │
│ Cost Model      │ Mathematical models for execution estimation  │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息来指导优化决策：

**表统计信息：**
- `num_rows`: 表中的行数
- `data_size`: 表数据的大小 (字节)
- `number_of_blocks`: 存储块的数量
- `number_of_segments`: 段的数量

**列统计信息：**
- `min`: 列中的最小值
- `max`: 列中的最大值
- `null_count`: 空值的数量
- `number_of_distinct_values`: 唯一值的数量

## 优化管道

Databend 的查询优化器遵循精心设计的管道，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    Optimizer Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    Transforms correlated subqueries into joins          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    Gathers and propagates table and column statistics   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 3. CollectStatisticsOptimizer                           │    │
│  │    Estimates cardinality and selectivity                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 4. RuleNormalizeAggregateOptimizer                      │    │
│  │    Simplifies complex aggregation operations            │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    Combines and moves filters up when beneficial        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 6. RecursiveRuleOptimizer (DEFAULT_REWRITE_RULES)       │    │
│  │    Applies standard transformation rules                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 7. RecursiveRuleOptimizer ([RuleID::SplitAggregate])    │    │
│  │    Splits aggregation for parallel execution            │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    Finds optimal join order using dynamic programming   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    Converts semi-joins to inner joins when possible     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     Removes redundant join conditions                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
│  │     Explores alternative join orders                    │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     Selects best physical implementation                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     Eliminates redundant calculations                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Optimized Physical Plan                     │
│                Ready for efficient execution                    │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管道实战

Databend 的查询优化器经过四个不同的阶段，将 SQL 查询转换为高效的执行计划。让我们检查每个阶段及其组件优化器：

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
# 关联子查询转换为 JOIN 操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为 FILTER
Filter (c.total_orders > r.avg_total)
```

**作用：** 将关联子查询转换为 JOIN，大大加快执行速度。

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
# MIN 聚合被替换为统计信息中预计算的值
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，用表统计信息中的常量值替换某些聚合函数 (MIN, MAX)，避免全表扫描。

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

**作用：** 从存储层收集表和列的实际统计信息，并将其附加到扫描节点。在需要时，通过添加随机过滤器来处理行级采样。

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
1. 将 COUNT(非空) 重写为 COUNT(*)
2. 对多个 COUNT 表达式重用一个 COUNT(*)
3. 当计数列已在 GROUP BY 中时，消除 DISTINCT

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
# 过滤器上拉到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤器条件从下层节点上拉到计划树的顶部，从而实现更全面的过滤器优化。对于 INNER JOIN，它还会将 JOIN 条件拉入过滤器，将其转换为带过滤器的 CROSS JOIN。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 将一组转换规则递归地应用于查询计划。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器会持续应用规则，直到无法进行更多转换。

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

**之后 (PushDownFilterScan 规则)：**
```
# 过滤器下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器推送到存储层，允许 Databend 跳过读取不相关的数据块。

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

**之后 (EliminateFilter 规则)：**
```
# 冗余过滤器已移除
Scan (orders)
```

**作用：** 消除不必要的运算符，如冗余过滤器、排序或投影。

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

**作用：** 将单个聚合操作拆分为两个阶段 (Partial 和 Final)，从而实现分布式执行。部分聚合可以在每个节点上本地执行，最终聚合则组合部分结果。这是并行聚合处理的先决条件。

### JOIN 策略优化 (步骤 8-11)

**8. JOIN 顺序优化 (DPhpyOptimizer)**

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
# 基于成本估算的优化 JOIN 顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移到外部
```

**作用：** 使用动态规划根据表统计信息和 JOIN 条件找到最优的 JOIN 顺序。优化器：

1. 构建表示表之间 JOIN 关系的查询图
2. 使用动态规划算法 (DPhyp - Dynamic Programming Hyper-graph) 枚举所有可能的 JOIN 顺序
3. 对于包含多表的复杂查询，自适应切换到贪心算法
4. 根据表基数和选择性估算每个 JOIN 顺序的成本
5. 选择估算成本最低的 JOIN 顺序

此优化器对于涉及多个 JOIN 的查询尤为重要，因为 JOIN 顺序可以显著影响查询性能。

**9. 单 JOIN 到 INNER JOIN 转换 (SingleToInnerOptimizer)**

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
# 单 JOIN 转换为 INNER JOIN
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定可以安全地将“单”JOIN 类型 (LeftSingle, RightSingle) 转换为更高效的 INNER JOIN 时，会执行此操作。当优化器已用 `single_to_inner` 标志标记 JOIN 时，表示可以在不改变查询语义的情况下安全地转换 JOIN。

**10. JOIN 条件去重 (DeduplicateJoinConditionOptimizer)**

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
# 移除传递性 JOIN 条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用 Union-Find 算法识别并移除冗余的 JOIN 条件，特别是那些由其他条件传递暗示的条件。此优化器：

1. 最初将每列分配到其自己的等价组
2. 处理每个 JOIN 条件，合并相等列的等价组
3. 跳过两个列已在同一等价组中的条件
4. 保留维持相同查询语义所需的最小 JOIN 条件集

此优化减少了查询执行期间需要评估的 JOIN 条件数量，从而简化了 JOIN 操作并可能提高性能。

**11. JOIN 交换 (CommuteJoin Rule)**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前 (orders 大于 customers)：**
```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大表 (10M 行)
└─ Scan (customers as c)  # 较小表 (100K 行)
```

**之后 (应用 CommuteJoin 规则)：**
```
# JOIN 顺序交换，将较小表放在左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小表移到左侧
└─ Scan (orders as o)  # 较大表移到右侧
```

**作用：** 应用 JOIN 的交换性属性来优化物理执行。此规则：

1. 比较左右输入的基数 (估算行数)
2. 对于 INNER JOIN 和某些 OUTER JOIN，如果左侧行数少于右侧，则交换输入
3. 相应调整 JOIN 条件和 JOIN 类型 (例如，LEFT 变为 RIGHT)

由于 Databend 通常在哈希 JOIN 中使用右侧作为构建侧，此优化确保使用较小表来构建哈希表，从而通过减少内存使用和哈希表构建时间来提高 JOIN 性能。

### 基于成本的物理计划选择 (步骤 12)

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
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的替代方案                                │
│                                                           │
│     操作 A                操作 B                          │
│     成本: 1000      vs.       成本: 100  ✓                │
│                                                           │
│  2. 选择成本最低的选项                                    │
│                                                           │
│  3. 从选定的选项构建最终计划                              │
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

**成本因子默认值：**

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

**注意：** 这些值表示不同操作的相对成本。例如，网络操作 (50) 比简单计算 (1) 昂贵得多，哈希表 (10) 比聚合 (5) 昂贵。

这些成本因子与基数 (行数) 估算相结合，以计算每个操作的总成本。优化器随后选择总成本最低的实现方式。

成本是递归计算的——一个计划的总成本包括其所有操作及其子操作的成本。

## 总结

Databend 的查询优化器采用复杂的多阶段管道，将用户 SQL 查询转换为高效的物理执行计划。它利用 SExpr 进行计划表示、丰富的转换规则集、详细的统计信息和成本模型等核心概念，来探索和评估各种计划备选方案。

该过程包括：
1.  **准备：** 解除子查询关联并收集必要的统计信息。
2.  **逻辑优化：** 应用基于规则的转换 (例如过滤器下推、聚合规范化) 来优化逻辑计划结构。
3.  **连接优化：** 使用动态规划等技术策略性地确定最佳连接顺序和方法。
4.  **物理规划：** 使用 Cascades 框架选择最具成本效益的物理操作符 (例如，哈希连接与嵌套循环连接)。

通过系统地应用这些步骤，优化器旨在最大限度地减少资源使用 (CPU、内存、I/O) 并最大限度地提高查询执行速度。