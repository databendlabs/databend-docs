```
---
title: ROW_NUMBER
---

为结果集的每个分区中的每行分配一个临时的顺序号，从每个分区的第一行开始编号为1。

## 语法

```sql
ROW_NUMBER() 
  OVER ( [ PARTITION BY <expr1> [, <expr2> ... ] ]
  ORDER BY <expr3> [ , <expr4> ... ] [ { ASC | DESC } ] )
```

| 参数          | 是否必须? | 描述                                                                                      |
|--------------|-----------|------------------------------------------------------------------------------------------|
| ORDER BY     | 是        | 指定每个分区内行的顺序。                                                                   |
| ASC / DESC   | 否        | 指定每个分区内的排序顺序。ASC（升序）是默认值。                                             |
| QUALIFY      | 否        | 基于条件过滤行。                                                                            |

## 示例

此示例演示了如何使用ROW_NUMBER()为部门内的员工分配顺序号，按薪水降序排列。

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

-- 选择员工详细信息，连同按部门分区并按薪水降序排列的行号。
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