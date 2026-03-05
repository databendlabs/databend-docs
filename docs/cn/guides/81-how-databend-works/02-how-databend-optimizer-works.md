---
title: Databend 优化器工作原理
---

Databend 查询优化器的核心任务，是将 SQL 语句转化为可执行的计划。其工作流程是：构建查询的抽象表示，补充实时统计信息，应用规则重写进行优化，探索不同的 join 顺序，最终选择成本最低的物理算子。

无论是分析报表、JSON 搜索、向量检索还是地理空间分析，都使用同一个优化器——**Databend 用一个优化器即可处理所有数据类型**。

## Databend 优化器的核心优势

- **统计信息自动更新**：数据写入时会即时维护行数、取值范围和 NDV，优化器可直接使用最新信息进行选择性估算、join 排序和成本计算，无需手动维护。
- **结构优先，成本其次**：先去除相关子查询、下推谓词和 limit、拆分聚合，缩小搜索空间，尽量将计算推向数据源。
- **动态规划与 Cascades 协同**：`DPhpy` 负责寻找最优 join 顺序，Cascades 在同一 SExpr memo 上选择成本最低的物理算子。
- **原生支持分布式**：规划阶段即可决定本地或分布式执行，必要时将广播改写为基于 key 的 Shuffle，避免热点问题。

## 示例查询

下面这条查询将贯穿整个优化过程：

```sql
WITH recent_orders AS (
  SELECT *
  FROM orders
  WHERE order_date >= DATE_TRUNC('month', today()) - INTERVAL '3' MONTH
    AND fulfillment_status <> 'CANCELLED'
)
SELECT c.region,
       COUNT(*) AS order_count,
       COUNT(o.id) AS row_count,
       COUNT(DISTINCT o.product_id) AS product_count,
       MIN(o.total_amount) AS min_amount,
       AVG(o.total_amount) AS avg_amount
FROM recent_orders o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN products p ON o.product_id = p.id
WHERE c.status = 'ACTIVE'
  AND o.total_amount > 0
  AND p.is_active = TRUE
  AND EXISTS (
        SELECT 1
        FROM support_tickets t
        WHERE t.customer_id = c.id
          AND t.created_at > DATE_TRUNC('month', today()) - INTERVAL '1' MONTH
      )
GROUP BY c.region
HAVING COUNT(*) > 100
ORDER BY order_count DESC
LIMIT 10;
```

## 第一阶段：准备查询并补充统计信息

先梳理查询结构，为其配备准确的统计数据，为后续成本估算奠定基础。

### 1. 展平相关子查询

将 `EXISTS (...)` 改写为 semi-join，确保后续优化在统一的 join 树上进行：

```
# 改写前（相关子查询）
customers ─┐
           ├─ JOIN ─ orders
support ───┘        │
                    └─ EXISTS(...)

# 改写后（semi-join）
customers ─┐
support ───┴─ SEMI JOIN ─ orders
```

对应的 SQL 变为：

```sql
FROM (
  SELECT *
  FROM orders
  WHERE order_date >= DATE_TRUNC('month', today()) - INTERVAL '3' MONTH
    AND fulfillment_status <> 'CANCELLED'
) o
JOIN customers c ON o.customer_id = c.id
LEFT JOIN products p ON o.product_id = p.id
JOIN (
  SELECT DISTINCT customer_id
  FROM support_tickets
  WHERE created_at > DATE_TRUNC('month', today()) - INTERVAL '1' MONTH
) t ON t.customer_id = c.id
```

### 2. 利用统计信息优化聚合

对于无过滤条件的聚合（如 `MIN(o.total_amount)`），优化器可直接使用统计信息中的值：

```
SELECT MIN(total_amount) FROM orders
        ↓
SELECT table_stats.min_total_amount
```

在本例中，`orders` 表有过滤条件，所以需要保持实际计算。

### 3. 为扫描节点附加统计信息

规划阶段记录每个扫描节点的行数、取值范围、NDV 和直方图，供后续选择性估算和成本计算使用。

### 4. 归一化聚合

