---
title: 加载时数据转换
---

Databend 提供了一项强大的功能，允许在加载过程中使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令进行数据转换，其语法如下：

```sql
COPY INTO [<database_name>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<file_col> ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

- _COPY INTO 还支持其他语法选项。更多详情，请参阅 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)_。

此功能通过集成基本转换简化了 ETL 流程，无需临时表。通过在加载时转换数据，您可以有效地优化 ETL 过程。以下是使用此功能增强数据加载的几种实用方法：

- **加载数据集的子集列**：允许您有选择地从数据集中导入特定列，专注于与您的分析或应用相关的数据。
- **加载时重新排序列**：使您能够在加载数据时更改列的顺序，确保所需列的排列，以便更好地组织数据或满足特定要求。
- **加载时转换数据类型**：提供在数据加载过程中转换某些列数据类型的能力，允许您确保与所需数据格式或分析技术的兼容性和一致性。
- **加载时执行算术运算**：允许您在数据加载时对特定列执行数学计算和操作，促进高级数据转换或生成新的派生数据。
- **加载数据到具有额外列的表**：使您能够将数据加载到已包含额外列的表中，同时有效地映射和插入数据到相应的列，以适应现有结构。

## 教程

本节提供了几个简短的教程，为如何在加载数据时进行数据转换提供实用指导。每个教程都将引导您通过两种方式进行数据加载：直接从远程文件加载和从已暂存的文件加载。请注意，这些教程相互独立，您无需按顺序完成它们。根据您的需求自由跟随。

### 开始之前

在开始之前，您需要创建一个 Stage 并生成一个示例文件；这里以 Parquet 文件为例：

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, -- 生成顺序 id
           'Name_' || CAST(number AS VARCHAR) AS name,       -- 为每行生成唯一名称
           20 + MOD(number, 23) AS age,                      -- 生成年龄，范围在 20 到 42 之间
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded -- 从 2022-01-01 开始生成入职日期
    FROM numbers(10) -- 生成 10 行数据
)
FILE_FORMAT = (TYPE = PARQUET);
```

查询暂存的示例文件：

