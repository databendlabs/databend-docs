---
title: PERCENT_RANK
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.780"/>

Returns the relative rank of a given value within a set of values. The resulting value falls between 0 and 1, inclusive. Please note that the first row in any set has a PERCENT_RANK of 0.

See also: [CUME_DIST](cume-dist.md)

## Syntax

```sql
PERCENT_RANK() OVER (
	PARTITION BY expr, ...
	ORDER BY expr [ASC | DESC], ...
)
```

## Examples

```sql
-- Create sample data
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 85),
    ('Bob', 92),
    ('Carol', 78),
    ('David', 95),
    ('Eve', 88);

-- PERCENT_RANK example
SELECT 
    student,
    score,
    PERCENT_RANK() OVER (ORDER BY score) AS percent_rank,
    ROUND(PERCENT_RANK() OVER (ORDER BY score) * 100, 1) AS percentile
FROM scores
ORDER BY score;
```

Result:

```
student|score|percent_rank|percentile|
-------+-----+------------+----------+
Carol  |   78|         0.0|       0.0|
Alice  |   85|        0.25|      25.0|
Eve    |   88|         0.5|      50.0|
Bob    |   92|        0.75|      75.0|
David  |   95|         1.0|     100.0|
```
