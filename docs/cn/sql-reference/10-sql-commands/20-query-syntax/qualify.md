---
title: QUALIFY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新版本：v1.2.262"/>

QUALIFY 是一个用于过滤窗口函数结果的子句。因此，要成功使用 QUALIFY 子句，必须在 SELECT 列表或 QUALIFY 子句中至少有一个窗口函数（参见[示例](#examples)了解每种情况）。换句话说，QUALIFY 是在窗口函数计算之后进行评估的。以下是带有 QUALIFY 语句子句的查询的典型执行顺序：

1. FROM
2. WHERE
3. GROUP BY
4. HAVING
5. WINDOW FUNCTION
6. QUALIFY
7. DISTINCT
8. ORDER BY
9. LIMIT

## 语法

```sql
QUALIFY <predicate>
```

## 示例

此示例演示了如何使用 ROW_NUMBER() 为每个部门内的员工分配按工资降序排列的序号。利用 QUALIFY 子句，我们过滤结果以仅显示每个部门中工资最高的员工。

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

-- 选择员工详细信息，并按部门分区并按工资降序排列的行号。
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

-- 选择员工详细信息，并按部门分区并按工资降序排列的行号。
-- 添加一个过滤器，仅包含行号为 1 的行，选择每个部门中工资最高的员工。
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS row_num
FROM
    employees
QUALIFY row_num = 1;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │    department    │      salary     │ row_num │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┼─────────┤
│               2 │ Jane             │ Smith            │ HR               │           85000 │       1 │
│               1 │ John             │ Doe              │ IT               │           90000 │       1 │
│               4 │ Sara             │ Williams         │ Sales            │           77000 │       1 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────┘

-- Databend 允许直接在 QUALIFY 子句中使用窗口函数，而无需在 SELECT 列表中显式命名它们。

SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary
FROM
    employees
QUALIFY ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) = 1;

┌────────────────────────────────────────────────────────────────────────────────────────────┐
│   employee_id   │    first_name    │     last_name    │    department    │      salary     │
├─────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────┤
│               2 │ Jane             │ Smith            │ HR               │           85000 │
│               1 │ John             │ Doe              │ IT               │           90000 │
│               4 │ Sara             │ Williams         │ Sales            │           77000 │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```