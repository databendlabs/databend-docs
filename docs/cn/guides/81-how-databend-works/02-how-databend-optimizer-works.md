# Databend 查询优化器工作原理

## 核心概念

Databend 的查询优化器建立在几个关键抽象之上，这些抽象协同工作将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│ 核心优化器组件                                                  │
├─────────────────┬───────────────────────────────────────────────┤
│ SExpr           │ 关系运算符的树形表示                           │
│ Pipeline        │ 优化阶段的序列                                │
│ Rules           │ 模式匹配转换                                  │
│ Cost Model      │ 执行估算的数学模型                            │
└─────────────────┴───────────────────────────────────────────────┘
```

Databend 收集并使用这些统计信息指导优化决策：

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

Databend 的查询优化器遵循精心设计的管道，将 SQL 查询转换为高效的执行计划：

```
┌─────────────────────────────────────────────────────────────────┐
│                    优化器管道                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 1. SubqueryDecorrelatorOptimizer                        │    │
│  │    将相关子查询转换为连接操作                            │    │
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
│  │    估算基数和选择性                                       │    │
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
│  │    合并并上移过滤器                                      │    │
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
│  │    拆分聚合实现并行执行                                  │    │
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
│  │    将半连接转换为内连接                                  │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 10. DeduplicateJoinConditionOptimizer                   │    │
│  │     删除冗余连接条件                                     │    │
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
│  │     消除冗余计算                                        │    │
│  └───────────────────────────┬─────────────────────────────┘    │
│                                                                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     优化的物理计划                              │
│                准备高效执行                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 优化管道实战

Databend 的查询优化器经过四个阶段将 SQL 查询转换为高效执行计划：

### 查询准备与统计信息（步骤 1-3）

**1. 子查询去相关化（SubqueryDecorrelatorOptimizer）**

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
# 相关子查询转换为连接操作
Join (c.region = r.region)
├─ Scan (customers as c)
└─ Aggregate (region, AVG(total_orders) as avg_total)
   └─ Scan (customers)

# 子查询条件变为过滤器
Filter (c.total_orders > r.avg_total)
```

**功能：** 将相关子查询转换为连接操作，提升执行速度。

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
```
# MIN 聚合替换为统计信息中的预计算值
EvalScalar (price_min)
└─ DummyTableScan
```

**功能：** 使用表统计信息中的常量值替换 MIN/MAX 等聚合函数，避免全表扫描。

**3. 统计信息收集（CollectStatisticsOptimizer）**

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

**功能：** 从存储层收集实际统计信息并附加到扫描节点，必要时添加随机过滤器实现行级采样。

### 基于逻辑规则的优化（步骤 4-7）

**4. 聚合标准化（RuleNormalizeAggregateOptimizer）**

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

**功能：** 通过以下方式优化聚合函数：
1. 将 COUNT(非空列) 重写为 COUNT(*)
2. 复用单个 COUNT(*) 处理多个计数表达式
3. 当计数列已在 GROUP BY 中时消除 DISTINCT

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
# 过滤器上拉到顶部
Filter (o.region = 'Asia' AND c.status = 'active' AND o.customer_id = c.id)
└─ Join (Cross)
   ├─ Scan (orders as o)
   └─ Scan (customers as c)
```

**功能：** 将过滤器条件上拉到计划树顶部，支持更全面的优化。对于内连接，将连接条件转换为带过滤器的交叉连接。

**6. 默认重写规则（RecursiveRuleOptimizer）**

**功能：** 递归应用转换规则直到无法继续优化。

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
# 过滤器下推到扫描层
Scan (orders, pushdown_predicates=[region = 'Asia'])
```

**功能：** 将过滤器推送到存储层，跳过读取无关数据块。

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
# 限制穿过排序下推
Sort (order_date)
└─ Limit (10)
   └─ Scan (orders)
```

**功能：** 将 LIMIT 子句下推以减少昂贵操作处理的数据量。

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
# 删除冗余过滤器
Scan (orders)
```

**功能：** 消除冗余过滤器、排序或投影等操作符。

**7. 聚合拆分（RecursiveRuleOptimizer - SplitAggregate）**

**SQL 示例：**
```sql
SELECT region, SUM(amount) FROM orders GROUP BY region
```

**优化前：**
```
# 单阶段聚合（模式：Initial）
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

