---
title: MODULO
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Returns the remainder of `x` divided by `y`. If `y` is 0, it returns an error.

## Syntax

```sql
MODULO( <x>, <y> )
```

## Aliases

- [MOD](mod.md)

## Decimal Operands

When the operands resolve to DECIMAL types, `MODULO`, `MOD`, and `%` compute an exact decimal remainder instead of converting the operands to Float64. Use explicit DECIMAL casts when you require this behavior; do not assume a mixed floating-point expression uses decimal arithmetic.

For operands `DECIMAL(P1, S1)` and `DECIMAL(P2, S2)`, the result is DECIMAL with:

- Scale `S = max(S1, S2)`.
- Precision `P = min(P1 - S1, P2 - S2) + S`.

A nonzero remainder has the dividend's sign, not the divisor's sign. A zero divisor raises an error. These rules apply to the decimal overload, not a claim that every numeric input returns DECIMAL.

```sql
SELECT
    MODULO(5.5::DECIMAL(10, 2), 0.1::DECIMAL(2, 1)) AS exact_zero,
    MOD(-7.5::DECIMAL(2, 1), 2::DECIMAL(1, 0)) AS negative_remainder,
    7.5::DECIMAL(2, 1) % (-2)::DECIMAL(1, 0) AS positive_remainder;

SELECT TYPEOF(0.25::DECIMAL(2, 2) % 0.1::DECIMAL(1, 1));
```

The first query's values are `0.00`, `-1.5`, and `1.5`. The second query's type is `DECIMAL(2, 2)`. The first expression remains exactly zero despite the fractional divisor.

## Examples

```sql
SELECT MOD(9, 2), MODULO(9, 2);

┌──────────────────────────┐
│ mod(9, 2) │ modulo(9, 2) │
├───────────┼──────────────┤
│         1 │            1 │
└──────────────────────────┘
```