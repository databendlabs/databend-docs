---
title: ARRAY_REMOVE_LAST
---

Removes the last element from the array.

## Syntax

```sql
ARRAY_REMOVE_LAST( <array> )
```

## Examples

```sql
SELECT ARRAY_REMOVE_LAST([1, 2, 3]);

┌──────────────────────────────┐
│ array_remove_last([1, 2, 3]) │
├──────────────────────────────┤
│ [1,2]                        │
└──────────────────────────────┘
```