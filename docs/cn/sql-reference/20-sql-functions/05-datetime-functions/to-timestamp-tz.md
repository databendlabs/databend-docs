---
title: TO_TIMESTAMP_TZ
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

将一个值转换为 [`TIMESTAMP_TZ`](../../00-sql-reference/10-data-types/datetime.md#timestamp_tz)，同时保留 UTC 瞬时点和时区偏移。如果你希望在出错时返回 `NULL` 而不是报错，请使用 `TRY_TO_TIMESTAMP_TZ`。

## 语法

```sql
TO_TIMESTAMP_TZ(<expr>)
```

`<expr>` 可以是 ISO-8601 格式的字符串（`YYYY-MM-DD`、`YYYY-MM-DDTHH:MM:SS[.fraction][±offset]`）、`TIMESTAMP` 或 `DATE`。

## 返回类型

`TIMESTAMP_TZ`

## 支持范围

`TIMESTAMP_TZ` 与 `TIMESTAMP` 使用相同的 UTC 范围：`0000-12-31 00:00:00.000000` 至 `9999-12-31 23:59:59.999999`，包含两端。

对于字符串输入，Databend 在应用显式偏移量或会话时区后检查 UTC 时刻。仅当 UTC 时刻在范围内时，才接受本地年份为 `0000` 或带符号的扩展年份（如 `+10000`）的文本。例如，`+10000-01-01 07:59:59.999999 +0800` 表示 UTC 上界。超出范围的 UTC 时刻会导致错误；对于这类文本转换错误，`TRY_TO_TIMESTAMP_TZ` 返回 `NULL`。

文本输出仅使用分钟精度的偏移量，如 `+0806`。包含秒的历史偏移量在转换为文本后重新解析时，可能丢失精度。参阅[时间戳范围与时区](../../00-sql-reference/10-data-types/datetime.md#时间戳范围与时区)。

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
