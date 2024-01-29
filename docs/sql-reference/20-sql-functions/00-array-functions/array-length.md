---
title: ARRAY_LENGTH
---

Returns the length of an array.

## Syntax

```sql
ARRAY_LENGTH( <array> )
```

## Aliases

- [LENGTH](length.md)

## Examples

```sql
SELECT LENGTH([1, 2]), ARRAY_LENGTH([1, 2]);

┌───────────────────────────────────────┐
│ length([1, 2]) │ array_length([1, 2]) │
├────────────────┼──────────────────────┤
│              2 │                    2 │
└───────────────────────────────────────┘
```