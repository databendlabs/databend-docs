---
title: DENSE_RANK
---

返回一组值中某个值的排名，且排名之间没有间隔。

排名值从1开始，依次递增。

如果两个值相同，则它们具有相同的排名。

## 语法

```sql
DENSE_RANK() OVER ( [ PARTITION BY <expr1> ] ORDER BY <expr2> [ ASC | DESC ] [ <window_frame> ] )
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

**使用 DENSE_RANK 计算每个部门的总工资**

```sql
SELECT
    department,
    SUM(salary) AS total_salary,
    DENSE_RANK() OVER (ORDER BY SUM(salary) DESC) AS dense_rank
FROM
    employees
GROUP BY
    department;
```

结果：

| department | total_salary | dense_rank |
|------------|--------------|------------|
| IT         | 172000       | 1          |
| HR         | 160000       | 2          |
| Sales      | 77000        | 3          |