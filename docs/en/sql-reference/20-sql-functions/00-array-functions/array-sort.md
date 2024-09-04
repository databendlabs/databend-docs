---
title: ARRAY_SORT
---

Sorts the elements in an array in ascending order.

## Syntax

```sql
ARRAY_SORT(<array>[, 'ASC'|'DESC', 'NULLS FIRST'|'NULLS LAST'])
```

| Parameter     | Default? | Description                                                                                  |
|---------------|----------|----------------------------------------------------------------------------------------------|
| `ASC`         | Yes      | Specifies that the sorting order is ascending, arranging elements from smallest to largest.  |
| `DESC`        | No       | Specifies that the sorting order is descending, arranging elements from largest to smallest. |
| `NULLS FIRST` | Yes      | Determines that NULL values should appear at the beginning of the sorted output.             |
| `NULLS LAST`  | No       | Determines that NULL values should appear at the end of the sorted output.                   |

## Examples

This example shows the array sorted in ascending order by default, with the elements arranged from smallest to largest:

```sql
SELECT ARRAY_SORT([1, 4, 3, 2]);

-[ RECORD 1 ]-----------------------------------
array_sort([1, 4, 3, 2]): [1,2,3,4]
```

This example sorts the array in descending order, arranging the elements from largest to smallest:

```sql
SELECT ARRAY_SORT([1, 4, 3, 2], 'DESC');

-[ RECORD 1 ]-----------------------------------
array_sort([1, 4, 3, 2], 'desc'): [4,3,2,1]
```

This example demonstrates how NULL values are handled in descending order, with NULLs appearing before all non-NULL values:

```sql
SELECT ARRAY_SORT([1, 4, 3, 2, NULL], 'DESC');

-[ RECORD 1 ]-----------------------------------
array_sort([1, 4, 3, 2, null], 'desc'): [NULL,4,3,2,1]
```

This example shows the array sorted in descending order while ensuring that NULL values appear at the end of the sorted output:

```sql
SELECT ARRAY_SORT([1, 4, 3, 2, NULL], 'DESC', 'NULLS LAST');

-[ RECORD 1 ]-----------------------------------
array_sort([1, 4, 3, 2, null], 'desc', 'nulls last'): [4,3,2,1,NULL]
```