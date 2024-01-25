---
title: ARRAY_FLATTEN
---

Flattens nested arrays, converting them into a single-level array.

## Syntax

```sql
ARRAY_FLATTEN( <array> )
```

## Examples

```sql
SELECT ARRAY_FLATTEN([[1,2], [3,4,5]]);

┌────────────────────────────────────┐
│ array_flatten([[1, 2], [3, 4, 5]]) │
├────────────────────────────────────┤
│ [1,2,3,4,5]                        │
└────────────────────────────────────┘
```