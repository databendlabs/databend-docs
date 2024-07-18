---
title: NTH_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.1.50"/>

返回有序值组中的第N个值。

另请参阅:

- [FIRST_VALUE](first-value.md)
- [LAST_VALUE](last-value.md)

## 语法

```sql
NTH_VALUE(expression, n) OVER ([PARTITION BY partition_expression] ORDER BY order_expression [window_frame])
```

关于窗口框架的语法，请参见 [窗口框架语法](index.md#窗口框架语法)。

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

-- 使用 NTH_VALUE 获取薪水第二高的员工的姓名
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