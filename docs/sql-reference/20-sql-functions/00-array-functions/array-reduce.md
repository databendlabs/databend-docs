---
title: ARRAY_REDUCE
---

Applies iteratively the lambda function to the elements of the array, so as to reduce the array to a single value.

## Syntax

```sql
ARRAY_REDUCE( <array>, <lambda> )
```

## Examples

```sql
SELECT ARRAY_REDUCE([1, 2, 3, 4], (x,y) -> x + y);

┌───────────────────────────────────────────────┐
│ array_reduce([1, 2, 3, 4], (x, y) -> (x + y)) │
├───────────────────────────────────────────────┤
│                                            10 │
└───────────────────────────────────────────────┘
```