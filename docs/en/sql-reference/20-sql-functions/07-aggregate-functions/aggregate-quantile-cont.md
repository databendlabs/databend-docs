---
title: QUANTILE_CONT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.959"/>

Aggregate function.

The QUANTILE_CONT() function computes the interpolated quantile number of a numeric data sequence.

:::caution
NULL values are not counted.
:::

## Syntax

```sql
QUANTILE_CONT(<levels>)(<expr>)
    
QUANTILE_CONT(level1, level2, ...)(<expr>)
```

## Arguments

| Arguments   | Description                                                                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| `<level(s)` | level(s) of quantile. Each level is constant floating-point number from 0 to 1. We recommend using a level value in the range of [0.01, 0.99]   |
| `<expr>`    | Any numerical expression                                                                                                                        |

## Return Type

| Input type | One level | Multiple levels |
|------------|-----------|-----------------|
| Integer or floating-point | Float64 | Array(Float64) |
| DECIMAL(P, S) | DECIMAL(P, S) | Array(DECIMAL(P, S)) |

The aggregate result is nullable.

## Decimal Interpolation

For DECIMAL inputs, interpolation uses decimal coefficients instead of converting the data values to Float64. It rounds the final interpolated value to the input scale. Halfway values round away from zero. The `numeric_cast_option` setting does not change this rule.

Quantile levels and the fractional interpolation position still use floating-point values. They are not arbitrary-precision decimals. The data's decimal precision and scale are retained in the result.

[MEDIAN](aggregate-median.md) uses the same interpolation rules as `QUANTILE_CONT(0.5)`.

```sql
SELECT
    QUANTILE_CONT(0.5)(v::DECIMAL(10, 0)),
    MEDIAN(v::DECIMAL(10, 0))
FROM (VALUES (-1), (-2), (-3), (-4)) AS t(v);
-- Expected values: -3, -3

SELECT QUANTILE_CONT(0.0, 0.5, 1.0)(v::DECIMAL(10, 2))
FROM (VALUES (1), (2), (3), (4)) AS t(v);
-- Expected array: [1.00, 2.50, 4.00]
```

The first query interpolates `-2.5`. The input scale is zero, so each result is `-3`, not `-2` or a Float64 value.

## Example

**Create a Table and Insert Sample Data**
```sql
CREATE TABLE sales_data (
  id INT,
  sales_person_id INT,
  sales_amount FLOAT
);

INSERT INTO sales_data (id, sales_person_id, sales_amount)
VALUES (1, 1, 5000),
       (2, 2, 5500),
       (3, 3, 6000),
       (4, 4, 6500),
       (5, 5, 7000);
```

**Query Demo: Calculate 50th Percentile (Median) of Sales Amount using Interpolation**
```sql
SELECT QUANTILE_CONT(0.5)(sales_amount) AS median_sales_amount
FROM sales_data;
```

**Result**
```sql
|  median_sales_amount  |
|-----------------------|
|        6000.0         |
```

