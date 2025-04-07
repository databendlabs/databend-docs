---
title: ROW_NUMBER
---

为结果集的分区中的每一行分配一个临时的序列号，从每个分区的第一行开始，编号为 1。

## 语法

```sql
ROW_NUMBER() 
  OVER ( [ PARTITION BY <expr1> [, <expr2> ... ] ]
  ORDER BY <expr3> [ , <expr4> ... ] [ { ASC | DESC } ] )
```

| 参数         | 是否必须 | 描述                                                                                               |
|--------------|-----------|----------------------------------------------------------------------------------------------------|
| ORDER BY     | 是        | 指定每个分区中行的顺序。                                                                           |
| ASC / DESC   | 否        | 指定每个分区内的排序顺序。ASC（升序）是默认设置。                                                     |
| QUALIFY      | 否        | 根据条件过滤行。                                                                                   |

## 示例

本示例演示如何使用 ROW_NUMBER() 为部门内的员工分配序列号，按工资降序排列。

```sql
-- 准备数据
CREATE TABLE employees (
  employee_id INT,
  first_name VARCHAR,
  last_name VARCHAR,
  department VARCHAR,
  salary INT
);

INSERT INTO employees (employee_id, first_name, last_name, department, salary) VALUES
  (1, 'John', 'Doe', 'IT', 90000),
  (2, 'Jane', 'Smith', 'HR', 85000),
  (3, 'Mike', 'Johnson', 'IT', 82000),
  (4, 'Sara', 'Williams', 'Sales', 77000),
  (5, 'Tom', 'Brown', 'HR', 75000);

-- 选择员工详细信息以及按部门分区并按工资降序排列的行号。
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num
FROM
    employees;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │    department    │      salary     │ row_num │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┼─────────┤
│               2 │ Jane             │ Smith            │ HR               │           85000 │       1 │
│               5 │ Tom              │ Brown            │ HR               │           75000 │       2 │
│               1 │ John             │ Doe              │ IT               │           90000 │       1 │
│               3 │ Mike             │ Johnson          │ IT               │           82000 │       2 │
│               4 │ Sara             │ Williams         │ Sales            │           77000 │       1 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘
```