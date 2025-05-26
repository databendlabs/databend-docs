# Databend 优化器工作原理

## 核心概念

Databend 的查询优化器基于几个关键抽象构建，这些抽象共同协作将 SQL 查询转换为高效的执行计划：

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

Databend 收集并使用以下统计信息来指导优化决策：

**表统计信息：**
- `num_rows`: 表中的行数
- `data_size`: 表数据大小（字节）
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

## 优化流水线实战

Databend 的查询优化器通过四个不同的阶段将 SQL 查询转换为高效的执行计划。让我们分析每个阶段及其包含的优化器：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询解关联（SubqueryDecorrelatorOptimizer）**

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
# 将关联子查询转换为连接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为过滤条件
Filter (c.total_orders > r.avg_total)
```

**作用：** 将关联子查询转换为连接操作，大幅提升执行效率。

**2. 基于统计的聚合优化 (RuleStatsAggregateOptimizer)**

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
# 使用统计信息中的预计算值替换 MIN 聚合
EvalScalar (price_min)
└─ DummyTableScan
```

**作用：** 当可能时，用表统计信息中的常量值替换某些聚合函数 (MIN, MAX)，避免全表扫描。

**3. 统计信息收集 (CollectStatisticsOptimizer)**

**SQL 示例：**
```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**优化前：**
```
Filter (region = 'Asia')
└─ Scan (orders)
   [无统计信息]
```

**优化后：**
```
Filter (region = 'Asia')
└─ Scan (orders)
   Statistics:  # 从存储层收集
   - table_stats: {num_rows, data_size, ...}
   - column_stats: {min, max, null_count, ndv}
   - histograms: {...}
```

**作用：** 从存储层收集表和列的实际统计信息，附加到扫描节点。在需要时通过添加随机过滤器处理行级采样。

### 基于逻辑规则的优化 (步骤 4-7)

**4. 聚合规范化 (RuleNormalizeAggregateOptimizer)**

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
1. 将 COUNT(非空列) 重写为 COUNT(*)
2. 为多个计数表达式复用单个 COUNT(*)
3. 当计数列已在 GROUP BY 中时消除 DISTINCT

**5. 过滤条件上提 (PullUpFilterOptimizer)**

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
# 过滤条件上提到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**作用：** 将过滤条件从下层节点上提到计划树顶部，实现更全面的过滤优化。对于内连接，还将连接条件上提到过滤器中，将其转换为带过滤条件的交叉连接。

**6. 默认重写规则 (RecursiveRuleOptimizer)**

**作用：** 递归地对查询计划应用一组转换规则。每条规则匹配计划中的特定模式并将其转换为更高效的形式。优化器持续应用规则直到无法再进行转换。

**关键规则包括：**

#### 过滤条件下推规则

**SQL 示例：**
```sql
SELECT * FROM orders WHERE region = 'Asia'
```

**优化前：**
```
Filter (region = 'Asia')
└─ Scan (orders)
```

**优化后 (PushDownFilterScan 规则)：**
```
# 过滤条件下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**作用：** 将过滤器下推到存储层，使 Databend 能够跳过读取不相关的数据块。

#### LIMIT 下推规则

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

**优化后 (PushDownLimitSort 规则)：**
```
# LIMIT 下推到排序操作下方
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

**优化前：**
```
Filter (1=1)
└─ Scan (orders)
```

**优化后 (EliminateFilter 规则)：**
```
# 移除冗余过滤器
Scan (orders)
```

**作用：** 消除不必要的操作符，如冗余过滤器、排序或投影。

**7. 聚合拆分 (RecursiveRuleOptimizer - SplitAggregate)**

**SQL 示例：**
```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**优化前：**
```
# 单阶段聚合 (模式: Initial)
Aggregate (
  mode=Initial,
  groups=[region],
  aggregates=[SUM(amount)]
)
└─ Scan (orders)
```

**优化后：**
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

**作用：** 将单个聚合操作拆分为两个阶段 (Partial 和 Final)，实现分布式执行。部分聚合可在每个节点本地执行，最终聚合合并部分结果。这是并行聚合处理的先决条件。

### 连接策略优化 (步骤 8-11)

