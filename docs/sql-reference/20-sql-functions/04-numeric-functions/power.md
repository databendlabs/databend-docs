---
title: POWER
---

Returns the value of `x` to the power of `y`. 

## Syntax

```sql
POWER( <x, y> )
```

## Aliases

- [POW](pow.md)

## Examples

```sql
SELECT POW(-2, 2), POWER(-2, 2);

┌─────────────────────────────────┐
│ pow((- 2), 2) │ power((- 2), 2) │
├───────────────┼─────────────────┤
│             4 │               4 │
└─────────────────────────────────┘
```