**功能：** 将聚合拆分为 Partial 和 Final 两阶段，支持分布式执行。Partial 阶段在节点本地执行，Final 阶段合并结果，实现并行聚合处理。

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
# 基于成本估算的优化连接顺序
Join
├─ Join
│  ├─ products
│  └─ customers (region='Asia')
└─ orders  # 大表移到外侧
```

**功能：** 使用动态规划寻找最优连接顺序：
1. 构建表示表间连接关系的查询图
2. 使用 DPhyp 算法枚举所有连接顺序
3. 对多表复杂查询自适应切换贪心算法
4. 基于表基数和选择性估算成本
5. 选择最低成本方案

**9. 单连接到内连接转换（SingleToInnerOptimizer）**

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

**功能：** 当 `single_to_inner` 标志指示安全时，将 LeftSingle/RightSingle 连接转换为更高效的内连接。

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
# 删除传递性连接条件
Join (t2.id = t3.id)
├─ Scan (t3)
└─ Join (t1.id = t2.id)
   ├─ Scan (t1)
   └─ Scan (t2)
```

**功能：** 使用 Union-Find 算法识别并删除冗余连接条件：
1. 初始为每列创建独立等价组
2. 处理连接条件时合并等价组
3. 跳过同组内条件
4. 保留维持查询语义的最小条件集

**11. 连接交换（CommuteJoin 规则）**

**SQL 示例：**
```sql
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id
```

**优化前（orders 大于 customers）：**
```
Join (o.customer_id = c.id)
├─ Scan (orders as o)  # 大表（1000万行）
└─ Scan (customers as c)  # 小表（10万行）
```

**优化后（应用 CommuteJoin 规则）：**
```
# 连接顺序交换
Join (c.id = o.customer_id)
├─ Scan (customers as c)  # 小表移到左侧
└─ Scan (orders as o)  # 大表移到右侧
```

**功能：** 应用连接交换律优化物理执行：
1. 比较左右输入的基数
2. 内连接中左侧行数较少时交换输入
3. 相应调整连接条件和类型

### 基于成本的物理计划选择（步骤 12）

**12. 基于成本的实现选择（CascadesOptimizer）**

**SQL 示例：**
```sql
SELECT customer_name, SUM(total_price) as total_spend
FROM customers JOIN orders ON customers.id = orders.customer_id
WHERE customers.region = 'Asia'
GROUP BY customer_name;
```

**功能：** 比较不同实现选项的成本，选择最优执行方式。

**Cascades 工作原理：**

```
┌───────────────────────────────────────────────────────────┐
│                   CASCADES 优化器                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  1. 为每个操作比较替代方案                                 │
│                                                           │
│     操作 A                  操作 B                        │
│     成本: 1000      vs.     成本: 100  ✓                 │
│                                                           │
│  2. 选择最低成本选项                                      │
│                                                           │
│  3. 构建最终计划                                         │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**示例查询实现对比：**

```
┌─────────────────────────────────────────────────────────┐
│ 操作                │ 替代方案           │ 成本          │
├─────────────────────┼───────────────────┼──────────────┤
│ SCAN customers      │ FullTableScan     │ 1000         │
│ WHERE region='Asia' │ FilterScan  ✓     │  100         │
├─────────────────────┼───────────────────┼──────────────┤
│ JOIN                │ NestedLoopJoin    │ 2000         │
│                     │ HashJoin  ✓       │  500         │
├─────────────────────┼───────────────────┼──────────────┤
│ AGGREGATE           │ SortAggregate     │  800         │
│ GROUP BY customer   │ HashAggregate  ✓  │  300         │
└─────────────────────┴───────────────────┴──────────────┘
```

**成本计算模型：**

```
┌───────────────────────────────────────────────────────────┐
│ 操作              │ 成本计算模型                           │
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
│ 成本因子            │ 默认值                               │
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

**注意：** 这些值表示不同操作的相对成本，网络操作（50）远高于简单计算（1），哈希表（10）高于聚合（5）。成本因子与基数估算结合计算总成本，递归包含所有子操作成本。

## 总结

Databend 的查询优化器通过多阶段管道将 SQL 查询转换为高效物理执行计划，利用 SExpr 计划表示、转换规则集、详细统计信息和成本模型评估各种方案。

优化流程：
1. **准备：** 子查询去相关化与统计信息收集
2. **逻辑优化：** 应用规则转换（如过滤器下推、聚合标准化）
3. **连接优化：** 使用动态规划确定最佳连接顺序
4. **物理规划：** 通过 Cascades 框架选择最优物理运算符

通过系统执行这些步骤，优化器最小化资源消耗（CPU/内存/I/O）并最大化查询执行速度。