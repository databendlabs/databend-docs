---
title: Other Functions
---

This page provides reference information for various utility and miscellaneous functions in Databend that don't fit into other function categories.

## Type Conversion Functions

| Function | Description | Example |
|----------|-------------|--------|
| [TO_NULLABLE](to-nullable.md) | Converts a non-Nullable type to a Nullable type | `TO_NULLABLE(123)` → `123` (as Nullable) |
| [TYPEOF](typeof.md) | Returns the name of a data type | `TYPEOF(1::INT)` → `'INT'` |
| [REMOVE_NULLABLE](remove-nullable.md) | Removes Nullable from a Nullable type | `REMOVE_NULLABLE(column)` |

## Utility Functions

| Function | Description | Example |
|----------|-------------|--------|
| [HUMANIZE_NUMBER](humanize-number.md) | Formats a number with thousand separators | `HUMANIZE_NUMBER(1234567)` → `'1,234,567'` |
| [HUMANIZE_SIZE](humanize-size.md) | Formats a byte size into human-readable format | `HUMANIZE_SIZE(1048576)` → `'1.00 MiB'` |

## Query and Data Handling Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ASSUME_NOT_NULL](assume-not-null.md) | Treats a Nullable type as non-Nullable | `ASSUME_NOT_NULL(nullable_column)` |
| [EXISTS](exists.md) | Checks if a subquery returns any rows | `SELECT * FROM table WHERE EXISTS(SELECT 1 FROM other_table WHERE id = table.id)` |
| [GROUPING](grouping.md) | Indicates whether a column is aggregated in a GROUPING SETS query | `GROUPING(column_name)` → `0` (included) or `1` (aggregated) |