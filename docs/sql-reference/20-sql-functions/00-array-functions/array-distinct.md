---
title: ARRAY_DISTINCT
---

Removes all duplicates and NULLs from the array without preserving the original order.

## Syntax

```sql
ARRAY_DISTINCT( <array> )
```

## Examples

```sql
SELECT ARRAY_DISTINCT([1, 2, 2, 4, 3]);

┌─────────────────────────────────┐
│ array_distinct([1, 2, 2, 4, 3]) │
├─────────────────────────────────┤
│ [1,2,4,3]                       │
└─────────────────────────────────┘
```