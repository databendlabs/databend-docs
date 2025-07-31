---
title: FIRST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Returns the first value in the window frame.

See also:

- [LAST_VALUE](last-value.md)
- [NTH_VALUE](nth-value.md)

## Syntax

```sql
FIRST_VALUE(expression)
OVER (
    [ PARTITION BY partition_expression ]
    ORDER BY sort_expression [ ASC | DESC ]
    [ window_frame ]
)
```

**Arguments:**
- `expression`: Required. The column or expression to return the first value from
- `PARTITION BY`: Optional. Divides rows into partitions
- `ORDER BY`: Required. Determines the ordering within the window
- `window_frame`: Optional. Defines the window frame (default: RANGE UNBOUNDED PRECEDING)

**Notes:**
- Returns the first value in the ordered window frame
- Supports `IGNORE NULLS` and `RESPECT NULLS` options
- Useful for finding the earliest/lowest value in each group

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

**Get the highest score (first value when ordered by score DESC):**

```sql
SELECT student, score,
       FIRST_VALUE(score) OVER (ORDER BY score DESC) AS highest_score,
       FIRST_VALUE(student) OVER (ORDER BY score DESC) AS top_student
FROM scores
ORDER BY score DESC;
```

Result:
```
student | score | highest_score | top_student
--------+-------+---------------+------------
Alice   |    95 |            95 | Alice
Eve     |    92 |            95 | Alice
Bob     |    87 |            95 | Alice
Charlie |    82 |            95 | Alice
David   |    78 |            95 | Alice
```