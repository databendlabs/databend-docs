---
title: TO_MONTH
---

Convert a date or date with time (timestamp/datetime) to a UInt8 number containing the month number (1-12).

## Syntax

```sql
TO_MONTH(<expr>)
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
    to_month('2023-11-12 09:38:18.165575')

┌────────────────────────────────────────┐
│ to_month('2023-11-12 09:38:18.165575') │
│                  UInt8                 │
├────────────────────────────────────────┤
│                                     11 │
└────────────────────────────────────────┘
```
