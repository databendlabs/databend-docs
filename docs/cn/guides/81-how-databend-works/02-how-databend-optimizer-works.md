---
title: Databend 查询优化器（Query Optimizer）工作原理
---

## 核心概念

Databend 的查询优化器（Query Optimizer）建立在几个关键抽象之上，这些抽象协同工作，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                    │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符的树形表示                              │
│ Pipeline        │ 优化阶段的序列                                   │
│ Rules           │ 模式匹配转换                                     │
│ Cost Model      │ 执行估算的数学模型                               │
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

## 优化流水线（Pipeline）

Databend 的查询优化器（Query Optimizer）遵循精心设计的流水线（Pipeline），将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器流水线（Pipeline）                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关子查询转换为连接                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 2. RuleStatsAggregateOptimizer                          │    │
│  │    收集并传播表和列统计信息                                │    │
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
│  │    在有益时合并过滤器并将其上移                            │    │
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
│  │    拆分聚合以实现并行执行                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 8. DPhpyOptimizer                                       │    │
│  │    使用动态规划找到最优连接顺序                             │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 9. SingleToInnerOptimizer                               │    │
│  │    在可能时将半连接转换为内连接                             │    │
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
│  │ 11. CommuteJoin Rule (如果启用连接重排序)                 │    │
│  │     探索替代连接顺序                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 12. CascadesOptimizer                                   │    │
│  │     选择最佳物理实现                                      │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 13. EliminateEvalScalar Rule (条件性)                    │    │
│  │     消除冗余计算                                          │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化的物理计划                               │
│                     准备高效执行                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 优化流水线（Pipeline）实战

Databend 的查询优化器（Query Optimizer）通过四个不同的阶段将 SQL 查询转换为高效的执行计划。让我们检查每个阶段及其组件优化器：

### 查询准备和统计信息（步骤 1-3）

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

# 子查询条件变成过滤器
Filter (c.total_orders > r.avg_total)
```

**作用：** 将相关子查询转换为连接，使其执行速度更快。

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
# MIN 聚合被统计信息中的预计算值替换
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 在可能的情况下，用表统计信息中的常量值替换某些聚合函数（MIN、MAX），避免全表扫描。

**3. 统计信息收集（CollectStatisticsOptimizer）**

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
   统计信息：  # 从存储层收集
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集表和列的实际统计信息，将其附加到扫描节点。还通过在需要时添加随机过滤器来处理行级采样。

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

1. 将 COUNT(非空列) 重写为 COUNT(\*)
2. 为多个计数表达式重用单个 COUNT(\*)
3. 当计数的列已经在 GROUP BY 中时消除 DISTINCT

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
# 过滤器上拉到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤条件从较低节点上拉到计划树顶部，实现更全面的过滤器优化。对于内连接，还将连接条件拉入过滤器，将其转换为带过滤器的交叉连接。

**6. 默认重写规则（RecursiveRuleOptimizer）**

**作用：** 递归地对查询计划应用转换规则集。每个规则匹配计划中的特定模式，并将其转换为更高效的形式。优化器持续应用规则直至无法进行更多转换。

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
# 过滤器下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器推送到存储层，使 Databend 能跳过读取不相关数据块。

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
# 限制通过排序下推
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**作用：** 将 LIMIT 子句下推到计划中，减少昂贵操作处理的数据量。

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
# 冗余过滤器被移除
Scan (orders)
```

**作用：** 消除冗余的过滤器、排序或投影等不必要的运算符。

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

**作用：** 将单个聚合操作拆分为两个阶段（Partial 和 Final），实现分布式执行。部分聚合可在各节点本地执行，最终聚合合并部分结果。这是并行聚合处理的先决条件。

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
└─ orders  # 大表移到外侧
```

**作用：** 使用动态规划基于表统计信息和连接条件找到最优连接顺序。优化器：

1. 构建表示表间连接关系的查询图
2. 使用动态规划算法（DPhyp - 动态规划超图）枚举所有可能连接顺序
3. 对涉及多表的复杂查询自适应切换至贪心算法
4. 基于表基数和选择性估算每个连接顺序的成本
5. 选择估算成本最低的连接顺序

此优化器对涉及多个连接的查询尤为重要，连接顺序会显著影响查询性能。

**9. 单连接到内连接转换（SingleToInnerOptimizer）**

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

**作用：** 当优化器确定转换安全时，将"单"连接类型（LeftSingle、RightSingle）转换为更高效的内连接。这发生在优化器用 `single_to_inner` 标志标记连接时，表明转换不会改变查询语义。

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
# 移除传递性连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集算法识别并移除冗余连接条件，特别是被其他条件传递性隐含的条件。此优化器：

1. 初始将每列分配至独立等价组
2. 处理每个连接条件，合并相等列的等价组
3. 跳过两列已在同一等价组的条件
4. 保留维持相同查询语义所需的最小连接条件集

此优化减少查询执行期间需评估的连接条件数量，简化连接操作并提升性能。

**11. 连接交换（CommuteJoin Rule）**

**SQL 示例：**

```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**之前（orders 比 customers 大）：**

```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 较大的表（1000万行）
└─ Scan (customers as c)  # 较小的表（10万行）
```

**之后（应用 CommuteJoin 规则）：**

```
# 连接顺序交换，将较小表置于左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 较小表移至左侧
└─ Scan (orders as o)  # 较大表移至右侧
```

**作用：** 应用连接交换律优化物理执行。此规则：

1. 比较左右输入的基数（估算行数）
2. 对内连接和特定外连接，当左侧行数少于右侧时交换输入
3. 相应调整连接条件和类型（如 LEFT 变为 RIGHT）

因 Databend 通常在哈希连接中使用右侧作为构建侧，此优化确保较小表用于构建哈希表，通过减少内存使用和哈希表构建时间提升连接性能。

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择（CascadesOptimizer）**

**SQL 示例：**

```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现选项的成本，选择最高效的查询执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的替代方案                                  │
│                                                           │
│     操作 A                 操作 B                          │
│     成本：1000      vs.    成本：100  ✓                    │
│                                                           │
│  2. 选择最低成本选项                                       │
│                                                           │
│  3. 从选定选项构建最终计划                                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**示例查询的替代方案：**

```
┌─────────────────────────────────────────────────────────┐
│ 操作                  │ 替代方案            │ 成本      │
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

**注意：** 这些值反映不同操作的相对成本。例如网络操作（50）远高于简单计算（1），哈希表（10）高于聚合（5）。

成本因子与基数（行数）估算结合计算各操作总成本。优化器选择总成本最低的实现。

成本递归计算——计划总成本包含其所有操作及子操作成本。

## 总结

Databend 的查询优化器（Query Optimizer）采用精密的多阶段流水线（Pipeline），将用户 SQL 查询转换为高效物理执行计划。它利用 SExpr（计划表示）、丰富的转换规则集、详细统计信息和成本模型等核心概念探索评估多种计划方案。

该过程包含：

1.  **准备阶段：** 子查询去相关化及必要统计信息收集
2.  **逻辑优化：** 应用基于规则的转换（如过滤器下推、聚合规范化）优化逻辑计划结构
3.  **连接优化：** 使用动态规划等技术确定最佳连接顺序和方法
4.  **物理规划：** 通过 Cascades 框架选择最具成本效益的物理运算符（如哈希连接 vs 嵌套循环连接）

通过系统执行这些步骤，优化器旨在最小化资源消耗（CPU、内存、I/O）并最大化查询执行速度。