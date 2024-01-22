---
title: LEAST
---

Returns the minimum value from a set of values.

## Syntax

```sql
LEAST(<value1>, <value2> ...)
```

## Examples

```sql
SELECT LEAST(5, 9, 4);

┌────────────────┐
│ least(5, 9, 4) │
├────────────────┤
│              4 │
└────────────────┘
```