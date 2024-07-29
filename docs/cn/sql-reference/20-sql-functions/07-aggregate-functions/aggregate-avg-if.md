---
title: AVG_IF
---

## AVG_IF

后缀 -If 可以附加到任何聚合函数的名称上。在这种情况下，聚合函数接受一个额外的参数 —— 一个条件。

```sql
AVG_IF(<列>, <条件>)
```

## 示例

**创建表并插入示例数据**
```sql
CREATE TABLE employees (
  id INT,
  salary INT,
  department VARCHAR
);

INSERT INTO employees (id, salary, department)
VALUES (1, 50000, 'HR'),
       (2, 60000, 'IT'),
       (3, 55000, 'HR'),
       (4, 70000, 'IT'),
       (5, 65000, 'IT');
```

**查询示例：计算 IT 部门的平均工资**

```sql
SELECT AVG_IF(salary, department = 'IT') AS avg_salary_it
FROM employees;
```

**结果**
```sql
| avg_salary_it   |
|-----------------|
|     65000.0     |
```