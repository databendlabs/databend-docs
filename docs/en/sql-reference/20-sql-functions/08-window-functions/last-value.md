---
title: LAST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Returns the last value in the window frame.

See also:

- [FIRST_VALUE](first-value.md)
- [NTH_VALUE](nth-value.md)

## Syntax

```sql
LAST_VALUE(expression)
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
    [ window_frame ]
)
```

**Arguments:**
- `expression`: Required. The column or expression to return the last value from
- `PARTITION BY`: Optional. Divides rows into partitions
- `ORDER BY`: Required. Determines the ordering within the window
- `window_frame`: Optional. Defines the window frame (default: RANGE UNBOUNDED PRECEDING)

**Notes:**
- Returns the last value in the ordered window frame
- Supports `IGNORE NULLS` and `RESPECT NULLS` options
- Often requires explicit window frame to get expected results
- Useful for finding the latest/highest value in each group

## Examples

```sql
-- Create sample data
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 95),
    ('Bob', 87),
    ('Charlie', 82),
    ('David', 78),
    ('Eve', 92);
```

**Get the lowest score (last value when ordered by score DESC):**

```sql
SELECT student, score,
       LAST_VALUE(score) OVER (
           ORDER BY score DESC 
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS lowest_score,
       LAST_VALUE(student) OVER (
           ORDER BY score DESC 
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS lowest_student
FROM scores
ORDER BY score DESC;
```

Result:
```
student | score | lowest_score | lowest_student
--------+-------+--------------+---------------
Alice   |    95 |           78 | David
Eve     |    92 |           78 | David
Bob     |    87 |           78 | David
Charlie |    82 |           78 | David
David   |    78 |           78 | David
```