---
title: ROUND
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Rounds `x` to `d` decimal places. `d` defaults to 0. A negative `d` rounds digits to the left of the decimal point. The result type and range of `d` depend on the overload.

For integer and floating-point overloads, the result is DOUBLE (Float64). These overloads limit `d` to the range -30 to 30. Floating-point results can have binary representation errors:

```sql
SELECT ROUND(4/7, 4) - ROUND(3/7, 4); -- Result: 0.14280000000000004
SELECT ROUND(4/7, 4)::DECIMAL(8,4) - ROUND(3/7, 4)::DECIMAL(8,4); -- Result: 0.1428
```

## Syntax

```sql
ROUND( <x, d> )
```

## Decimal Input

The DECIMAL overload returns `DECIMAL(P, clamp(d, 0, S))` for input `DECIMAL(P, S)`. It keeps the input precision. If `d` is greater than or equal to `S`, the value and scale do not change. The decimal overload does not use the floating-point limit of 30 places.

Decimal rounding uses the nearest value. It rounds a halfway value away from zero. It does not depend on `numeric_cast_option`. A very large negative `d` can produce zero. Rounding can raise an overflow error when a carry exceeds precision `P`.

```sql
SELECT ROUND(95::DECIMAL(3, 0), -1), ROUND((-95)::DECIMAL(3, 0), -1);
-- Expected values: 100, -100

SELECT ROUND(99::DECIMAL(2, 0), -2);
-- Expected error: Decimal round overflow
```

The second query cannot store `100` in `DECIMAL(2, 0)`. Increase the input precision before rounding if that result is required.

## Examples

```sql
SELECT ROUND(0.123, 2);

┌─────────────────┐
│ round(0.123, 2) │
├─────────────────┤
│ 0.12            │
└─────────────────┘
```