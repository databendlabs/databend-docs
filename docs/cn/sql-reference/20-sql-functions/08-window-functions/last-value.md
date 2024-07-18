---
title: LAST_VALUE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本: v1.1.50"/>

返回有序值组中的最后一个值。

另请参阅:

- [FIRST_VALUE](first-value.md)
- [NTH_VALUE](nth-value.md)

## 语法

```sql
LAST_VALUE(表达式) OVER ([PARTITION BY 分区表达式] ORDER BY 排序表达式 [窗口框架])
```

有关窗口框架的语法，请参阅[窗口框架语法](index.md#窗口框架语法)。

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