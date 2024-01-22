---
title: ARRAY_APPEND
---

Prepends an element to the array.

## Syntax

```sql
ARRAY_APPEND( <array>, <element>)
```

## Examples

```sql
SELECT ARRAY_APPEND([3, 4], 5);

┌─────────────────────────┐
│ array_append([3, 4], 5) │
├─────────────────────────┤
│ [3,4,5]                 │
└─────────────────────────┘
```