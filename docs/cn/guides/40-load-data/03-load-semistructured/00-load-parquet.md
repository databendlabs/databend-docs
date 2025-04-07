---
title: Loading Parquet File into Databend
sidebar_label: Parquet
---

## What is Parquet?

Parquet 是一种列式存储格式，通常用于数据分析。它旨在支持复杂的数据结构，并且可以高效地处理大型数据集。

Parquet 文件对 Databend 最友好。建议使用 Parquet 文件作为 Databend 的数据源。

## Loading Parquet File

加载 Parquet 文件的常用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

有关语法的更多详细信息，请参见 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## Tutorial: Loading Data from Parquet Files

### Step 1. Create an Internal Stage

创建一个 internal stage 来存储 Parquet 文件。

```sql
CREATE STAGE my_parquet_stage;
```

### Step 2. Create Parquet files

使用以下 SQL 语句生成 Parquet 文件：

```sql
COPY INTO @my_parquet_stage
FROM (
    SELECT
        'Title_' || CAST(number AS VARCHAR) AS title,
        'Author_' || CAST(number AS VARCHAR) AS author
    FROM numbers(100000)
)
    FILE_FORMAT = (TYPE = PARQUET);
```

验证 Parquet 文件的创建：

```sql
LIST @my_parquet_stage;
```

Result:

```text

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               name                              │  size  │                 md5                │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │  65443 │ "ab4631846ca8a2beed6a48be75d2acac" │ 2023-12-26 10:28:18.000 +0000 │ NULL             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

有关将数据卸载到 stage 的更多详细信息，请参见 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location)。

### Step 3: Create Target Table

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### Step 4. Copying Directly from Parquet

要直接从 Parquet 文件将数据复制到表中，请使用以下 SQL 命令：

```sql
COPY INTO books
    FROM @my_parquet_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

Result:

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │      100000 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4 (Option). Using SELECT to Copy Data

为了获得更多控制，例如在复制时转换数据，请使用 SELECT 语句。在 [`SELECT from Parquet`](../04-transform/00-querying-parquet.md) 了解更多信息。

```sql
COPY INTO books (title, author)
FROM (
    SELECT title, author
    FROM @my_parquet_stage
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET);
```
