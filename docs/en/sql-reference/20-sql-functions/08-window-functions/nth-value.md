---
title: NTH_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Returns the value at the specified position (N) within the window frame.

See also:

- [FIRST_VALUE](first-value.md)
- [LAST_VALUE](last-value.md)

## Syntax

```sql
NTH_VALUE(
    expression, 
    n
) 
[ { IGNORE | RESPECT } NULLS ] 
OVER (
    [ PARTITION BY partition_expression ] 
    ORDER BY order_expression 
    [ window_frame ]
)
```

**Arguments:**
- `expression`: The column or expression to evaluate
- `n`: Position number (1-based index) of the value to return
- `IGNORE NULLS`: Optional. When specified, NULL values are skipped when counting positions
- `RESPECT NULLS`: Default behavior. NULL values are included when counting positions

**Notes:**
- Position counting starts from 1 (not 0)
- Returns NULL if the specified position doesn't exist in the window frame
- For window frame syntax, see [Window Frame Syntax](index.md#window-frame-syntax)

## Examples

```sql
-- Create sample data
CREATE TABLE scores (
    student VARCHAR(20),
    score INT
);

INSERT INTO scores VALUES
    ('Alice', 85),
    ('Bob', 90),
    ('Charlie', 78),
    ('David', 92),
    ('Eve', 88);
```

**Get the 2nd highest score student:**

```sql
SELECT student, score,
       NTH_VALUE(student, 2) OVER (ORDER BY score DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second_highest_student
FROM scores;
```

Result:
```
student  | score | second_highest_student
---------+-------+-----------------------
David    |    92 | Bob
Bob      |    90 | Bob
Eve      |    88 | Bob
Alice    |    85 | Bob
Charlie  |    78 | Bob
```

**Get the 3rd highest score student:**

```sql
SELECT student, score,
       NTH_VALUE(student, 3) OVER (ORDER BY score DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS third_highest_student
FROM scores;
```

Result:
```
student  | score | third_highest_student
---------+-------+----------------------
David    |    92 | Eve
Bob      |    90 | Eve
Eve      |    88 | Eve
Alice    |    85 | Eve
Charlie  |    78 | Eve
```