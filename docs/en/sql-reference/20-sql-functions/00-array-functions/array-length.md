---
title: ARRAY_LENGTH
---

Returns the length of an array.

## Syntax

```sql
ARRAY_LENGTH( <array> )
```

## Aliases

- [ARRAY_SIZE](array-size.md)

## Examples

```sql
SELECT ARRAY_LENGTH([1, 2]), ARRAY_SIZE([1, 2]);

┌───────────────────────────────────────────┐
│ array_length([1, 2]) │ array_size([1, 2]) │
├──────────────────────┼────────────────────┤
│                    2 │                  2 │
└───────────────────────────────────────────┘
```