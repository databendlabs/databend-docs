---
title: POWER, POW
---

Returns the value of `x` to the power of `y`. 

## Syntax

```sql
POWER( <x, y> )

-- POW is an alias for POWER
POW( <x, y> )
```

## Examples

```sql
SELECT POW(-2, 2);

┌───────────────┐
│ pow((- 2), 2) │
├───────────────┤
│             4 │
└───────────────┘
```