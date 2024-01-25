---
title: ARRAY_INDEXOF
---

Returns the index(1-based) of an element if the array contains the element.

## Syntax

```sql
ARRAY_INDEXOF( <array>, <element> )
```

## Examples

```sql
SELECT ARRAY_INDEXOF([1, 2, 9], 9);

┌─────────────────────────────┐
│ array_indexof([1, 2, 9], 9) │
├─────────────────────────────┤
│                           3 │
└─────────────────────────────┘
```