---
title: 加载时转换数据
---

Databend 提供了一个强大的功能，可以在加载过程中使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令转换数据，其语法如下：

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

- *Copy INTO 也支持其他语法选项。有关更多详细信息，请参见 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table)*。

此功能通过合并基本转换来简化您的 ETL 管道，从而无需使用临时表。通过在加载期间转换数据，您可以有效地简化 ETL 流程。以下是使用此功能增强数据加载的实用方法：

- **加载数据列的子集**：允许您有选择地从数据集中导入特定列，从而专注于与您的分析或应用程序相关的数据。

- **在加载期间重新排序列**：使您能够在加载数据时更改列的顺序，从而确保所需的列排列，以实现更好的数据组织或与特定要求保持一致。

- **在加载期间转换数据类型**：提供在数据加载过程中转换某些列的数据类型的功能，从而使您可以确保与所需数据格式或分析技术的一致性和兼容性。

- **在加载期间执行算术运算**：允许您在加载数据时对特定列执行数学计算和运算，从而促进高级数据转换或生成新的派生数据。

- **将数据加载到具有附加列的表中**：使您可以将数据加载到已经包含附加列的表中，从而适应现有结构，同时有效地将数据映射和插入到相应的列中。

## 教程

本节提供了一些简短的教程，这些教程提供了有关如何在加载时转换数据的实用指导。每个教程都将引导您以两种方式完成数据加载过程：直接从远程文件加载和从暂存文件加载。请注意，这些教程彼此独立，您无需按顺序完成它们。您可以根据自己的需求随意进行操作。

### 准备工作

在开始之前，您需要创建一个 Stage 并生成一个示例文件；这是一个 Parquet 文件作为示例：

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage 
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, -- Generates a sequential id
           'Name_' || CAST(number AS VARCHAR) AS name,       -- Generates a unique name for each row
           20 + MOD(number, 23) AS age,                      -- Generates an age between 20 and 42
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded -- Generates onboarded dates starting from 2022-01-01
    FROM numbers(10) -- Generating 10 rows
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

在本教程中，您将创建一个列数少于示例文件的表，然后使用从示例文件中提取的相应数据填充该表。

1. 创建一个没有“age”列的表。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 加载暂存的示例文件中的数据，但“age”列除外。

```sql
-- Load from staged file
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

### 教程 2 - 在加载期间重新排序列

在本教程中，您将创建一个与示例文件具有相同列但顺序不同的表，然后使用从示例文件中提取的相应数据填充该表。

1. 创建一个交换了“name”和“age”列的表。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 以新顺序加载暂存的示例文件中的数据。

```sql
-- Load from staged file
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

### 教程 3 - 在加载期间转换数据类型

在本教程中，您将创建一个与示例文件具有相同列的表，但其中一列的数据类型不同，然后使用从示例文件中提取和转换的数据填充该表。

1. 创建一个“onboarded”列为 Date 类型的表。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);
```

2. 加载暂存的示例文件中的数据，并将“onboarded”列转换为 Date 类型。

```sql
-- Load from staged file
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

### Tutorial 4 - Performing Arithmetic Operations During Load

在本教程中，您将创建一个与示例文件具有相同列的表。然后，您将从示例文件中提取和转换数据，对提取的数据执行算术运算，并将结果填充到表中。

1. 创建一个包含与示例文件完全相同列的表：

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);
```

2. 从暂存的示例文件加载数据，并对 'age' 列执行算术运算，使其值递增 1，然后再将其插入到目标表中。

```sql
-- Load from staged file
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
Result:
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

### Tutorial 5 - Loading to a Table with Additional Columns

在本教程中，您将创建一个新表，该表包含比示例文件更多的列。然后，您将从示例文件中提取数据，最后使用转换后的数据填充新表。

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
-- Load from staged file
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

Result:
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