---
title: FIRST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.50"/>

Returns the first value from an ordered group of values.

See also:

- [LAST_VALUE](last-value.md)
- [NTH_VALUE](nth-value.md)

## Syntax

```sql
FIRST_VALUE(expression) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

For the syntax of window frame, see [Window Frame Syntax](index.md#window-frame-syntax).

## Usage notes¶

When this option is used with FIRST_VALUE, the function returns the first value in the frame that is not NULL (or NULL if all values are NULL).

If { IGNORE | RESPECT } NULLS is not specified, the default is RESPECT NULLS.

## Examples

```sql
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  salary DECIMAL(10,2)
);

INSERT INTO employees (employee_id, first_name, last_name, salary)
VALUES
  (1, 'John', 'Doe', 5000.00),
  (2, 'Jane', 'Smith', 6000.00),
  (3, 'David', 'Johnson', 5500.00),
  (4, 'Mary', 'Williams', 7000.00),
  (5, 'Michael', 'Brown', 4500.00);

-- Use FIRST_VALUE to retrieve the first name of the employee with the highest salary
SELECT employee_id, first_name, last_name, salary,
       FIRST_VALUE(first_name) OVER (ORDER BY salary DESC) AS highest_salary_first_name
FROM employees;


employee_id | first_name | last_name | salary  | highest_salary_first_name
------------+------------+-----------+---------+--------------------------
4           | Mary       | Williams  | 7000.00 | Mary
2           | Jane       | Smith     | 6000.00 | Mary
3           | David      | Johnson   | 5500.00 | Mary
1           | John       | Doe       | 5000.00 | Mary
5           | Michael    | Brown     | 4500.00 | Mary

```

**IGNORE NULLS**

```sql
CREATE or replace TABLE example AS SELECT * FROM (VALUES
	(0, 1, 614),
	(1, 1, null),
	(2, 1, null),
	(3, 1, 639),
	(4, 1, 2027)
) tbl(id, user_id, order_id);


SELECT
  id,
  user_id,
  order_id,
  FIRST_VALUE (order_id) IGNORE nulls over (
    PARTITION BY user_id
    ORDER BY
      id ROWS BETWEEN 1 PRECEDING AND UNBOUNDED FOLLOWING
  ) AS last_order_id
FROM
  example

┌───────────────────────────────────────────────────────┐
│   id  │ user_id │     order_id     │   last_order_id  │
├───────┼─────────┼──────────────────┼──────────────────┤
│     0 │       1 │              614 │              614 │
│     1 │       1 │             NULL │              614 │
│     2 │       1 │             NULL │              639 │
│     3 │       1 │              639 │              639 │
│     4 │       1 │             2027 │              639 │
└───────────────────────────────────────────────────────┘

```
