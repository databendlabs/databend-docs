---
title: ARRAY_UNIQUE
---

Counts unique elements in the array (except NULL).

## Syntax

```sql
ARRAY_UNIQUE( <array> )
```

## Examples

```sql
SELECT ARRAY_UNIQUE([1, 2, 3, 3, 4]);

┌───────────────────────────────┐
│ array_unique([1, 2, 3, 3, 4]) │
├───────────────────────────────┤
│                             4 │
└───────────────────────────────┘
```