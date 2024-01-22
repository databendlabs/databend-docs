---
title: ARRAY_REMOVE_FIRST
---

Removes the first element from the array.

## Syntax

```sql
ARRAY_REMOVE_FIRST( <array> )
```

## Examples

```sql
SELECT ARRAY_REMOVE_FIRST([1, 2, 3]);

┌───────────────────────────────┐
│ array_remove_first([1, 2, 3]) │
├───────────────────────────────┤
│ [2,3]                         │
└───────────────────────────────┘
```