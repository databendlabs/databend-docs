---
title: RANK
---

RANK() 函数为有序值组中的每个值分配一个唯一的排名。

排名值从 1 开始，并按顺序继续。如果两个值相同，则它们具有相同的排名。

## 语法

```sql
RANK() OVER (
  [ PARTITION BY <expr1> ]
  ORDER BY <expr2> [ { ASC | DESC } ]
  [ <window_frame> ]
)
```

## 示例

**创建表**
```sql
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);
```

**插入数据**
```sql
INSERT INTO employees (employee_id, first_name, last_name, department, salary) VALUES
  (1, 'John', 'Doe', 'IT', 90000),
  (2, 'Jane', 'Smith', 'HR', 85000),
  (3, 'Mike', 'Johnson', 'IT', 82000),
  (4, 'Sara', 'Williams', 'Sales', 77000),
  (5, 'Tom', 'Brown', 'HR', 75000);
```

**按薪资对员工进行排名**
```sql
SELECT
  employee_id,
  first_name,
  last_name,
  department,
  salary,
  RANK() OVER (ORDER BY salary DESC) AS rank
FROM
  employees;
```

结果：

| employee_id | first_name | last_name | department | salary | rank |
|-------------|------------|-----------|------------|--------|------|
| 1           | John       | Doe       | IT         | 90000  | 1    |
| 2           | Jane       | Smith     | HR         | 85000  | 2    |
| 3           | Mike       | Johnson   | IT         | 82000  | 3    |
| 4           | Sara       | Williams  | Sales      | 77000  | 4    |
| 5           | Tom        | Brown     | HR         | 75000  | 5    |