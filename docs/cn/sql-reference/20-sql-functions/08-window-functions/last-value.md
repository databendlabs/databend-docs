---
title: LAST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.2.568"/>

当使用 `IGNORE NULLS` 时，LAST_VALUE 函数返回窗口框架中最后一个非 NULL 值（如果所有值均为 NULL，则返回 NULL）。如果未指定，默认值为 RESPECT NULLS。

另请参阅：

- [FIRST_VALUE](first-value.md)
- [NTH_VALUE](nth-value.md)

## 语法

```sql
LAST_VALUE(expression) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

有关窗口框架的语法，请参阅 [窗口框架语法](index.md#window-frame-syntax)。

## 示例

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

-- 使用 LAST_VALUE 检索薪水最低的员工的 first_name
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

### 使用 IGNORE NULLS 返回非 NULL 值

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