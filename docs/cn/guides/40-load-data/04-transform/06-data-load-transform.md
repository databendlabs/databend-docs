```markdown
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

这个功能简化了您的 ETL 管道，通过整合基本转换，消除了临时表的需要。通过在加载过程中转换数据，您可以有效地简化您的 ETL 流程。以下是使用此功能增强数据加载的实用方法：

- **加载数据列的子集**：允许您从数据集中选择性地导入特定列，专注于与您的分析或应用程序相关的数据。

- **在加载期间重新排序列**：使您能够在加载数据时更改列的顺序，确保所需的列排列以更好地组织数据或符合特定要求。

- **在加载期间转换数据类型**：在数据加载过程中提供转换某些列的数据类型的能力，使您能够确保与所需数据格式或分析技术的一致性和兼容性。

- **在加载期间执行算术运算**：允许您在加载数据时对特定列执行数学计算和操作，以便进行高级数据转换或生成新的派生数据。

- **将数据加载到包含额外列的表中**：使您能够将数据加载到已经包含额外列的表中，适应现有结构的同时高效地映射和插入数据到相应的列中。

## 教程

本节提供了几个简短的教程，提供了如何在加载数据时进行转换的实用指导。每个教程将通过两种方式引导您完成数据加载过程：直接从远程文件加载和从暂存文件加载。请注意，这些教程彼此独立，您不需要按顺序完成它们。根据您的需求随意跟随。

### 开始之前

下载示例文件 [employees.parquet](https://datasets.databend.org/employees.parquet) 然后使用 [BendSQL](../../30-sql-clients/00-bendsql/index.md) 将其上传到您的用户阶段。例如，

```sql
root@localhost:8000/default> PUT fs:///Users/eric/Documents/books.parquet @~

PUT fs:///Users/eric/Documents/books.parquet @~

┌───────────────────────────────────────────────┐
│                 file                │  status │
│                String               │  String │
├─────────────────────────────────────┼─────────┤
│ /Users/eric/Documents/books.parquet │ SUCCESS │
└───────────────────────────────────────────────┘
```

如果您查询该文件，您会发现它包含以下记录：

```sql
-- 直接查询远程示例文件
SELECT * FROM 'https://datasets.databend.org/employees.parquet';