有了统计信息，优化器将可共享的计数统一表示，例如将 `COUNT(o.id)` 改写为 `COUNT(*)`，避免重复计算：

```sql
SELECT c.region,
       COUNT(*) AS order_count,
       COUNT(*) AS row_count,
       COUNT(DISTINCT o.product_id) AS product_count,
       MIN(o.total_amount) AS min_amount,
       AVG(o.total_amount) AS avg_amount
...
```

## 第二阶段：精简逻辑计划

通过规则重写消除不必要的计算。

### 1. 下推过滤和 LIMIT

```
# 改写前
Filter (o.total_amount > 0)
└─ Scan (recent_orders)

# 改写后
Scan (recent_orders, pushdown_predicates=[total_amount > 0])
```

带 LIMIT 的排序也会重新排列，先限制再排序：

```
# 改写前
Limit (10)
└─ Sort (order_count DESC)
   └─ Join (...)

# 改写后
Sort (order_count DESC)
└─ Limit (10)
   └─ Join (...)
```

### 2. 去除冗余谓词

```
# 改写前
Filter (1 = 1 AND c.status = 'ACTIVE')
└─ ...

# 改写后
Filter (c.status = 'ACTIVE')
└─ ...
```

### 3. 拆分聚合

```
# 改写前
Aggregate (COUNT/AVG)
└─ Scan (recent_orders)

# 改写后
Aggregate (final)
└─ Aggregate (partial)
   └─ Scan (recent_orders)
```

部分聚合在靠近数据处完成，最终只需合并结果。

### 4. 将过滤条件下推至 CTE

仅依赖 `recent_orders` 的谓词（如 `o.total_amount > 0`）被下推至 CTE 定义，从源头减少数据量：

```sql
WITH recent_orders AS (
  SELECT *
  FROM orders
  WHERE order_date >= DATE_TRUNC('month', today()) - INTERVAL '3' MONTH
    AND fulfillment_status <> 'CANCELLED'
    AND total_amount > 0
)
```

## 第三阶段：确定连接策略和物理执行方案

逻辑计划已优化，统计信息就绪，优化器做出关键决策：

### 1. 选择 join 顺序

`DPhpyOptimizer` 使用统计驱动的动态规划评估各种 join 顺序，倾向于让过滤后的小维表构建 hash table，较大的 `recent_orders` 做 probe：

```
    customers      products
           \      /
            HASH JOIN (build)
                 |
        recent_orders  (probe)
                 |
        SEMI JOIN support_tickets
```

### 2. 调整连接语义

#### a. 将满足条件的 LEFT JOIN 转为 INNER JOIN

示例中 `LEFT JOIN products p` 带有 `p.is_active = TRUE`，仅保留匹配行，可安全转为 INNER JOIN：

```
# 改写前
recent_orders ──⊗── products   (LEFT)
            filter: p.is_active = TRUE

# 改写后
recent_orders ──⋈── products   (INNER)
```

#### b. 去除重复 join 条件

`o.customer_id = c.id` 等条件若重复出现，`DeduplicateJoinConditionOptimizer` 仅保留一份，避免执行阶段重复计算。

#### c. 按需交换 join 两侧

启用额外重排时，`CommuteJoin` 可交换左右输入，让小表构建 hash table，或配合集群分发策略：

```
# 改写前                     # 改写后（小表负责建 hash table）
customers ──⋈── recent_orders   recent_orders ──⋈── customers
```

### 3. 选择物理算子和执行模式

`CascadesOptimizer` 在共享 memo 中比较 hash join、merge join、nested loop 等实现，同时决定计划本地执行还是分布到 warehouse 节点。需要分布式执行且存在大表时，将 broadcast 改写为 Hash Shuffle，避免大表复制到所有节点。最终移除多余 projection 和未使用的 CTE，保持计划精简。

## 观测与调试

- `EXPLAIN`：查看优化器最终生成的执行计划。
- `EXPLAIN PIPELINE`：了解算子在各节点上的排布与调度情况。
- `SET enable_optimizer_trace = 1`：记录优化器每一步，便于在查询日志中复盘。
