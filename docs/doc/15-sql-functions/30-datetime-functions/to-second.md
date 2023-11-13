---
title: TO_SECOND
---

Converts a date with time (timestamp/datetime) to a UInt8 number containing the number of the second in the minute (0-59).

## Syntax

```sql
TO_SECOND(<expr>)
```

## Arguments

| Arguments | Description |
|-----------|-------------|
| `<expr>`  | timestamp   |

## Return Type

`TINYINT`

## Examples

```sql
SELECT
    to_second('2023-11-12 09:38:18.165575')

┌─────────────────────────────────────────┐
│ to_second('2023-11-12 09:38:18.165575') │
│                  UInt8                  │
├─────────────────────────────────────────┤
│                                      18 │
└─────────────────────────────────────────┘
```
