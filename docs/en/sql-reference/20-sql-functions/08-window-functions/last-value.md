---
title: LAST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.2.568"/>

When `IGNORE NULLS` is used with LAST_VALUE, the function returns the last value in the frame that is not NULL (or NULL if all values are NULL). If not specified, the default is RESPECT NULLS.

See also:

- [FIRST_VALUE](first-value.md)
- [NTH_VALUE](nth-value.md)

## Syntax

```sql
LAST_VALUE(expression) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

For the syntax of window frame, see [Window Frame Syntax](index.md#window-frame-syntax).

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

-- Use LAST_VALUE to retrieve the first name of the employee with the lowest salary
SELECT employee_id, first_name, last_name, salary,
       LAST_VALUE(first_name) OVER (ORDER BY salary DESC) AS lowest_salary_first_name
FROM employees;

employee_id | first_name | last_name | salary  | lowest_salary_first_name
------------+------------+-----------+---------+------------------------
4           | Mary       | Williams  | 7000.00 | Michael
2           | Jane       | Smith     | 6000.00 | Michael
3           | David      | Johnson   | 5500.00 | Michael
1           | John       | Doe       | 5000.00 | Michael
5           | Michael    | Brown     | 4500.00 | Michael
```

### Returning NON-NULLs with IGNORE NULLS

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
  LAST_VALUE (order_id) IGNORE NULLS over (
    PARTITION BY user_id
    ORDER BY
      id ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
  ) AS last_order_id
FROM
  example

┌───────────────────────────────────────────────────────┐
│   id  │ user_id │     order_id     │   last_order_id  │
├───────┼─────────┼──────────────────┼──────────────────┤
│     0 │       1 │              614 │             NULL │
│     1 │       1 │             NULL │              614 │
│     2 │       1 │             NULL │              614 │
│     3 │       1 │              639 │              614 │
│     4 │       1 │             2027 │              639 │
└───────────────────────────────────────────────────────┘

```
