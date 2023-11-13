---
title: TO_DAY_OF_MONTH
---

Convert a date or date with time (timestamp/datetime) to a UInt8 number containing the number of the day of the month (1-31).

## Syntax

```sql
TO_DAY_OF_MONTH(<expr>)
```

## Arguments

| Arguments | Description    |
|-----------|----------------|
| `<expr>`  | date/timestamp |

## Return Type

`TINYINT`

## Examples

```sql
SELECT
    to_day_of_month('2023-11-12 09:38:18.165575')

┌───────────────────────────────────────────────┐
│ to_day_of_month('2023-11-12 09:38:18.165575') │
│                     UInt8                     │
├───────────────────────────────────────────────┤
│                                            12 │
└───────────────────────────────────────────────┘
```
