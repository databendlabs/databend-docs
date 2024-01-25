---
title: ARRAY_CONTAINS
---

Checks if the array contains a specific element.

## Syntax

```sql
ARRAY_CONTAINS( <array>, <element> )
```

## Examples

```sql
SELECT ARRAY_CONTAINS([1, 2], 1);

┌───────────────────────────┐
│ array_contains([1, 2], 1) │
├───────────────────────────┤
│ true                      │
└───────────────────────────┘
```