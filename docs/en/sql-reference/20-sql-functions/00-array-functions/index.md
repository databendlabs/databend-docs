---
title: Array Functions
---

This page provides a comprehensive overview of Array functions in Databend, organized by functionality for easy reference.

> **Note:** Some array functions have been moved to the [Semi-Structured Functions](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/) section as they now support both standard array types and variant array types. Functions that remain in this section generally support only standard array types.

## Array Creation and Manipulation

| Function | Description | Example | Notes |
|----------|-------------|---------|-------|
| [ARRAY_APPEND](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-append) | Appends an element to the end of an array | `ARRAY_APPEND([1, 2], 3)` → `[1,2,3]` | Moved to Semi-Structured Functions |
| [ARRAY_CONCAT](array-concat.md) | Concatenates two arrays | `ARRAY_CONCAT([1, 2], [3, 4])` → `[1,2,3,4]` | |
| [ARRAY_PREPEND](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-prepend) | Prepends an element to the beginning of an array | `ARRAY_PREPEND(0, [1, 2])` → `[0,1,2]` | Moved to Semi-Structured Functions |
| [ARRAY_DISTINCT](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-distinct) | Removes duplicate elements from an array | `ARRAY_DISTINCT([1, 1, 2, 2])` → `[1,2]` | Moved to Semi-Structured Functions |
| [ARRAY_FLATTEN](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-flatten) | Flattens nested arrays into a single array | `ARRAY_FLATTEN([[1, 2], [3, 4]])` → `[1,2,3,4]` | Moved to Semi-Structured Functions |
| [ARRAY_REMOVE_FIRST](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-remove-first) | Removes the first element from an array | `ARRAY_REMOVE_FIRST([1, 2, 3])` → `[2,3]` | Moved to Semi-Structured Functions |
| [ARRAY_REMOVE_LAST](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-remove-last) | Removes the last element from an array | `ARRAY_REMOVE_LAST([1, 2, 3])` → `[1,2]` | Moved to Semi-Structured Functions |
| [ARRAY_SORT](array-sort.md) | Sorts elements in an array | `ARRAY_SORT([3, 1, 2])` → `[1,2,3]` | |
| [ARRAY_UNIQUE](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-unique) | Removes duplicate elements from an array | `ARRAY_UNIQUE([1, 1, 2, 2])` → `[1,2]` | Moved to Semi-Structured Functions |
| [ARRAYS_ZIP](arrays-zip.md) | Combines multiple arrays into an array of tuples | `ARRAYS_ZIP([1, 2], ['a', 'b'])` → `[(1,'a'),(2,'b')]` | |
| [RANGE](range.md) | Creates an array of integers in the specified range | `RANGE(1, 5)` → `[1,2,3,4]` | |

## Array Access and Information

| Function | Description | Example | Notes |
|----------|-------------|---------|-------|
| [ARRAY_GET](array-get.md) / [GET](get.md) | Gets an element at the specified position | `ARRAY_GET([1, 2, 3], 1)` → `2` | |
| [ARRAY_LENGTH](array-length.md) / [ARRAY_SIZE](array-size.md) | Returns the number of elements in an array | `ARRAY_LENGTH([1, 2, 3])` → `3` | |
| [ARRAY_INDEXOF](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-indexof) | Returns the position of the first occurrence of an element | `ARRAY_INDEXOF([1, 2, 3], 2)` → `1` | Moved to Semi-Structured Functions |
| [ARRAY_CONTAINS](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-contains) / [CONTAINS](contains.md) | Checks if an array contains a specific element | `CONTAINS([1, 2, 3], 2)` → `true` | ARRAY_CONTAINS moved to Semi-Structured Functions |
| [SLICE](slice.md) / [ARRAY_SLICE](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-slice) | Extracts a subarray | `SLICE([1, 2, 3, 4], 1, 2)` → `[2,3]` | ARRAY_SLICE moved to Semi-Structured Functions |

## Array Transformation

| Function | Description | Example | Notes |
|----------|-------------|---------|-------|
| [ARRAY_TRANSFORM](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-transform) | Applies a lambda function to each element | `ARRAY_TRANSFORM([1, 2, 3], x -> x * 2)` → `[2,4,6]` | Moved to Semi-Structured Functions |
| [ARRAY_FILTER](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-filter) | Filters elements based on a lambda condition | `ARRAY_FILTER([1, 2, 3], x -> x > 1)` → `[2,3]` | Moved to Semi-Structured Functions |
| [ARRAY_REDUCE](/docs/en/sql-reference/20-sql-functions/10-semi-structured-functions/array-reduce) | Reduces array to a single value using a lambda function | `ARRAY_REDUCE([1, 2, 3], 0, (s, x) -> s + x)` → `6` | Moved to Semi-Structured Functions |
| [ARRAY_APPLY](array-apply.md) | Applies a function to each element | `ARRAY_APPLY([1, 2, 3], x -> x * x)` → `[1,4,9]` | |
| [ARRAY_AGGREGATE](array-aggregate.md) | Applies an aggregate function to array elements | `ARRAY_AGGREGATE([1, 2, 3], 'sum')` → `6` | |
| [ARRAY_TO_STRING](array-to-string.md) | Converts an array to a string with a delimiter | `ARRAY_TO_STRING([1, 2, 3], ',')` → `'1,2,3'` | |
| [UNNEST](unnest.md) | Expands an array into a set of rows | `SELECT UNNEST([1, 2, 3])` → `1`, `2`, `3` (as rows) | |