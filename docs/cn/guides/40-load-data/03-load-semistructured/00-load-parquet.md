---
title: 将 Parquet 文件加载到 Databend
sidebar_label: Parquet
---

## 什么是 Parquet？

Parquet 是一种列式存储格式，常用于数据分析。它旨在支持复杂数据结构，并且能高效处理大型数据集。

Parquet 文件对 Databend 最友好。建议使用 Parquet 文件作为 Databend 的数据源。

## 加载 Parquet 文件

加载 Parquet 文件的常用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

- 有关 Parquet 文件格式的更多选项，请参阅 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)。
- 有关 COPY INTO table 的更多选项，请参阅 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从 Parquet 文件加载数据

### 步骤 1. 创建内部 Stage

创建内部 Stage 以存储 Parquet 文件。

```sql
CREATE STAGE my_parquet_stage;
```

### 步骤 2. 创建 Parquet 文件

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

验证 Parquet 文件是否已创建：

```sql
LIST @my_parquet_stage;
```

结果：

```text

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               name                              │  size  │                 md5                │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │  65443 │ "ab4631846ca8a2beed6a48be75d2acac" │ 2023-12-26 10:28:18.000 +0000 │ NULL             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

有关将数据卸载到 Stage 的更多详细信息，请参阅 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location)。

### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 直接从 Parquet 复制

要将数据直接从 Parquet 文件复制到表中，请使用以下 SQL 命令：

```sql
COPY INTO books
    FROM @my_parquet_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

结果：

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │      100000 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4（选项）。使用 SELECT 复制数据

为了更好地控制，例如在复制时转换数据，请使用 SELECT 语句。了解更多信息，请参阅 [`SELECT from Parquet`](../04-transform/00-querying-parquet.md)

```sql
COPY INTO books (title, author)
FROM (
    SELECT title, author
    FROM @my_parquet_stage
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET);
```