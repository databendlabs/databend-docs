---
title: 在加载时转换数据
---

Databend 的 `COPY INTO` 命令允许在加载过程中进行数据转换。通过整合基础转换，这可以简化你的 ETL Pipeline（ETL 流水线），无需使用临时表。

有关语法，请参见[查询与转换](./index.md)。

你可以执行的关键转换包括：

-   **加载部分数据列**：选择性地导入特定列。
-   **重排列表**：在加载过程中更改列的顺序。
-   **转换数据类型**：确保一致性和兼容性。
-   **执行算术运算**：生成新的派生数据。
-   **将数据加载到包含额外列的表中**：将数据映射并插入到现有结构中。

## 教程

这些教程演示了在加载过程中进行数据转换。每个示例都展示了如何从一个暂存区（Stage）文件加载数据。

### 准备工作

创建一个暂存区（Stage）并生成一个示例 Parquet 文件：

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id,
           'Name_' || CAST(number AS VARCHAR) AS name,
           20 + MOD(number, 23) AS age,
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded
    FROM numbers(10)
)
FILE_FORMAT = (TYPE = PARQUET);
```

查询暂存区（Stage）中的示例文件：

```sql
SELECT * FROM @my_parquet_stage;
```

结果：

```
┌───────────────────────────────────────┐
│   id   │  name  │   age  │  onboarded │
├────────┼────────┼────────┼────────────┤
│      1 │ Name_0 │     20 │ 2022-01-01 │
│      2 │ Name_5 │     25 │ 2022-01-06 │
│      3 │ Name_1 │     21 │ 2022-01-02 │
│      4 │ Name_6 │     26 │ 2022-01-07 │
│      5 │ Name_7 │     27 │ 2022-01-08 │
│      6 │ Name_2 │     22 │ 2022-01-03 │
│      7 │ Name_8 │     28 │ 2022-01-09 │
│      8 │ Name_3 │     23 │ 2022-01-04 │
│      9 │ Name_4 │     24 │ 2022-01-05 │
│     10 │ Name_9 │     29 │ 2022-01-10 │
└───────────────────────────────────────┘
```

### 教程 1 - 加载部分数据列

将数据加载到一个比源文件列数少的表中（例如，排除 'age' 列）。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);

COPY INTO employees_no_age
FROM (
    SELECT t.id,
           t.name,
           t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_no_age;
```

结果（前 3 行）：

```
┌──────────────────────────────────────────────────────────┐
│        id       │       name       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────────┤
│               1 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │ 2022-01-02 00:00:00 │
└──────────────────────────────────────────────────────────┘
```

### 教程 2 - 在加载过程中重排列表

将数据加载到一个列顺序不同的表中（例如，'age' 在 'name' 之前）。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);

COPY INTO employees_new_order
FROM (
    SELECT
        t.id,
        t.age,
        t.name,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_new_order;
```
结果（前 3 行）：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       age       │       name       │      onboarded      │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────┤
│               1 │              20 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │              25 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │              21 │ Name_1           │ 2022-01-02 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 3 - 在加载过程中转换数据类型

加载数据并转换列的数据类型（例如，将 'onboarded' 转换为 `DATE`）。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);

COPY INTO employees_date
FROM (
    SELECT
        t.id,
        t.name,
        t.age,
        to_date(t.onboarded)
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_date;
```
结果（前 3 行）：

```
┌───────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │    onboarded   │
├─────────────────┼──────────────────┼─────────────────┼────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01     │
│               2 │ Name_5           │              25 │ 2022-01-06     │
│               3 │ Name_1           │              21 │ 2022-01-02     │
└───────────────────────────────────────────────────────────────────────┘
```

### 教程 4 - 在加载过程中执行算术运算

加载数据并执行算术运算（例如，将 'age' 加 1）。

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);

COPY INTO employees_new_age
FROM (
    SELECT
        t.id,
        t.name,
        t.age + 1,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_new_age;
```
结果（前 3 行）：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┤
│               1 │ Name_0           │              21 │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │              26 │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │              22 │ 2022-01-02 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 5 - 加载到包含额外列的表中

将数据加载到一个比源文件列数多的表中。

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);

COPY INTO employees_plus (id, name, age, onboarded)
FROM (
    SELECT
        t.id,
        t.name,
        t.age,
        t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

SELECT * FROM employees_plus;
```
结果（前 3 行）：

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │       lastday       │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┼─────────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01 00:00:00 │ NULL                │
│               2 │ Name_5           │              25 │ 2022-01-06 00:00:00 │ NULL                │
│               3 │ Name_1           │              21 │ 2022-01-02 00:00:00 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```