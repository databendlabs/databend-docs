---
title: ARRAY_LENGTH
---

Returns the length of an array.

## Syntax

```sql
ARRAY_LENGTH( <array> )
```

## Examples

```sql
SELECT ARRAY_LENGTH([1, 2]);

┌──────────────────────┐
│ array_length([1, 2]) │
├──────────────────────┤
│                    2 │
└──────────────────────┘
```