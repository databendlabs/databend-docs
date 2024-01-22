---
title: GET
---

Returns an element from an array by index (1-based).

## Syntax

```sql
GET( <array>, <index> )
```

## Examples

```sql
SELECT GET([1, 2], 2);

┌────────────────┐
│ get([1, 2], 2) │
├────────────────┤
│              2 │
└────────────────┘
```