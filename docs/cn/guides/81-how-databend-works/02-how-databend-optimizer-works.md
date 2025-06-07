---
title: Databend 查询优化器（Query Optimizer）工作原理
---

## 核心概念

Databend 的查询优化器建立在多个关键抽象之上，这些抽象协同工作，将 SQL 查询转换为高效执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符的树形表示                            │
│ Pipeline        │ 优化阶段的序列                                 │
│ Rules           │ 模式匹配转换                                   │
│ Cost Model      │ 执行估算的数学模型                             │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并利用以下统计信息指导优化决策：

**表统计信息：**

- `num_rows`：表的总行数
- `data_size`：表数据的字节大小
- `number_of_blocks`：存储块数量
- `number_of_segments`：段数量

**列统计信息：**

- `min`：列的最小值
- `max`：列的最大值
- `null_count`：空值数量
- `number_of_distinct_values`：唯一值数量

## 优化管道

Databend 查询优化器遵循精心设计的管道，将 SQL 查询转换为高效执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器管道                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关子查询转换为连接                                │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集并传播表和列统计信息                              │    │
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
│  │    简化复杂聚合操作                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 5. PullUpFilterOptimizer                                │    │
│  │    在有益时合并并上移过滤器                              │    │
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
│  │    使用动态规划寻找最优连接顺序                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将半连接转换为内连接                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     移除冗余连接条件                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (如果启用连接重排序)                │    │
│  │     探索替代连接顺序                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳物理实现                                     │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (条件性)                    │    │
│  │     消除冗余计算                                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化的物理计划                              │
│                     准备高效执行                               │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管道实战

Databend 查询优化器通过四个阶段将 SQL 查询转换为高效执行计划。各阶段及其优化器如下：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询去相关（SubqueryDecorrelatorOptimizer）**

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

```
# Correlated subquery transformed into join operation
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# Subquery condition becomes a filter
Filter (c.total_orders > r.avg_total)
```

**作用：** 将相关子查询转换为连接操作，显著提升执行速度。

**2. 基于统计的聚合优化（RuleStatsAggregateOptimizer）**

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

```
# MIN aggregate replaced with pre-computed value from statistics
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能时，用表统计信息中的常量值替换聚合函数（如 MIN、MAX），避免全表扫描。

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
   Statistics:  # Collected from storage
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集实际统计信息并附加到扫描节点，必要时通过添加随机过滤器处理行级采样。

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

```
# Optimized aggregates
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
2. 为多个计数表达式复用单个 COUNT(\*)
3. 当计数列已包含在 GROUP BY 中时消除 DISTINCT

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

```
# Filters pulled up to the top
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤条件上拉至计划树顶部，实现更全面的优化。对于内连接，将连接条件并入过滤器并转换为带过滤器的交叉连接。

**6. 默认重写规则（RecursiveRuleOptimizer）**

**作用：** 递归应用转换规则至查询计划，持续优化直至无法进一步转换。

**关键规则：**

#### 过滤器下推规则

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

```
# Filter pushed down to scan layer
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器下推至存储层，跳过无关数据块读取。

#### 限制下推规则

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

```
# Limit pushed through sort
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 LIMIT 子句下推以减少高成本操作的数据处理量。

#### 消除规则

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

```
# Redundant filter removed
Scan (orders)
```

**作用：** 消除冗余过滤器、排序或投影等非必要运算符。

**7. 聚合拆分（RecursiveRuleOptimizer - SplitAggregate）**

**SQL 示例：**

```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**优化前：**

```
# Single-phase aggregation (mode: Initial)
Aggregate (
  mode=Initial,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Scan (orders)
```

**优化后：**

```
# Two-phase aggregation
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

**作用：** 将聚合拆分为局部（Partial）和最终（Final）两阶段，支持分布式执行。局部聚合在各节点执行，最终聚合合并结果，为并行处理奠定基础。

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

```
# Optimized join order based on cost estimation
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # Large table moved outside
```

**作用：** 基于表统计和连接条件，通过动态规划确定最优连接顺序：
1. 构建表间连接关系查询图
2. 使用 DPhyp 算法枚举所有可能连接顺序
3. 对多表复杂查询自适应切换至贪心算法
4. 根据基数和选择性估算各顺序成本
5. 选择成本最低的连接顺序

**9. 单连接转内连接（SingleToInnerOptimizer）**

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

```
# Single join converted to inner join
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器通过 `single_to_inner` 标志确认语义安全时，将单连接（如 LeftSingle）转换为更高效的内连接。

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

```
# Removed transitive join condition
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集算法识别并移除传递性冗余连接条件：
1. 初始为每列分配独立等价组
2. 处理连接条件时合并等价列组
3. 跳过已同组的冗余条件
4. 保留维持语义的最简条件集

**11. 连接交换（CommuteJoin 规则）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**优化前（orders 较大）：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # Larger table (10M rows)
└─ Scan (customers as c)  # Smaller table (100K rows)
```

**优化后（应用 CommuteJoin 规则）：**

```
# Join order swapped to put smaller table on left
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # Smaller table moved to left
└─ Scan (orders as o)  # Larger table moved to right
```

**作用：** 利用连接交换性优化物理执行：
1. 比较左右输入的估算行数
2. 对符合条件的内/外连接，交换较小表至左侧
3. 相应调整连接类型（如 LEFT 转 RIGHT）

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择（CascadesOptimizer）**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过成本比较选择最高效的查询执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较各操作的替代方案                                    │
│                                                           │
│     操作 A                 操作 B                          │
│     成本：1000      vs.    成本：100  ✓                    │
│                                                           │
│  2. 选择最低成本选项                                       │
│                                                           │
│  3. 基于选定方案构建最终计划                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**示例查询方案对比：**

```
┌─────────────────────────────────────────────────────────┐
│ 操作                  │ 替代方案            │ 成本      │
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

**成本计算逻辑：**

```
┌───────────────────────────────────────────────────────────┐
│ 操作              │ 实际代码实现                            │
├───────────────────┼───────────────────────────────────────┤
│ 扫描              │ group.stat_info.cardinality *         │
│                   │ compute_per_row                       │
├───────────────────┼───────────────────────────────────────┤
│ 连接              │ build_card * hash_table_per_row +     │
│                   │ probe_card * compute_per_row          │
├───────────────────┼───────────────────────────────────────┤
│ 聚合              │ card * aggregate_per_row              │
├───────────────────┼───────────────────────────────────────┤
│ 交换 (Hash)       │ cardinality * network_per_row +       │
│                   │ cardinality * compute_per_row         │
└───────────────────┴───────────────────────────────────────┘
```

**成本因子默认值：**

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

**注意：** 数值反映操作相对成本（如网络操作成本 50 >> 计算成本 1）。成本因子与基数估算结合计算总成本，优化器递归累加子操作成本后选择总成本最低方案。

## 总结

Databend 查询优化器通过多阶段管道将 SQL 查询转换为高效物理执行计划，核心机制包括：
- **SExpr** 计划表示
- 丰富的转换规则集
- 详细统计信息
- 成本模型

优化流程分四阶段：
1.  **准备阶段**：子查询去相关与统计信息收集
2.  **逻辑优化**：应用规则转换（如过滤器下推、聚合规范化）
3.  **连接优化**：动态规划确定最佳连接顺序
4.  **物理规划**：基于成本选择最优运算符（如哈希连接 vs 嵌套循环连接）

通过系统化执行，优化器最小化资源消耗（CPU、内存、I/O）并最大化查询速度。