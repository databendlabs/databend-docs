---
title: Array Functions
---

This page provides a comprehensive overview of Array functions in Databend, organized by functionality for easy reference.

## Array Creation and Manipulation

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_APPEND](array-append.md) | Appends an element to the end of an array | `ARRAY_APPEND([1, 2], 3)` → `[1,2,3]` |
| [ARRAY_CONCAT](array-concat.md) | Concatenates two arrays | `ARRAY_CONCAT([1, 2], [3, 4])` → `[1,2,3,4]` |
| [ARRAY_PREPEND](array-prepend.md) | Prepends an element to the beginning of an array | `ARRAY_PREPEND(0, [1, 2])` → `[0,1,2]` |
| [ARRAY_DISTINCT](array-distinct.md) | Removes duplicate elements from an array | `ARRAY_DISTINCT([1, 1, 2, 2])` → `[1,2]` |
| [ARRAY_FLATTEN](array-flatten.md) | Flattens nested arrays into a single array | `ARRAY_FLATTEN([[1, 2], [3, 4]])` → `[1,2,3,4]` |
| [ARRAY_REMOVE_FIRST](array-remove-first.md) | Removes the first element from an array | `ARRAY_REMOVE_FIRST([1, 2, 3])` → `[2,3]` |
| [ARRAY_REMOVE_LAST](array-remove-last.md) | Removes the last element from an array | `ARRAY_REMOVE_LAST([1, 2, 3])` → `[1,2]` |
| [ARRAY_SORT](array-sort.md) | Sorts elements in an array | `ARRAY_SORT([3, 1, 2])` → `[1,2,3]` |
| [ARRAY_UNIQUE](array-unique.md) | Removes duplicate elements from an array | `ARRAY_UNIQUE([1, 1, 2, 2])` → `[1,2]` |
| [ARRAYS_ZIP](arrays-zip.md) | Combines multiple arrays into an array of tuples | `ARRAYS_ZIP([1, 2], ['a', 'b'])` → `[(1,'a'),(2,'b')]` |
| [RANGE](range.md) | Creates an array of integers in the specified range | `RANGE(1, 5)` → `[1,2,3,4]` |

## Array Access and Information

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_GET](array-get.md) / [GET](get.md) | Gets an element at the specified position | `ARRAY_GET([1, 2, 3], 1)` → `2` |
| [ARRAY_LENGTH](array-length.md) / [ARRAY_SIZE](array-size.md) | Returns the number of elements in an array | `ARRAY_LENGTH([1, 2, 3])` → `3` |
| [ARRAY_INDEXOF](array-indexof.md) | Returns the position of the first occurrence of an element | `ARRAY_INDEXOF([1, 2, 3], 2)` → `1` |
| [ARRAY_CONTAINS](array-contains.md) / [CONTAINS](contains.md) | Checks if an array contains a specific element | `CONTAINS([1, 2, 3], 2)` → `true` |
| [SLICE](slice.md) / [ARRAY_SLICE](array-slice.md) | Extracts a subarray | `SLICE([1, 2, 3, 4], 1, 2)` → `[2,3]` |

## Array Transformation

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_TRANSFORM](array-transform.md) | Applies a lambda function to each element | `ARRAY_TRANSFORM([1, 2, 3], x -> x * 2)` → `[2,4,6]` |
| [ARRAY_FILTER](array-filter.md) | Filters elements based on a lambda condition | `ARRAY_FILTER([1, 2, 3], x -> x > 1)` → `[2,3]` |
| [ARRAY_REDUCE](array-reduce.md) | Reduces array to a single value using a lambda function | `ARRAY_REDUCE([1, 2, 3], 0, (s, x) -> s + x)` → `6` |
| [ARRAY_APPLY](array-apply.md) | Applies a function to each element | `ARRAY_APPLY([1, 2, 3], x -> x * x)` → `[1,4,9]` |
| [ARRAY_AGGREGATE](array-aggregate.md) | Applies an aggregate function to array elements | `ARRAY_AGGREGATE([1, 2, 3], 'sum')` → `6` |
| [ARRAY_TO_STRING](array-to-string.md) | Converts an array to a string with a delimiter | `ARRAY_TO_STRING([1, 2, 3], ',')` → `'1,2,3'` |
| [UNNEST](unnest.md) | Expands an array into a set of rows | `SELECT UNNEST([1, 2, 3])` → `1`, `2`, `3` (as rows) |