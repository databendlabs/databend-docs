---
title: NTH_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.2.568"/>

返回表达式在窗口框架的第 n 行（如果设置了 `IGNORE NULLS`，则在不包含空值的行中）计算的值；如果没有这样的行，则返回 NULL。

另请参阅：

- [FIRST_VALUE](first-value.md)
- [LAST_VALUE](last-value.md)

## 语法

```sql
NTH_VALUE(expression, n) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

有关窗口框架的语法，请参阅 [窗口框架语法](index.md#window-frame-语法)。

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

-- 使用 NTH_VALUE 检索工资第二高的员工的姓名
SELECT employee_id, first_name, last_name, salary,
       NTH_VALUE(first_name, 2) OVER (ORDER BY salary DESC) AS second_highest_salary_first_name
FROM employees;

employee_id | first_name | last_name | salary  | second_highest_salary_first_name
------------+------------+-----------+---------+----------------------------------
4           | Mary       | Williams  | 7000.00 | Jane
2           | Jane       | Smith     | 6000.00 | Jane
3           | David      | Johnson   | 5500.00 | Jane
1           | John       | Doe       | 5000.00 | Jane
5           | Michael    | Brown     | 4500.00 | Jane
```

### 使用 IGNORE NULLS 返回非空值

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