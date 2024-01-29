---
title: INTDIV
---

Returns the quotient by dividing the first number by the second one, rounding down to the closest smaller integer.

## Syntax

```sql
INTDIV(<number1>, <number2>)
```

## Aliases

- [DIV](div.md)

## Examples

```sql
SELECT 6.1 DIV 2, INTDIV(6.1, 2);

┌──────────────────────────────┐
│ (6.1 div 2) │ intdiv(6.1, 2) │
├─────────────┼────────────────┤
│           3 │              3 │
└──────────────────────────────┘
```