-- 查询暂存的示例文件
SELECT * FROM @~/employees.parquet;
```

结果：
```
┌────┬───────────────┬─────┬─────────────────────┐
│ id │ name          │ age │ onboarded           │
├────┼───────────────┼─────┼─────────────────────┤
│  2 │ Jane Doe      │  35 │ 2022-02-15 13:30:00 │
│  1 │ John Smith    │  28 │ 2022-01-01 09:00:00 │
│  3 │ Mike Johnson  │  42 │ 2022-03-10 11:15:00 │
└────┴───────────────┴─────┴─────────────────────┘
```

### 教程 1 - 加载数据列的子集

在本教程中，您将创建一个比示例文件少列的表，然后用从示例文件中提取的相应数据填充它。

1. 创建一个没有 'age' 列的表。

```sql
CREATE TABLE employees_no_age (
  id INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 从远程或暂存的示例文件中加载数据，除了 'age' 列。

```sql
-- 从远程文件加载
COPY INTO employees_no_age
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.onboarded 
    FROM 'https://datasets.databend.org/employees.parquet' t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

-- 从暂存文件加载
COPY INTO employees_no_age
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.onboarded 
    FROM @~ t
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
┌────┬───────────────┬─────────────────────┐
│ id │ name          │ onboarded           │
├────┼───────────────┼─────────────────────┤
│  2 │ Jane Doe      │ 2022-02-15 13:30:00 │
│  1 │ John Smith    │ 2022-01-01 09:00:00 │
│  3 │ Mike Johnson  │ 2022-03-10 11:15:00 │
└────┴───────────────┴─────────────────────┘
```

### 教程 2 - 在加载期间重新排序列

在本教程中，您将创建一个与示例文件具有相同列但顺序不同的表，然后用从示例文件中提取的相应数据填充它。

1. 创建一个 'name' 和 'age' 列交换位置的表。

```sql
CREATE TABLE employees_new_order (
  id INT,
  age INT,
  name VARCHAR,
  onboarded timestamp
);
```

2. 从远程或暂存的示例文件中按新顺序加载数据。

```sql
-- 从远程文件加载
COPY INTO employees_new_order
FROM (
    SELECT 
        t.id, 
        t.age, 
        t.name, 
        t.onboarded 
    FROM 'https://datasets.databend.org/employees.parquet' t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

-- 从暂存文件加载
COPY INTO employees_new_order
FROM (
    SELECT 
        t.id, 
        t.age, 
        t.name, 
        t.onboarded 
    FROM @~ t
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
┌────┬─────┬───────────────┬─────────────────────┐
│ id │ age │ name          │ onboarded           │
├────┼─────┼───────────────┼─────────────────────┤
│  3 │  42 │ Mike Johnson  │ 2022-03-10 11:15:00 │
│  2 │  35 │ Jane Doe      │ 2022-02-15 13:30:00 │
│  1 │  28 │ John Smith    │ 2022-01-01 09:00:00 │
└────┴─────┴───────────────┴─────────────────────┘
```

### 教程 3 - 在加载期间转换数据类型

在本教程中，您将创建一个与示例文件具有相同列的表，除了一个将具有不同数据类型的列，然后用从示例文件中提取并转换的数据填充它。

1. 创建一个 'onboarded' 列为 Date 类型的表。

```sql
CREATE TABLE employees_date (
  id INT,
  name VARCHAR,
  age INT,
  onboarded date
);
```

2. 从远程或暂存的示例文件中加载数据，并将 'onboarded' 列转换为 Date 类型。

```sql
-- 从远程文件加载
COPY INTO employees_date
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        to_date(t.onboarded) 
    FROM 'https://datasets.databend.org/employees.parquet' t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

-- 从暂存文件加载
COPY INTO employees_date
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        to_date(t.onboarded) 
    FROM @~ t
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
┌────┬───────────────┬─────┬────────────┐
│ id │ name          │ age │ onboarded  │
├────┼───────────────┼─────┼────────────┤
│  3 │ Mike Johnson  │  42 │ 2022-03-10 │
│  1 │ John Smith    │  28 │ 2022-01-01 │
│  2 │ Jane Doe      │  35 │ 2022-02-15 │
└────┴───────────────┴─────┴────────────┘
```

### 教程 4 - 在加载期间执行算术运算

在本教程中，您将创建一个与示例文件具有相同列的表。然后您将从示例文件中提取并转换数据，对提取的数据执行算术运算，并用结果填充表。

1. 创建一个包含与示例文件完全相同列的表：

```sql
CREATE TABLE employees_new_age (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp
);
```

2. 从远程或暂存的示例文件中加载数据，并在将 'age' 列的值插入目标表之前对其执行算术运算以增加 1。

```sql
-- 从远程文件加载
COPY INTO employees_new_age
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age + 1, 
        t.onboarded 
    FROM 'https://datasets.databend.org/employees.parquet' t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

-- 从暂存文件加载
COPY INTO employees_new_age
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age + 1, 
        t.onboarded 
    FROM @~ t
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
┌────┬───────────────┬─────┬─────────────────────┐
│ id │ name          │ age │ onboarded           │
├────┼───────────────┼─────┼─────────────────────┤
│  3 │ Mike Johnson  │  43 │ 2022-03-10 11:15:00 │
│  2 │ Jane Doe      │  36 │ 2022-02-15 13:30:00 │
│  1 │ John Smith    │  29 │ 2022-01-01 09:00:00 │
└────┴───────────────┴─────┴─────────────────────┘
```

### 教程 5 - 将数据加载到包含额外列的表中

在本教程中，您将创建一个与示例文件相比包含额外列的新表。然后您将从示例文件中提取数据，并最终用转换后的数据填充新表。

1. 创建一个比示例文件包含更多列的表：

```sql
CREATE TABLE employees_plus (
  id INT,
  name VARCHAR,
  age INT,
  onboarded timestamp,
  lastday timestamp
);
```

2. 从暂存的示例文件中加载数据：

```sql
-- 从远程文件加载
COPY INTO employees_plus (id, name, age, onboarded)
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        t.onboarded 
    FROM 'https://datasets.databend.org/employees.parquet' t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';

-- 从暂存文件加载
COPY INTO employees_plus (id, name, age, onboarded)
FROM (
    SELECT 
        t.id, 
        t.name, 
        t.age, 
        t.onboarded 
    FROM @~ t
)
FILE_FORMAT = (TYPE = PARQUET)
PATTERN = '.*parquet';
```

3. 检查加载的数据：

```sql
SELECT * FROM employees_plus;
```
```

```
结果：
```
┌────┬───────────────┬─────┬─────────────────────┬─────────────────────┐
│ id │ name          │ age │ onboarded           │ lastday             │
├────┼───────────────┼─────┼─────────────────────┼─────────────────────┤
│  3 │ Mike Johnson  │  42 │ 2022-03-10 11:15:00 │ 1970-01-01 00:00:00 │
│  1 │ John Smith    │  28 │ 2022-01-01 09:00:00 │ 1970-01-01 00:00:00 │
│  2 │ Jane Doe      │  35 │ 2022-02-15 13:30:00 │ 1970-01-01 00:00:00 │
└────┴───────────────┴─────┴─────────────────────┴─────────────────────┘
```
