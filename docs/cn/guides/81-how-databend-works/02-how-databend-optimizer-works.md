---
title: Databend 查询优化器（Query Optimizer）工作原理
---

## 核心概念

Databend 的查询优化器基于几个关键抽象构建，这些抽象协同工作，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符的树形表示                            │
│ Pipeline        │ 优化阶段的序列                                 │
│ Rules           │ 模式匹配转换                                   │
│ Cost Model      │ 执行估算的数学模型                              │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息指导优化决策：

**表统计信息：**

- `num_rows`：表中的行数
- `data_size`：表数据的字节大小
- `number_of_blocks`：存储块数量
- `number_of_segments`：段数量

**列统计信息：**

- `min`：列中的最小值
- `max`：列中的最大值
- `null_count`：空值数量
- `number_of_distinct_values`：唯一值数量

## 优化管道

Databend 的查询优化器遵循精心设计的管道，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器管道                                    │
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
│  │    收集并传播表和列统计信息                               │    │
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
│  │    在有益时合并并上移过滤器                               │    │
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
│  │    拆分聚合以实现并行执行                                 │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划找到最优连接顺序                           │    │
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
│  │     移除冗余的连接条件                                   │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 11. CommuteJoin Rule (if join reordering enabled)       │    │
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
│  │ 13. EliminateEvalScalar Rule (conditional)              │    │
│  │     消除冗余计算                                         │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化的物理计划                               │
│                准备进行高效执行                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管道实际运行

Databend 的查询优化器通过四个阶段将 SQL 查询转换为高效的执行计划。各阶段及其优化器如下：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询去相关化（SubqueryDecorrelatorOptimizer）**

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

**功能：** 将相关子查询转换为连接操作，显著提升执行速度。

**2. 基于统计信息的聚合优化（RuleStatsAggregateOptimizer）**

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
# MIN 聚合替换为统计信息中的预计算值
EvalScalar (price_min)
└─ DummyTableScan
```

**功能：** 在可能时，用表统计信息的常量值替换聚合函数（如 MIN、MAX），避免全表扫描。

**3. 统计信息收集（CollectStatisticsOptimizer）**

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

**功能：** 从存储层收集实际统计信息，附加到扫描节点；必要时通过随机过滤器处理行级采样。

### 基于逻辑规则的优化（步骤 4-7）

**4. 聚合规范化（RuleNormalizeAggregateOptimizer）**

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

**功能：** 通过以下方式优化聚合函数：
1. 将 COUNT(非空列) 重写为 COUNT(\*)
2. 为多个计数表达式复用单个 COUNT(\*)
3. 当计数列已在 GROUP BY 中时消除 DISTINCT

**5. 过滤器上拉（PullUpFilterOptimizer）**

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
# 过滤器上拉至顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**功能：** 将过滤条件从底层节点上拉至计划树顶部，支持更全面的优化；对于内连接，将连接条件并入过滤器并转换为交叉连接。

**6. 默认重写规则（RecursiveRuleOptimizer）**

**功能：** 递归应用转换规则至查询计划，匹配特定模式并优化为高效形式，直至无法继续转换。

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

**之后（PushDownFilterScan 规则）：**

```
# 过滤器下推至扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**功能：** 将过滤器推送至存储层，跳过无关数据块读取。

#### 限制下推规则

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

**之后（PushDownLimitSort 规则）：**

```
# 限制下推通过排序
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**功能：** 将 LIMIT 子句下推至计划中，减少昂贵操作的数据处理量。

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

**之后（EliminateFilter 规则）：**

```
# 冗余过滤器已移除
Scan (orders)
```

**功能：** 消除冗余运算符（如过滤器、排序或投影）。

**7. 聚合拆分（RecursiveRuleOptimizer - SplitAggregate）**

**SQL 示例：**

```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**之前：**

```
# 单阶段聚合（模式：Initial）
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

**功能：** 将聚合拆分为 Partial 和 Final 两阶段，支持分布式执行：Partial 阶段在节点本地执行，Final 阶段合并结果，为并行聚合处理奠定基础。

### 连接策略优化（步骤 8-11）

**8. 连接顺序优化（DPhpyOptimizer）**

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
# 基于成本估算的优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移至外侧
```

