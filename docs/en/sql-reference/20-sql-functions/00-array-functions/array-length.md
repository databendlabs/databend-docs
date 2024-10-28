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
SELECT 
    ARRAY_LENGTH(['apple', 'banana', 'cherry']) AS item_count,
    ARRAY_SIZE(['apple', 'banana', 'cherry']) AS item_count_alias;

┌───────────────────────────────┐
│ item_count │ item_count_alias │
├────────────┼──────────────────┤
│          3 │                3 │
└───────────────────────────────┘
```