---
title: MOD
---

Returns the remainder of `x` divided by `y`. If `y` is 0, it returns an error.

## Syntax

```sql
MOD( <x>, <y> )
```

## Aliases

- [MODULO](modulo.md)

## Examples

```sql
SELECT MOD(9, 2), MODULO(9, 2);

┌──────────────────────────┐
│ mod(9, 2) │ modulo(9, 2) │
├───────────┼──────────────┤
│         1 │            1 │
└──────────────────────────┘
```