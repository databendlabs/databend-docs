---
title: TO_START_OF_FIFTEEN_MINUTES
---

将日期和时间（timestamp/datetime）向下舍入到十五分钟间隔的开始时间。
## Syntax

```sql
TO_START_OF_FIFTEEN_MINUTES(<expr>)
```

## Arguments

| Arguments | Description |
|-----------|-------------|
| `<expr>`  | timestamp   |

## Return Type

`TIMESTAMP`，以“YYYY-MM-DD hh:mm:ss.ffffff”格式返回日期。

## Examples

```sql
SELECT
  to_start_of_fifteen_minutes('2023-11-12 09:38:18.165575');

┌───────────────────────────────────────────────────────────┐
│ to_start_of_fifteen_minutes('2023-11-12 09:38:18.165575') │
├───────────────────────────────────────────────────────────┤
│ 2023-11-12 09:30:00                                       │
└───────────────────────────────────────────────────────────┘
```