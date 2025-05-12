---
title: REPLACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.55"/>

REPLACE INTO 可以将多个新行插入到表中，或者在这些行已存在时更新现有行，使用以下数据源：

- 直接值

- 查询结果

- Staged files: Databend 允许您使用 REPLACE INTO 语句将数据从 staged files 替换到表中。这是通过 Databend 的 [Query Staged Files](/guides/load-data/transform/querying-stage) 能力实现的，随后将查询结果合并到表中。

:::tip atomic operations
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

## Syntax

```sql
REPLACE INTO <table_name> [ ( <col_name> [ , ... ] ) ]
    ON (<CONFLICT KEY>) ...
```

当在表中找到指定的冲突键时，REPLACE INTO 会更新现有行；如果冲突键不存在，则插入新行。冲突键是表中唯一标识行的列或列的组合，用于确定是插入新行还是使用 REPLACE INTO 语句更新表中的现有行。请参见以下示例：

```sql
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(100),
    employee_salary DECIMAL(10, 2),
    employee_email VARCHAR(255)
);

-- 此 REPLACE INTO 插入新行
REPLACE INTO employees (employee_id, employee_name, employee_salary, employee_email) 
ON (employee_email)
VALUES (123, 'John Doe', 50000, 'john.doe@example.com');

-- 此 REPLACE INTO 更新插入的行
REPLACE INTO employees (employee_id, employee_name, employee_salary, employee_email) 
ON (employee_email)
VALUES (123, 'John Doe', 60000, 'john.doe@example.com');
```

## Distributed REPLACE INTO

`REPLACE INTO` 支持在集群环境中进行分布式执行。您可以通过将 ENABLE_DISTRIBUTED_REPLACE_INTO 设置为 1 来启用分布式 REPLACE INTO。这有助于提高集群环境中的数据加载性能和可伸缩性。

```sql
SET enable_distributed_replace_into = 1;
```

## Examples

### Example 1: Replace with Direct Values

此示例使用直接值替换数据：

```sql
CREATE TABLE employees(id INT, name VARCHAR, salary INT);

REPLACE INTO employees (id, name, salary) ON (id)
VALUES (1, 'John Doe', 50000);

SELECT  * FROM Employees;
+------+----------+--------+
| id   | name     | salary |
+------+----------+--------+
| 1    | John Doe |  50000 |
+------+----------+--------+
```

### Example 2: Replace with Query Results

此示例使用查询结果替换数据：

```sql
CREATE TABLE employees(id INT, name VARCHAR, salary INT);

CREATE TABLE temp_employees(id INT, name VARCHAR, salary INT);

INSERT INTO temp_employees (id, name, salary) VALUES (1, 'John Doe', 60000);

REPLACE INTO employees (id, name, salary) ON (id)
SELECT id, name, salary FROM temp_employees WHERE id = 1;

SELECT  * FROM Employees;
+------+----------+--------+
| id   | name     | salary |
+------+----------+--------+
|    1 | John Doe |  60000 |
+------+----------+--------+
```

### Example 3: Replace with Staged Files

此示例演示如何使用 staged file 中的数据替换表中现有的数据。

1. 创建一个名为 `sample` 的表

```sql
CREATE TABLE sample
(
    id      INT,
    city    VARCHAR,
    score   INT,
    country VARCHAR DEFAULT 'China'
);

INSERT INTO sample
    (id, city, score)
VALUES
    (1, 'Chengdu', 66);
```

2. 使用示例数据设置一个内部 Stage

首先，我们创建一个名为 `mystage` 的 Stage。然后，我们将示例数据加载到此 Stage 中。
```sql
CREATE STAGE mystage;
       
COPY INTO @mystage
FROM 
(
    SELECT * 
    FROM 
    (
        VALUES 
        (1, 'Chengdu', 80),
        (3, 'Chongqing', 90),
        (6, 'Hangzhou', 92),
        (9, 'Hong Kong', 88)
    )
)
FILE_FORMAT = (TYPE = PARQUET);
```

3. 使用带有 `REPLACE INTO` 的 staged Parquet 文件替换现有数据

:::tip
您可以使用 [COPY INTO](dml-copy-into-table.md) 命令中提供的 FILE_FORMAT 和 COPY_OPTIONS 指定文件格式和各种与复制相关的设置。
:::

```sql
REPLACE INTO sample 
    (id, city, score) 
ON
    (Id)
SELECT
    $1, $2, $3
FROM
    @mystage
    (FILE_FORMAT => 'parquet');
```

4. 验证数据替换

现在，我们可以查询 sample 表以查看更改：
```sql
SELECT * FROM sample;
```

结果应为：
```sql
┌─────────────────────────────────────────────────────────────────────────┐
│        id       │       city       │      score      │      country     │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(String) │
├─────────────────┼──────────────────┼─────────────────┼──────────────────┤
│               1 │ Chengdu          │              80 │ China            │
│               3 │ Chongqing        │              90 │ China            │
│               6 │ Hangzhou         │              92 │ China            │
│               9 │ Hong Kong        │              88 │ China            │
└─────────────────────────────────────────────────────────────────────────┘
```