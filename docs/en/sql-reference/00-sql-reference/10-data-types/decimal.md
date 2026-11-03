---
title: Decimal
description: Decimal types are high-precision numeric values to be stored and manipulated.
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

## Overview

`DECIMAL(P, S)` stores exact numeric values with precision `P` (total digits, 1–76) and scale `S` (digits to the right of the decimal point, 0–P). Values must sit within ±`(10^P - 1) / 10^S`.

## Examples

```sql
CREATE TABLE invoices (
  description STRING,
  amount DECIMAL(10, 2),
  tax_rate DECIMAL(5, 4)
);

INSERT INTO invoices VALUES
  ('Laptop', 1299.99, 0.1300),
  ('Monitor', 399.50, 0.0750);

SELECT
  description,
  amount,
  tax_rate,
  amount * tax_rate          AS tax_value,
  amount + amount * tax_rate AS total_due
FROM invoices;
```

Result:
```
┌─────────────┬──────────┬──────────┬────────────┬────────────┐
│ description │ amount   │ tax_rate │ tax_value  │ total_due  │
├─────────────┼──────────┼──────────┼────────────┼────────────┤
│ Laptop      │ 1299.99  │ 0.1300   │ 168.998700 │ 1468.988700 │
│ Monitor     │  399.50  │ 0.0750   │  29.962500 │  429.462500 │
└─────────────┴──────────┴──────────┴────────────┴────────────┘
```

Decimal operations select a result precision and scale. The result type can differ from the input types. Use explicit casts if you need a specific result type. See [Decimal Rules](#decimal-rules) for scale and rounding rules.

```sql
SELECT
  SUM(amount)                              AS sum_default,
  CAST(SUM(amount) AS DECIMAL(12, 2))      AS sum_cast,
  AVG(amount)                              AS avg_default,
  CAST(AVG(amount) AS DECIMAL(12, 4))      AS avg_cast
FROM invoices;
```

Result:
```
┌─────────────┬───────────┬────────────────┬──────────┐
│ sum_default │ sum_cast  │ avg_default    │ avg_cast │
├─────────────┼───────────┼────────────────┼──────────┤
│ 1699.49     │ 1699.49   │ 849.74500000   │ 849.7450 │
└─────────────┴───────────┴────────────────┴──────────┘
```

## Decimal Rules

For decimal operands with scales `S1` and `S2`, arithmetic uses these result scales:

| Operation | Result scale |
|-----------|--------------|
| Addition or subtraction | `max(S1, S2)` |
| Multiplication | `min(S1 + S2, max(12, S1, S2))` |
| Division | `max(S1, min(S1 + 6, 12))` |

Result precision is limited to 38 when both input precisions are at most 38. Otherwise, it is limited to 76. A computed result that exceeds its result precision raises an overflow error. Division by zero raises an error.

Multiplication and division round half away from zero when they discard fractional digits. They do not always truncate. The `numeric_cast_option` setting controls casts, not these arithmetic rounding rules.

[ROUND](/sql/sql-functions/numeric-functions/round#decimal-input) also supports decimal results. It reports an error if a rounded integer value exceeds the result precision.

For decimal scale reduction and conversion from FLOAT or DOUBLE, see [TO_DECIMAL](/sql/sql-functions/conversion-functions/to-decimal#numeric-conversion). The conversion rules differ from arithmetic. Use decimal literals or strings when you need to preserve decimal text rather than a binary floating-point value.
