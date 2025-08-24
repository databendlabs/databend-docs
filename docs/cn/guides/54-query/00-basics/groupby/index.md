---
title: GROUP BY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.32"/>

`GROUP BY` 子句允许您根据相同的分组项表达式对行进行分组，然后对每个结果组应用聚合函数。分组项表达式可以包括列名或别名、`SELECT` 列表中位置的数字引用、通用表达式或 `SELECT` 列表中的所有非聚合项。

Databend 中的 `GROUP BY` 子句附带以下扩展，以实现更全面的数据分组和灵活的数据分析：

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

其中：

- **ALL**：当使用关键字 "ALL" 时，Databend 会根据 `SELECT` 列表中的所有非聚合项对数据进行分组。
- **groupItem**：分组项可以是以下之一：
    - 在 `SELECT` 列表中定义的列名或别名。
    - 对 `SELECT` 列表中列位置的数字引用。
    - 任何涉及当前查询上下文中使用的表的列的表达式。

## 示例

本节中的 `GROUP BY` 示例基于以下数据设置：

```sql
-- 创建一个名为 "employees" 的示例表
CREATE TABLE employees (
    id INT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department_id INT,
    job_id INT,
    hire_date DATE
);

-- 向 "employees" 表中插入示例数据
INSERT INTO employees (id, first_name, last_name, department_id, job_id, hire_date)
VALUES (1, 'John', 'Doe', 1, 101, '2021-01-15'),
       (2, 'Jane', 'Smith', 1, 101, '2021-02-20'),
       (3, 'Alice', 'Johnson', 1, 102, '2021-03-10'),
       (4, 'Bob', 'Brown', 2, 201, '2021-03-15'),
       (5, 'Charlie', 'Miller', 2, 202, '2021-04-10'),
       (6, 'Eve', 'Davis', 2, 202, '2021-04-15');
```

### 按单列分组

此查询按 `department_id` 对员工进行分组，并计算每个部门的员工人数：
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

### 按多列分组

此查询按 `department_id` 和 `job_id` 对员工进行分组，然后计算每个组中的员工人数：
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

### 按 ALL 分组

此查询使用 `GROUP BY ALL` 子句对员工进行分组，该子句会对 `SELECT` 列表中的所有非聚合列进行分组。请注意，在这种情况下，结果将与按 `department_id` 和 `job_id` 分组相同，因为它们是 `SELECT` 列表中唯一的非聚合项。

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


### 按位置分组

此查询等同于上面的 "按单列分组" 示例。位置 1 指的是 `SELECT` 列表中的第一项，即 `department_id`：
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

### 按表达式分组

此查询按员工被雇佣的年份进行分组，并计算每年雇佣的员工人数：
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