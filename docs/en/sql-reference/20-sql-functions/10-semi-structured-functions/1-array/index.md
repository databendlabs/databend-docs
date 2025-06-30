---
title: Array Functions
---

This section provides reference information for array functions in Databend. Array functions enable creation, manipulation, searching, and transformation of array data structures.

## Array Creation & Construction

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_CONSTRUCT](array-construct) | Creates an array from individual values | `ARRAY_CONSTRUCT(1, 2, 3)` → `[1,2,3]` |
| [RANGE](range) | Generates an array of sequential numbers | `RANGE(1, 5)` → `[1,2,3,4]` |

## Array Access & Information

| Function | Description | Example |
|----------|-------------|---------|
| [GET](get) | Gets an element from an array by index | `GET([1,2,3], 1)` → `1` |
| [ARRAY_GET](array-get) | Alias for GET function | `ARRAY_GET([1,2,3], 1)` → `1` |
| [CONTAINS](contains) | Checks if an array contains a specific value | `CONTAINS([1,2,3], 2)` → `true` |
| [ARRAY_CONTAINS](array-contains) | Checks if an array contains a specific value | `ARRAY_CONTAINS([1,2,3], 2)` → `true` |

## Array Modification

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_APPEND](array-append) | Appends an element to the end of an array | `ARRAY_APPEND([1,2], 3)` → `[1,2,3]` |
| [ARRAY_PREPEND](array-prepend) | Prepends an element to the beginning of an array | `ARRAY_PREPEND(0, [1,2])` → `[0,1,2]` |
| [ARRAY_INSERT](array-insert) | Inserts an element at a specific position | `ARRAY_INSERT([1,3], 1, 2)` → `[1,2,3]` |
| [ARRAY_REMOVE](array-remove) | Removes all occurrences of a specified element | `ARRAY_REMOVE([1,2,2,3], 2)` → `[1,3]` |
| [ARRAY_REMOVE_FIRST](array-remove-first) | Removes the first element from an array | `ARRAY_REMOVE_FIRST([1,2,3])` → `[2,3]` |
| [ARRAY_REMOVE_LAST](array-remove-last) | Removes the last element from an array | `ARRAY_REMOVE_LAST([1,2,3])` → `[1,2]` |

## Array Combination & Manipulation

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_CONCAT](array-concat) | Concatenates multiple arrays | `ARRAY_CONCAT([1,2], [3,4])` → `[1,2,3,4]` |
| [ARRAY_SLICE](array-slice) | Extracts a portion of an array | `ARRAY_SLICE([1,2,3,4], 1, 2)` → `[1,2]` |
| [SLICE](slice) | Alias for ARRAY_SLICE function | `SLICE([1,2,3,4], 1, 2)` → `[1,2]` |
| [ARRAYS_ZIP](arrays-zip) | Combines multiple arrays element-wise | `ARRAYS_ZIP([1,2], ['a','b'])` → `[(1,'a'),(2,'b')]` |

## Array Set Operations

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_DISTINCT](array-distinct) | Returns unique elements from an array | `ARRAY_DISTINCT([1,2,2,3])` → `[1,2,3]` |
| [ARRAY_UNIQUE](array-unique) | Alias for ARRAY_DISTINCT function | `ARRAY_UNIQUE([1,2,2,3])` → `[1,2,3]` |
| [ARRAY_INTERSECTION](array-intersection) | Returns common elements between arrays | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` → `[2,3]` |
| [ARRAY_EXCEPT](array-except) | Returns elements in first array but not in second | `ARRAY_EXCEPT([1,2,3], [2,4])` → `[1,3]` |
| [ARRAY_OVERLAP](array-overlap) | Checks if arrays have common elements | `ARRAY_OVERLAP([1,2,3], [3,4,5])` → `true` |

## Array Processing & Transformation

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_TRANSFORM](array-transform) | Applies a function to each array element | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` → `[2,4,6]` |
| [ARRAY_FILTER](array-filter) | Filters array elements based on a condition | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` → `[3,4]` |
| [ARRAY_REDUCE](array-reduce) | Reduces array to a single value using aggregation | `ARRAY_REDUCE([1,2,3], 0, (acc,x) -> acc + x)` → `6` |
| [ARRAY_AGGREGATE](array-aggregate) | Aggregates array elements using a function | `ARRAY_AGGREGATE([1,2,3], 'sum')` → `6` |

## Array Utility Functions

| Function | Description | Example |
|----------|-------------|---------|
| [ARRAY_COMPACT](array-compact) | Removes null values from an array | `ARRAY_COMPACT([1,null,2,null,3])` → `[1,2,3]` |
| [ARRAY_FLATTEN](array-flatten) | Flattens nested arrays into a single array | `ARRAY_FLATTEN([[1,2],[3,4]])` → `[1,2,3,4]` |
| [ARRAY_REVERSE](array-reverse) | Reverses the order of array elements | `ARRAY_REVERSE([1,2,3])` → `[3,2,1]` |
| [ARRAY_INDEXOF](array-indexof) | Returns the index of first occurrence of an element | `ARRAY_INDEXOF([1,2,3,2], 2)` → `1` |
| [UNNEST](unnest) | Expands an array into individual rows | `UNNEST([1,2,3])` → `1, 2, 3` (as separate rows) |
