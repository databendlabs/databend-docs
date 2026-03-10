---
title: TO_TIMESTAMP_TZ
---

将一个值转换为 [`TIMESTAMP_TZ`](../../00-sql-reference/10-data-types/datetime.md#timestamp_tz)，同时保留 UTC 瞬时点和时区偏移。如果你希望在出错时返回 `NULL` 而不是报错，请使用 `TRY_TO_TIMESTAMP_TZ`。

## 语法

```sql
TO_TIMESTAMP_TZ(<expr>)
```

`<expr>` 可以是 ISO-8601 格式的字符串（`YYYY-MM-DD`、`YYYY-MM-DDTHH:MM:SS[.fraction][±offset]`）、`TIMESTAMP` 或 `DATE`。

## 返回类型

`TIMESTAMP_TZ`

## 示例

### 解析带显式偏移的字符串

```sql
SELECT TO_TIMESTAMP_TZ('2021-12-20 17:01:01.000000 +0000')::STRING AS utc_example;

┌──────────────────────────────────────────┐
│ utc_example                              │
├──────────────────────────────────────────┤
│ 2021-12-20 17:01:01.000000 +0000         │
└──────────────────────────────────────────┘
```

### 将 TIMESTAMP 提升为带时区

```sql
SELECT TO_TIMESTAMP_TZ(TO_TIMESTAMP('2021-12-20 17:01:01.000000'))::STRING AS from_timestamp;

┌──────────────────────────────────────────┐
│ from_timestamp                           │
├──────────────────────────────────────────┤
│ 2021-12-20 17:01:01.000000 +0000         │
└──────────────────────────────────────────┘
```

### 转换回 TIMESTAMP

```sql
SELECT TO_TIMESTAMP(TO_TIMESTAMP_TZ('2021-12-20 17:01:01.000000 +0800')) AS back_to_timestamp;

┌────────────────────────┐
│ back_to_timestamp      │
├────────────────────────┤
│ 2021-12-20T09:01:01    │
└────────────────────────┘
```
