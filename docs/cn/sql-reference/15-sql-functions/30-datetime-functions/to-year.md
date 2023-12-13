---
title: TO_YEAR
---

Converts a date or date with time (timestamp/datetime) to a UInt16 number containing the year number (AD).

## Syntax

```sql
TO_YEAR(<expr>)
```

## Arguments

| Arguments | Description    |
|-----------|----------------|
| `<expr>`  | date/timestamp |

## Return Type

 `SMALLINT`

## Examples

```sql
SELECT
  to_year('2023-11-12 09:38:18.165575')

┌───────────────────────────────────────┐
│ to_year('2023-11-12 09:38:18.165575') │
│                 UInt16                │
├───────────────────────────────────────┤
│                                  2023 │
└───────────────────────────────────────┘
```
