---
title: 在加载时转换数据
---

Databend 提供了一个强大的功能，允许在使用 [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table) 命令加载过程中进行数据转换，语法如下：

```sql
COPY INTO [<database>.]<table_name> [ ( <col_name> [ , <col_name> ... ] ) ]
     FROM ( SELECT [<file_col> ... ]
            FROM { userStage | internalStage | externalStage } )
[ FILES = ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | XML } [ formatTypeOptions ]
       ) ]
[ copyOptions ]
```

这个功能通过整合基本转换，简化了您的 ETL 管道，无需临时表。通过在加载过程中转换数据，您可以有效地简化 ETL 流程。以下是利用此功能增强数据加载的实用方法：

- **加载数据列的子集**：允许您从数据集中选择性地导入特定列，专注于与您的分析或应用程序相关的数据。

- **在加载时重新排序列**：允许您在加载数据时更改列的顺序，确保为了更好的数据组织或符合特定要求而获得所需的列排列。

- **在加载时转换数据类型**：提供在数据加载过程中转换某些列的数据类型的能力，允许您确保与所需数据格式或分析技术的一致性和兼容性。

- **在加载时执行算术运算**：允许您在数据加载时对特定列执行数学计算和操作，便于进行高级数据转换或生成新的派生数据。

- **将数据加载到包含额外列的表中**：允许您将数据加载到已包含额外列的表中，适应现有结构的同时，高效地映射并插入数据到相应的列中。

## 教程

本节提供了几个简短的教程，提供了如何在加载时转换数据的实用指导。每个教程将通过两种方式引导您完成数据加载过程：直接从远程文件加载和从暂存文件加载。请注意，这些教程彼此独立，您不需要按顺序完成它们。根据您的需求随意跟随。

### 开始之前

在开始之前，您需要创建一个阶段并生成一个示例文件；这里有一个 Parquet 文件作为示例：

```sql
CREATE STAGE my_parquet_stage;
COPY INTO @my_parquet_stage 
FROM (
    SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS id, -- 生成一个顺序 id
           'Name_' || CAST(number AS VARCHAR) AS name,       -- 为每行生成一个唯一名称
           20 + MOD(number, 23) AS age,                      -- 生成 20 到 42 之间的年龄
           DATE_ADD('day', MOD(number, 60), '2022-01-01') AS onboarded -- 从 2022-01-01 开始生成 onboarded 日期
    FROM numbers(10) -- 生成 10 行
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

在本教程中，您将创建一个比示例文件列数少的表，然后用从示例文件中提取的相应数据填充它。

1. 创建一个没有 'age' 列的表。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 从暂存的示例文件中加载数据，除了 'age' 列。

```
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

### 教程 2 - 在加载时重新排序列



在本教程中，您将创建一个表，该表具有与示例文件相同的列，但顺序不同，然后用从示例文件中提取的相应数据填充它。

1. 创建一个表，其中 'name' 和 'age' 列的顺序被交换。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 以新的顺序从阶段性示例文件中加载数据。

```sql
-- 从阶段性文件加载
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

### 教程 3 - 在加载过程中转换数据类型

在本教程中，您将创建一个表，该表具有与示例文件相同的列，除了一个将具有不同的数据类型，然后用从示例文件中提取并转换的数据填充它。

1. 创建一个表，其中 'onboarded' 列的类型为 Date。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);
```

2. 从阶段性示例文件中加载数据，并将 'onboarded' 列转换为 Date 类型。

```sql
-- 从阶段性文件加载
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

在本教程中，您将创建一个与样本文件中的列完全相同的表。然后，您将从样本文件中提取和转换数据，对提取的数据执行算术运算，并用结果填充表格。

1. 创建一个包含与样本文件完全相同列的表：

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);
```

2. 从暂存的样本文件中加载数据，并在插入目标表之前对 'age' 列执行算术运算以将其值增加 1。

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

在本教程中，您将创建一个与样本文件相比包含额外列的新表。然后，您将从样本文件中提取数据，并最终用转换后的数据填充新表。

1. 创建一个包含比样本文件更多列的表：

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);
```

2. 从暂存的样本文件中加载数据：

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