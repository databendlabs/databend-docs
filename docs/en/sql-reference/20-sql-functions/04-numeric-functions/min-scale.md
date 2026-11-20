---
title: MIN_SCALE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Returns the minimum number of fractional digits needed to represent a decimal value exactly. Trailing fractional zeros do not count. This function does not change the value or its declared decimal type.

## Syntax

```sql
MIN_SCALE(<decimal>)
```

## Arguments

| Argument | Description |
|----------|-------------|
| `<decimal>` | A `DECIMAL` expression. Supports all decimal widths, including Decimal256. |

## Return Type

`UInt8`. Returns `NULL` for a `NULL` input.

An integer-valued decimal or zero returns `0`. A negative value has the same minimum scale as its absolute value.

## Examples

```sql
SELECT MIN_SCALE(1.2300::DECIMAL(10, 4)) AS scale;
-- 2

SELECT MIN_SCALE(-0.0010::DECIMAL(10, 4)) AS scale;
-- 3

SELECT MIN_SCALE(0::DECIMAL(10, 4)) AS scale;
-- 0

SELECT MIN_SCALE(1.0000000000000000001::DECIMAL(38, 19)) AS scale;
-- 19

SELECT MIN_SCALE(NULL) AS scale;
-- NULL
```

Use `MAX(MIN_SCALE(...))` to find the largest minimum scale in a column or group. For example, a group with decimal values `0.01`, `0.1234`, and `NULL` returns `4`. A group with `100` and `2.5` returns `1`.
