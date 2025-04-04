---
title: NTH_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Returns the value at the `N`-th position within the window frame, where `N` is a specified integer that determines the exact position of the value.

See also:

- [FIRST_VALUE](first-value.md)
- [LAST_VALUE](last-value.md)

## Syntax

```sql
NTH_VALUE (expression, n) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

- `[ { IGNORE | RESPECT } NULLS ]`: Controls how NULL values are handled within the window function. 
  - By default, `RESPECT NULLS` is used, meaning NULL values are included in the calculation and affect the result. 
  - When set to `IGNORE NULLS`, NULL values are excluded from consideration, and the function operates only on non-NULL values.
  - If all values in the window frame are NULL, the function returns NULL even when `IGNORE NULLS` is specified.

- For the syntax of window frame, see [Window Frame Syntax](index.md#window-frame-syntax).

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

-- Use NTH_VALUE to retrieve the first name of the employee with the second highest salary
SELECT employee_id, first_name, last_name, salary,
       NTH_VALUE(first_name, 2) OVER (ORDER BY salary DESC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS second_highest_salary_first_name
FROM employees;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │          salary          │ second_highest_salary_first_name │
├─────────────────┼──────────────────┼──────────────────┼──────────────────────────┼──────────────────────────────────┤
│               4 │ Mary             │ Williams         │ 7000.00                  │ Jane                             │
│               2 │ Jane             │ Smith            │ 6000.00                  │ Jane                             │
│               3 │ David            │ Johnson          │ 5500.00                  │ Jane                             │
│               1 │ John             │ Doe              │ 5000.00                  │ Jane                             │
│               5 │ Michael          │ Brown            │ 4500.00                  │ Jane                             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This example excludes the NULL values from the window frame with the `IGNORE NULLS` option:

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
  NTH_VALUE (order_id, 2) IGNORE NULLS over (
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
│     1 │       1 │             NULL │             NULL │
│     2 │       1 │             NULL │             NULL │
│     3 │       1 │              639 │             NULL │
│     4 │       1 │             2027 │              639 │
└───────────────────────────────────────────────────────┘
```