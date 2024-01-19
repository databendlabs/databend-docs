---
title: IFNULL
---

Returns `<expr1>` if it is not NULL. Otherwise return `<expr2>`. They must have the same data type.

## Syntax

```sql
IFNULL(<expr1>, <expr2>)
```

## Examples

```sql
SELECT IFNULL(0, NULL);

┌─────────────────┐
│ ifnull(0, null) │
├─────────────────┤
│               0 │
└─────────────────┘
```