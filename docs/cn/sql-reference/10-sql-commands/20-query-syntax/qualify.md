---
title: QUALIFY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.262"/>

QUALIFY 是一个用于过滤窗口函数结果的子句。因此，要成功使用 QUALIFY 子句，SELECT 列表或 QUALIFY 子句中必须至少有一个窗口函数（参见每个案例的[示例](#examples)）。换句话说，QUALIFY 是在窗口函数计算之后进行评估的。以下是包含 QUALIFY 子句的查询的典型执行顺序：

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

此示例演示了使用 ROW_NUMBER() 为部门内的员工分配顺序编号，按降序排列工资。利用 QUALIFY 子句，我们过滤结果以仅显示每个部门的最高收入者。

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

-- 选择员工详细信息，并按部门分区，按工资降序排列的行号。
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

-- 选择员工详细信息，并按部门分区，按工资降序排列的行号。
-- 添加过滤器，仅包括行号为 1 的行，选择每个部门中工资最高的员工。
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

-- Databend 允许在 QUALIFY 子句中直接使用窗口函数，而无需在 SELECT 列表中显式命名它们。

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