. . 连接顺序优化 (DPhpyOptimizer)**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id JOIN products p ON o.product_id = p.id WHERE c.region = 'Asia'
```

**优化前 (原始顺序)：**
```
Join
├─ Join
│  ├─ orders
│  └─ customers (region='Asia')
└─ products
```

**优化后 (优化顺序)：**
```
# 基于成本估算优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移到外部
```

**作用：** 使用动态规划基于表统计信息和连接条件找到最优连接顺序。优化器：

1. 构建表示表间连接关系的查询图
2. 使用动态规划算法 (DPhyp - 动态规划超图) 枚举所有可能的连接顺序
3. 对于包含多表的复杂查询自适应切换到贪心算法
4. 基于表基数和选择性估算每个连接顺序的成本
5. 选择估算成本最低的连接顺序

此优化器对于涉及多个连接的查询尤为重要，连接顺序会显著影响查询性能。

**9. 单连接转内连接 (SingleToInnerOptimizer)**

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
# 单连接转换为内连接
InnerJoin (o.customer_id = c.id)
├─ Scan (orders as o)
└─ Scan (customers as c)
```

**作用：** 当优化器确定安全时，将"单"连接类型 (LeftSingle, RightSingle) 转换为更高效的内连接。当优化器标记了 `single_to_inner` 标志时会发生此转换，表示连接可安全转换而不改变查询语义。

**10. 连接条件去重 (DeduplicateJoinConditionOptimizer)**

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
# 移除传递性连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**作用：** 使用并查集算法识别并移除冗余连接条件，特别是那些由其他条件传递隐含的条件。此优化器：

1. 初始时每个列分配自己的等价组
2. 处理每个连接条件，合并相等列的等价组
3. 当两列已在同一等价组时跳过条件
4. 保留维持相同查询语义所需的最小连接条件集

此优化减少了查询执行期间需要评估的连接条件数量，简化了连接操作并可能提升性能。

**11. 连接交换 (CommuteJoin 规则)**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**优化前 (orders 大于 customers)：**
```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 大表 (1000 万行)
└─ Scan (customers as c)  # 小表 (10 万行)
```

**优化后 (应用 CommuteJoin 规则)：**
```
# 交换连接顺序使小表在左侧
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 小表移到左侧
└─ Scan (orders as o)  # 大表移到右侧
```

**作用：** 应用连接的可交换性优化物理执行。此规则：

1. 比较左右输入的基数 (估算行数)
2. 对于内连接和某些外连接，当左侧行数少于右侧时交换输入
3. 相应调整连接条件和连接类型 (如 LEFT 变为 RIGHT)

由于 Databend 通常在哈希连接中使用右侧作为构建侧，此优化确保小表用于构建哈希表，通过减少内存使用和哈希表构建时间提升连接性能。

### 基于成本的物理计划选择 (步骤 12)

**12. 基于成本的实现选择 (CascadesOptimizer)**

**SQL 示例：**
```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**作用：** 通过比较不同实现选项的成本，选择最高效的执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 比较每个操作的替代方案                                │
│                                                           │
│     操作 A                 操作 B                         │
│     成本: 1000    vs.     成本:     成本: 100  ✓                   │
│                                                           │
│  2. 选择成本最低的方案                                    │
│                                                           │
│  3. 从选定方案构建最终计划                                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**对于示例查询：**

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

**成本计算原理:**

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

**成本因子默认值定义:**

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
└─────────────────────┴───────────────────────────────────────┘
```

**注意:** 这些数值展示了不同操作的相对成本。例如网络传输 (50) 比简单计算 (1) 昂贵得多，而哈希表操作 (10) 比聚合运算 (5) 成本更高。

这些成本因子会与基数 (行数) 估算值结合来计算每个操作的总成本。优化器随后会选择总成本最低的实现方案。

成本计算采用递归方式 - 一个执行计划的总成本包含其所有操作及其子操作的成本。

## 总结

Databend 的查询优化器采用复杂的多阶段流水线，将用户 SQL 查询转换为高效的物理执行计划。它运用了以下核心概念：
- SExpr 作为计划表示形式
- 丰富的转换规则集
- 详细的统计信息
- 成本评估模型来探索和评估各种计划方案

优化流程包含四个关键阶段：
1. **预处理阶段:** 解关联子查询并收集必要的统计信息
2. **逻辑优化:** 应用基于规则的转换 (如谓词下推、聚合规范化) 来优化逻辑计划结构
3. **连接优化:** 使用动态规划等技术策略性地确定最佳连接顺序和方法
4. **物理计划生成:** 基于 Cascades 框架选择最具成本效益的物理算子 (如 Hash Join 与 Nested Loop Join 的抉择)

通过系统性地应用这些优化步骤，查询优化器旨在最小化资源消耗 (CPU、内存、I/O) 并最大化查询执行速度。