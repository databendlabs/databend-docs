---
title: ARRAY_SORT
---

Sorts elements in the array in ascending order.

## Syntax

```sql
ARRAY_SORT( <array>[, <order>, <nullposition>] )
```

| Parameter    | Default     | Description                                                                                                                                    |
|--------------|-------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| order        | ASC         | Specifies the sorting order as either ascending (ASC) or descending (DESC).                                                                    |
| nullposition | NULLS FIRST | Determines the position of NULL values in the sorting result, at the beginning (NULLS FIRST) or at the end (NULLS LAST) of the sorting output. |

## Examples

```sql
SELECT ARRAY_SORT([1, 4, 3, 2]);

┌──────────────────────────┐
│ array_sort([1, 4, 3, 2]) │
├──────────────────────────┤
│ [1,2,3,4]                │
└──────────────────────────┘
```