---
title: ADD
---

Calculates the sum of two numeric or decimal values.

## Syntax

```sql
ADD(<number1>, <number2>)
```

## Aliases

- [PLUS](plus.md)

## Examples

```sql
SELECT ADD(1, 2.3), PLUS(1, 2.3);

┌───────────────────────────────┐
│  add(1, 2.3)  │  plus(1, 2.3) │
├───────────────┼───────────────┤
│ 3.3           │ 3.3           │
└───────────────────────────────┘
```