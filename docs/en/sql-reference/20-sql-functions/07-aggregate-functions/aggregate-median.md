---
title: MEDIAN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.959"/>

Aggregate function.

The MEDIAN() function computes the median of a numeric data sequence.

:::caution
NULL values are not counted.
:::

## Syntax

```sql
MEDIAN(<expr>)
```

## Arguments

| Arguments | Description              |
|-----------|--------------------------|                                                                                                                 
| `<expr>`  | Any numerical expression |                                                                                                     

## Return Type

For integer or floating-point inputs, the result is nullable Float64. For `DECIMAL(P, S)` input, the result is nullable `DECIMAL(P, S)`.

MEDIAN uses the same calculation as `QUANTILE_CONT(0.5)`. Decimal interpolation rounds to the input scale, with halfway values rounded away from zero. See [Decimal Interpolation](aggregate-quantile-cont.md#decimal-interpolation) for examples and the distinction between decimal data and floating-point quantile positions.

## Example

**Create a Table and Insert Sample Data**
```sql
CREATE TABLE exam_scores (
  id INT,
  student_id INT,
  score INT
);

INSERT INTO exam_scores (id, student_id, score)
VALUES (1, 1, 80),
       (2, 2, 90),
       (3, 3, 75),
       (4, 4, 95),
       (5, 5, 85);
```

**Query Demo: Calculate Median Exam Score**
```sql
SELECT MEDIAN(score) AS median_score
FROM exam_scores;
```

**Result**
```sql
|  median_score  |
|----------------|
|      85.0      |
```