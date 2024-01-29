---
title: ARRAY_GET
---

Returns an element from an array by index (1-based).

## Syntax

```sql
ARRAY_GET( <array>, <index> )
```

## Aliases

- [GET](get.md)

## Examples

```sql
SELECT GET([1, 2], 2), ARRAY_GET([1, 2], 2);

┌───────────────────────────────────────┐
│ get([1, 2], 2) │ array_get([1, 2], 2) │
├────────────────┼──────────────────────┤
│              2 │                    2 │
└───────────────────────────────────────┘
```