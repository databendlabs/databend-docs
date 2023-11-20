---
title: QUANTILE_TDIGEST_WEIGHTED
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.174"/>

Computes an approximate quantile of a numeric data sequence using the [t-digest](https://github.com/tdunning/t-digest/blob/master/docs/t-digest-paper/histo.pdf) algorithm.
This function takes into account the weight of each sequence member. Memory consumption is **log(n)**, where **n** is a number of values.

:::caution
NULL values are not included in the calculation.
:::

## Syntax

```sql
QUANTILE_TDIGEST_WEIGHTED(<level1>[, <level2>, ...])(<expr>, <weight_expr>)
```

## Arguments

| Arguments       | Description                                                                                                                                               |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<level n>`     | A level of quantile represents a constant floating-point number ranging from 0 to 1. It is recommended to use a level value in the range of [0.01, 0.99]. |
| `<expr>`        | Any numerical expression                                                                                                                                  |
| `<weight_expr>` | Any unsigned integer expression. Weight is a number of value occurrences.                                                                                 |

## Return Type

Returns either a Float64 value or an array of Float64 values, depending on the number of quantile levels specified.

## Example

```sql
-- Create a table and insert sample data
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

SELECT QUANTILE_TDIGEST_WEIGHTED(0.5)(sales_amount, 1) AS median_sales_amount
FROM sales_data;

median_sales_amount|
-------------------+
             6000.0|

SELECT QUANTILE_TDIGEST_WEIGHTED(0.5, 0.8)(sales_amount, 1)
FROM sales_data;

quantile_tdigest_weighted(0.5, 0.8)(sales_amount)|
-------------------------------------------------+
[6000.0,7000.0]                                  |
```