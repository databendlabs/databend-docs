---
title: FIRST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.2.568"/>

当使用 `IGNORE NULLS` 时，FIRST_VALUE 函数返回窗口框架中第一个非 NULL 的值（如果所有值均为 NULL，则返回 NULL）。如果未指定，默认行为是 `RESPECT NULLS`。

另请参阅：

- [LAST_VALUE](last-value.md)
- [NTH_VALUE](nth-value.md)

## 语法

```sql
FIRST_VALUE(expression) [ { IGNORE | RESPECT } NULLS ] OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
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

-- 使用 FIRST_VALUE 获取工资最高的员工的名字
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