```
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

### 教程 1 - 加载数据列的子集

在本教程中，您将创建一个列数少于示例文件的表，然后从示例文件中提取相应数据填充该表。

1. 创建一个不包含 'age' 列的表。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 从暂存的示例文件中加载数据，排除 'age' 列。

```sql
-- 从暂存文件加载
COPY INTO employees_no_age
FROM (
    SELECT t.id,
           t.name,
           t.onboarded
    FROM @my_parquet_stage t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_no_age;
```

结果：

```
┌──────────────────────────────────────────────────────────┐
│        id       │       name       │      onboarded      │
├─────────────────┼──────────────────┼─────────────────────┤
│               1 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │ 2022-01-02 00:00:00 │
│               4 │ Name_6           │ 2022-01-07 00:00:00 │
│               5 │ Name_7           │ 2022-01-08 00:00:00 │
│               6 │ Name_2           │ 2022-01-03 00:00:00 │
│               7 │ Name_8           │ 2022-01-09 00:00:00 │
│               8 │ Name_3           │ 2022-01-04 00:00:00 │
│               9 │ Name_4           │ 2022-01-05 00:00:00 │
│              10 │ Name_9           │ 2022-01-10 00:00:00 │
└──────────────────────────────────────────────────────────┘
```

### 教程 2 - 加载时重新排序列

在本教程中，您将创建一个与示例文件具有相同列但顺序不同的表，然后从示例文件中提取相应数据填充该表。

1. 创建一个 'name' 和 'age' 列交换位置的表。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 从暂存的示例文件中按新顺序加载数据。

```sql
-- 从暂存文件加载
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
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_new_order;
```

结果：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       age       │       name       │      onboarded      │
├─────────────────┼─────────────────┼──────────────────┼─────────────────────┤
│               1 │              20 │ Name_0           │ 2022-01-01 00:00:00 │
│               2 │              25 │ Name_5           │ 2022-01-06 00:00:00 │
│               3 │              21 │ Name_1           │ 2022-01-02 00:00:00 │
│               4 │              26 │ Name_6           │ 2022-01-07 00:00:00 │
│               5 │              27 │ Name_7           │ 2022-01-08 00:00:00 │
│               6 │              22 │ Name_2           │ 2022-01-03 00:00:00 │
│               7 │              28 │ Name_8           │ 2022-01-09 00:00:00 │
│               8 │              23 │ Name_3           │ 2022-01-04 00:00:00 │
│               9 │              24 │ Name_4           │ 2022-01-05 00:00:00 │
│              10 │              29 │ Name_9           │ 2022-01-10 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 3 - 加载时转换数据类型

在本教程中，您将创建一个与示例文件具有相同列的表，但其中一列将具有不同的数据类型，然后从示例文件中提取并转换数据填充该表。

1. 创建一个 'onboarded' 列类型为 Date 的表。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);
```

2. 从暂存的示例文件中加载数据，并将 'onboarded' 列转换为 Date 类型。

```sql
-- 从暂存文件加载
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
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_date;
```

结果：

```
┌───────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │    onboarded   │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Date) │
├─────────────────┼──────────────────┼─────────────────┼────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01     │
│               2 │ Name_5           │              25 │ 2022-01-06     │
│               3 │ Name_1           │              21 │ 2022-01-02     │
│               4 │ Name_6           │              26 │ 2022-01-07     │
│               5 │ Name_7           │              27 │ 2022-01-08     │
│               6 │ Name_2           │              22 │ 2022-01-03     │
│               7 │ Name_8           │              28 │ 2022-01-09     │
│               8 │ Name_3           │              23 │ 2022-01-04     │
│               9 │ Name_4           │              24 │ 2022-01-05     │
│              10 │ Name_9           │              29 │ 2022-01-10     │
└───────────────────────────────────────────────────────────────────────┘
```

### 教程 4 - 在加载过程中执行算术运算

在本教程中，您将创建一个与示例文件具有相同列的表。然后，您将从示例文件中提取并转换数据，对提取的数据执行算术运算，并将结果填充到表中。

1. 创建一个与示例文件具有完全相同列的表：

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);
```

2. 从暂存的示例文件加载数据，并在将'age'列的值插入目标表之前，对其执行算术运算（加 1）：

```sql
-- 从暂存文件加载
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
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_new_age
```

结果：

```
┌────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Timestamp) │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┤
│               1 │ Name_0           │              21 │ 2022-01-01 00:00:00 │
│               2 │ Name_5           │              26 │ 2022-01-06 00:00:00 │
│               3 │ Name_1           │              22 │ 2022-01-02 00:00:00 │
│               4 │ Name_6           │              27 │ 2022-01-07 00:00:00 │
│               5 │ Name_7           │              28 │ 2022-01-08 00:00:00 │
│               6 │ Name_2           │              23 │ 2022-01-03 00:00:00 │
│               7 │ Name_8           │              29 │ 2022-01-09 00:00:00 │
│               8 │ Name_3           │              24 │ 2022-01-04 00:00:00 │
│               9 │ Name_4           │              25 │ 2022-01-05 00:00:00 │
│              10 │ Name_9           │              30 │ 2022-01-10 00:00:00 │
└────────────────────────────────────────────────────────────────────────────┘
```

### 教程 5 - 加载到具有额外列的表中

在本教程中，您将创建一个包含比示例文件更多列的新表。然后，您将从示例文件中提取数据，并将转换后的数据填充到新表中。

1. 创建一个包含比示例文件更多列的表：

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);
```

2. 从暂存的示例文件加载数据：

```sql
-- 从暂存文件加载
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
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_plus;
```

结果：

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│        id       │       name       │       age       │      onboarded      │       lastday       │
│ Nullable(Int32) │ Nullable(String) │ Nullable(Int32) │ Nullable(Timestamp) │ Nullable(Timestamp) │
├─────────────────┼──────────────────┼─────────────────┼─────────────────────┼─────────────────────┤
│               1 │ Name_0           │              20 │ 2022-01-01 00:00:00 │ NULL                │
│               2 │ Name_5           │              25 │ 2022-01-06 00:00:00 │ NULL                │
│               3 │ Name_1           │              21 │ 2022-01-02 00:00:00 │ NULL                │
│               4 │ Name_6           │              26 │ 2022-01-07 00:00:00 │ NULL                │
│               5 │ Name_7           │              27 │ 2022-01-08 00:00:00 │ NULL                │
│               6 │ Name_2           │              22 │ 2022-01-03 00:00:00 │ NULL                │
│               7 │ Name_8           │              28 │ 2022-01-09 00:00:00 │ NULL                │
│               8 │ Name_3           │              23 │ 2022-01-04 00:00:00 │ NULL                │
│               9 │ Name_4           │              24 │ 2022-01-05 00:00:00 │ NULL                │
│              10 │ Name_9           │              29 │ 2022-01-10 00:00:00 │ NULL                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```
