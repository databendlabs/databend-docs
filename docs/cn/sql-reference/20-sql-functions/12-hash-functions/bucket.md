---
title: BUCKET
---

将支持的数据映射到固定数量的哈希桶之一。`BUCKET()` 返回 `0` 至 `bucket_count - 1` 范围内的确定性 `UInt32` 值，主要用于 [`PARTITION BY`](/guides/performance/partition-by) 和 `CLUSTER BY` 表达式。

## 语法

```sql
BUCKET(<bucket_count>, <value>)
```

## 参数

| 参数 | 说明 |
|------|------|
| `bucket_count` | `1` 至 `4294967295` 范围内的整数。在 `PARTITION BY` 或 `CLUSTER BY` 表达式中，它必须是常量字面量。 |
| `value` | 要进行哈希计算的 Integer、String、Date 或 Timestamp 值。 |

任一参数为 `NULL` 时，函数返回 `NULL`。

:::note
同一数据类型的相同值会得到稳定的桶编号，但使用不同数据类型表示的同一个逻辑值可能映射到不同的桶。请避免修改分桶键的数据类型。
:::

## 示例

```sql
-- 返回 0 至 15 范围内的整数。
SELECT BUCKET(16, 'customer-123');
```

使用固定桶数量对高基数键进行分区：

```sql
CREATE TABLE customer_events (
    customer_id BIGINT,
    event_time  TIMESTAMP,
    payload     VARIANT
)
PARTITION BY (BUCKET(32, customer_id));
```

对于分布式导入，可以将计算后分区值相同的行路由到同一个 Writer：

```sql
CREATE TABLE customer_events_distributed (
    customer_id BIGINT,
    event_time  TIMESTAMP
)
PARTITION BY (BUCKET(32, customer_id))
WRITE_DISTRIBUTION_MODE = 'hash';
```

`WRITE_DISTRIBUTION_MODE = 'hash'` 必须与 `PARTITION BY` 一同使用。
