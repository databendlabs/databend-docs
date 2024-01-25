---
title: ARRAY_FILTER
---

Constructs an array from those elements of the input array for which the lambda function returns true.

## Syntax

```sql
ARRAY_FILTER( <array>, <lambda> )
```

## Examples

```sql
SELECT ARRAY_FILTER([1, 2, 3], x -> x > 1);

┌───────────────────────────────────────┐
│ array_filter([1, 2, 3], x -> (x > 1)) │
├───────────────────────────────────────┤
│ [2,3]                                 │
└───────────────────────────────────────┘
```