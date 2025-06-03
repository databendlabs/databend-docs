---
title: GROUP BY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.32"/>

GROUP BY 子句用于根据相同的分组表达式对行进行分组，并对每个结果组应用聚合函数。分组表达式可包含列名或别名、SELECT 列表中位置的数值引用、通用表达式，或 SELECT 列表中的所有非聚合项。

Databend 的 GROUP BY 子句提供以下扩展功能，支持更全面的数据分组和灵活分析：

- [GROUP BY CUBE](group-by-cube.md)
- [GROUP BY GROUPING SETS](group-by-grouping-sets.md)
- [GROUP BY ROLLUP](group-by-rollup.md)

## 语法

```sql
SELECT ...
    FROM ...
    [ ... ]
GROUP BY [ ALL | groupItem [ , groupItem [ , ... ] ] ]
    [ ... ]
```

参数说明：

- **ALL**：使用该关键字时，Databend 会按 SELECT 列表中的所有非聚合项分组
- **groupItem**：分组项可为以下任意类型：
    - SELECT 列表中定义的列名或别名
    - SELECT 列表中列位置的数值引用
    - 涉及当前查询表列的任意表达式

## 示例

本节示例基于以下数据准备：

```sql
-- 创建示例表 "employees"
CREATE TABLE employees (
    id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT,
    job_id INT,
    hire_date DATE
);

-- 向 "employees" 表插入数据
INSERT INTO employees (id, first_name, last_name, department_id, job_id, hire_date)
VALUES (1, 'John', 'Doe', 1, 101, '2021-01-15'),
       (2, 'Jane', 'Smith', 1, 101, '2021-02-20'),
       (3, 'Alice', 'Johnson', 1, 102, '2021-03-10'),
       (4, 'Bob', 'Brown', 2, 201, '2021-03-15'),
       (5, 'Charlie', 'Miller', 2, 202, '2021-04-10'),
       (6, 'Eve', 'Davis', 2, 202, '2021-04-15');
```

### 单列分组

按 `department_id` 分组统计各部门员工数：
```sql
SELECT department_id, COUNT(*) AS num_employees
FROM employees
GROUP BY department_id;
```

输出：
```sql
+---------------+---------------+
| department_id | num_employees |
+---------------+---------------+
|             1 |             3 |
|             2 |             3 |
+---------------+---------------+
```

### 多列分组

按 `department_id` 和 `job_id` 分组统计各组合员工数：
```sql
SELECT department_id, job_id, COUNT(*) AS num_employees
FROM employees
GROUP BY department_id, job_id;
```

输出：
```sql
+---------------+--------+---------------+
| department_id | job_id | num_employees |
+---------------+--------+---------------+
|             1 |    101 |             2 |
|             1 |    102 |             1 |
|             2 |    201 |             1 |
|             2 |    202 |             2 |
+---------------+--------+---------------+
```

### ALL 分组

使用 GROUP BY ALL 按 SELECT 列表所有非聚合列分组：
```sql
SELECT department_id, job_id, COUNT(*) AS num_employees
FROM employees
GROUP BY ALL;
```

输出：
```sql
+---------------+--------+---------------+
| department_id | job_id | num_employees |
+---------------+--------+---------------+
|             1 |    101 |             2 |
|             1 |    102 |             1 |
|             2 |    201 |             1 |
|             2 |    202 |             2 |
+---------------+--------+---------------+
```

### 位置分组

按 SELECT 列表第 1 位（`department_id`）分组：
```sql
SELECT department_id, COUNT(*) AS num_employees
FROM employees
GROUP BY 1;
```

输出：
```sql
+---------------+---------------+
| department_id | num_employees |
+---------------+---------------+
|             1 |             3 |
|             2 |             3 |
+---------------+---------------+
```

### 表达式分组

按入职年份分组统计每年招聘人数：
```sql
SELECT EXTRACT(YEAR FROM hire_date) AS hire_year, COUNT(*) AS num_hires
FROM employees
GROUP BY EXTRACT(YEAR FROM hire_date);
```

输出：
```sql
+-----------+-----------+
| hire_year | num_hires |
+-----------+-----------+
|      2021 |         6 |
+-----------+-----------+
```