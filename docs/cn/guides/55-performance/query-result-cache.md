---
title: 查询结果缓存
---

Databend 在启用时会缓存并持久化每个执行查询的结果，这能显著减少获取答案所需的时间。

## 缓存使用条件

查询结果仅在满足**所有**以下条件时才会从缓存中复用：

| 条件 | 要求 |
|-----------|-------------|
| **缓存启用** | 当前会话中 `enable_query_result_cache = 1` |
| **相同查询** | 查询文本必须完全匹配（区分大小写） |
| **执行时间** | 原始查询运行时间 ≥ `query_result_cache_min_execute_secs` |
| **结果大小** | 缓存结果 ≤ `query_result_cache_max_bytes` |
| **TTL有效** | 缓存时间 < `query_result_cache_ttl_secs` |
| **数据一致性** | 自缓存后表数据未变更（除非 `query_result_cache_allow_inconsistent = 1`） |
| **会话范围** | 缓存为会话专属 |

:::note 自动缓存失效
默认情况下（`query_result_cache_allow_inconsistent = 0`），当底层表数据变化时缓存结果会自动失效。这确保了数据一致性，但可能降低频繁更新表的缓存效果。
:::

## 快速开始

在会话中启用查询结果缓存：

```sql
-- 启用查询结果缓存
SET enable_query_result_cache = 1;

-- 可选：缓存所有查询（包括快速查询）
SET query_result_cache_min_execute_secs = 0;
```

## 配置参数

| 参数 | 默认值 | 描述 |
|---------|---------|-------------|
| `enable_query_result_cache` | 0 | 启用/禁用查询结果缓存 |
| `query_result_cache_allow_inconsistent` | 0 | 允许使用底层数据变更后的缓存结果 |
| `query_result_cache_max_bytes` | 1048576 | 单个缓存结果的最大字节数 |
| `query_result_cache_min_execute_secs` | 1 | 缓存前的最小执行时间（秒） |
| `query_result_cache_ttl_secs` | 300 | 缓存过期时间（5分钟） |

## 性能示例

本示例演示缓存 TPC-H Q1 查询：

### 1. 启用缓存
```sql
SET enable_query_result_cache = 1;
SET query_result_cache_min_execute_secs = 0;
```

### 2. 首次执行（无缓存）
```sql
SELECT
    l_returnflag,
    l_linestatus,
    sum(l_quantity) as sum_qty,
    sum(l_extendedprice) as sum_base_price,
    sum(l_extendedprice * (1 - l_discount)) as sum_disc_price,
    sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) as sum_charge,
    avg(l_quantity) as avg_qty,
    avg(l_extendedprice) as avg_price,
    avg(l_discount) as avg_disc,
    count(*) as count_order
FROM lineitem
WHERE l_shipdate <= add_days(to_date('1998-12-01'), -90)
GROUP BY l_returnflag, l_linestatus
ORDER BY l_returnflag, l_linestatus;
```

**结果**：4 行数据，耗时 **21.492 秒**（处理 6 亿行）

### 3. 验证缓存条目
```sql
SELECT sql, query_id, result_size, num_rows FROM system.query_cache;
```

### 4. 二次执行（从缓存）
再次运行相同查询。

**结果**：4 行数据，耗时 **0.164 秒**（处理 0 行）

## 缓存管理

### 监控缓存使用
```sql
SELECT * FROM system.query_cache;
```

### 访问缓存结果
```sql
SELECT * FROM RESULT_SCAN(LAST_QUERY_ID());
```

### 缓存生命周期
缓存结果会在以下情况自动清除：
- **TTL过期**（默认：5分钟）
- **结果大小超限**（默认：1MB）
- **会话结束**（缓存为会话范围）
- **底层数据变更**（自动失效以保证一致性）
- **表结构变更**（模式修改会使缓存失效）

:::note 会话范围
查询结果缓存是会话范围的。每个会话维护自己的缓存，会话结束时自动清理。
:::