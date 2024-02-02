---
title: REPLACE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.1.55"/>

REPLACE INTO 可以将多个新行插入到表中，或者如果这些行已经存在，则更新这些行，使用以下数据源：

- 直接值

- 查询结果

- 阶段文件：Databend 允许您使用 REPLACE INTO 语句从阶段文件中替换表中的数据。这是通过 Databend 的 [查询阶段文件](/guides/load-data/transform/querying-stage) 能力并随后将查询结果并入表中来实现的。

:::tip 原子操作
Databend 通过原子操作确保数据完整性。插入、更新、替换和删除要么完全成功，要么完全失败。
:::

## 语法

```sql
REPLACE INTO <table_name> [ ( <col_name> [ , ... ] ) ]
    ON (<CONFLICT KEY>) ...
```

当在表中找到指定的冲突键时，REPLACE INTO 更新现有行，如果没有找到冲突键，则插入新行。冲突键是表中的列或列的组合，用于唯一标识一行，并用于使用 REPLACE INTO 语句确定是插入新行还是更新表中的现有行。见下面的例子：

```sql
CREATE TABLE employees (
    employee_id INT,
    employee_name VARCHAR(100),
    employee_salary DECIMAL(10, 2),
    employee_email VARCHAR(255)
);

-- 此 REPLACE INTO 插入一个新行
REPLACE INTO employees (employee_id, employee_name, employee_salary, employee_email) 
ON (employee_email)
VALUES (123, 'John Doe', 50000, 'john.doe@example.com');

-- 此 REPLACE INTO 更新已插入的行
REPLACE INTO employees (employee_id, employee_name, employee_salary, employee_email) 
ON (employee_email)
VALUES (123, 'John Doe', 60000, 'john.doe@example.com');
```

## 分布式 REPLACE INTO

`REPLACE INTO` 支持在集群环境中的分布式执行。您可以通过将 ENABLE_DISTRIBUTED_REPLACE_INTO 设置为 1 来启用分布式 REPLACE INTO。这有助于在集群环境中提高数据加载性能和可扩展性。

```sql
SET enable_distributed_replace_into = 1;
```

## 示例

### 示例 1：使用直接值替换

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

### 示例 2：使用查询结果替换

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

### 示例 3：使用阶段文件替换

此示例演示如何使用阶段文件中的数据替换表中的现有数据。

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

2. 使用样本数据设置内部阶段

首先，我们创建一个名为 `mystage` 的阶段。然后，我们将样本数据加载到这个阶段中。
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

3. 使用 `REPLACE INTO` 和阶段的 Parquet 文件替换现有数据

:::tip
您可以使用 [COPY INTO](dml-copy-into-table.md) 命令中可用的 FILE_FORMAT 和 COPY_OPTIONS 指定文件格式和各种复制相关设置。当 `purge` 设置为 `true` 时，只有在数据更新成功时，原始文件才会被删除。
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

结果应该是：
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