**功能：** 基于表统计信息和连接条件，使用动态规划确定最优连接顺序：
1. 构建表间连接关系的查询图
2. 用动态规划算法（DPhyp）枚举所有可能顺序
3. 对多表复杂查询自适应切换至贪心算法
4. 根据表基数和选择性估算各顺序成本
5. 选择成本最低的顺序

此优化对多连接查询至关重要，可显著提升性能。

**9. Single 连接转内连接（SingleToInnerOptimizer）**

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
# Single 连接转换为内连接
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**功能：** 当优化器通过 `single_to_inner` 标志确认安全时，将 Single 连接类型（如 LeftSingle）转换为更高效的内连接，且不改变语义。

**10. 连接条件去重（DeduplicateJoinConditionOptimizer）**

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
# 移除传递性冗余条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**功能：** 用并查集算法识别并移除冗余连接条件（特别是传递隐含条件）：
1. 初始为每列分配独立等价组
2. 处理连接条件时合并等价组
3. 跳过已同组的条件
4. 保留维持语义的最小条件集

此优化减少连接条件评估量，简化操作并提升性能。

**11. 连接交换（CommuteJoin 规则）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前（orders 比 customers 大）：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表（1000 万行）
└─ Scan (customers as c)  # 较小的表（10 万行）
```

**之后（应用 CommuteJoin 规则）：**

```
# 交换连接顺序，小表置左
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 小表移至左侧
└─ Scan (orders as o)  # 大表移至右侧
```

**功能：** 利用连接交换性优化物理执行：
1. 比较左右输入的基数
2. 内连接及特定外连接中，若左侧行数较少则交换输入
3. 相应调整连接类型（如 LEFT 转为 RIGHT）

Databend 通常以右侧作为哈希连接的构建端，此优化确保小表构建哈希表，减少内存占用和构建时间。

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择（CascadesOptimizer）**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**功能：** 比较不同实现选项的成本，选择最高效执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的替代方案                                  │
│                                                           │
│     操作 A                操作 B                          │
│     成本：1000      vs.       成本：100  ✓                │
│                                                           │
│  2. 选择最低成本选项                                       │
│                                                           │
│  3. 从选定选项构建最终计划                                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**示例查询的选项：**

```
┌─────────────────────────────────────────────────────────┐
│ 操作              │ 替代方案            │ 成本          │
├───────────────────┼─────────────────────┼───────────────┤
│ SCAN customers    │ FullTableScan       │ 1000          │
│ WHERE region='Asia'│ FilterScan  ✓       │  100          │
├───────────────────┼─────────────────────┼───────────────┤
│ JOIN              │ NestedLoopJoin      │ 2000          │
│                   │ HashJoin  ✓         │  500          │
├───────────────────┼─────────────────────┼───────────────┤
│ AGGREGATE         │ SortAggregate       │  800          │
│ GROUP BY customer_name│ HashAggregate  ✓    │  300          │
└───────────────────┴─────────────────────┴───────────────┘
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

**注意：** 这些值反映操作的相对成本（如网络操作成本 50 远高于计算成本 1）。成本因子与基数估算结合计算总成本，优化器选择总成本最低的实现。成本递归计算，包含所有子操作。

## 总结

Databend 的查询优化器通过多阶段管道将 SQL 查询转换为高效物理执行计划，核心包括 SExpr 计划表示、转换规则集、详细统计信息和成本模型。过程涵盖：
1.  **准备：** 子查询去相关化及统计信息收集。
2.  **逻辑优化：** 应用规则转换（如过滤器下推、聚合规范化）优化逻辑结构。
3.  **连接优化：** 使用动态规划等技术确定最佳连接顺序。
4.  **物理规划：** 基于成本模型选择最优物理运算符（如哈希连接 vs. 嵌套循环连接）。

系统化执行这些步骤，旨在最小化资源消耗（CPU、内存、I/O）并最大化查询速度。