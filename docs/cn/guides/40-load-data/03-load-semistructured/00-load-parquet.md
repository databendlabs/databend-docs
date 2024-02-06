---
title: 将 Parquet 文件加载到 Databend 中
sidebar_label: 加载 Parquet 文件
---

## 什么是 Parquet？

Parquet 是一种常用于数据分析的列式存储格式。它旨在支持复杂的数据结构，并且对于处理大型数据集非常高效。

Parquet 文件对 Databend 最为友好。推荐使用 Parquet 文件作为 Databend 的数据源。

## 加载 Parquet 文件

加载 Parquet 文件的常用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

有关语法的更多详细信息，请参见 [COPY INTO <table\>](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从 Parquet 文件加载数据

### 步骤 1. 创建内部阶段

创建一个内部阶段来存储 Parquet 文件。
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

验证 Parquet 文件的创建：
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

有关卸载数据到阶段的更多详细信息，请参见 [COPY INTO <location\>](/sql/sql-commands/dml/dml-copy-into-location)。


### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 直接从 Parquet 复制

要直接从 Parquet 文件将数据复制到表中，请使用以下 SQL 命令：
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

### 步骤 4（可选）。使用 SELECT 来复制数据

为了更多的控制，比如在复制时转换数据，请使用 SELECT 语句。了解更多请参阅 [`从 Parquet 中 SELECT`](../04-transform/00-querying-parquet.md)
```sql
COPY INTO books (title, author)
FROM (
    SELECT title, author 
    FROM @my_parquet_stage
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET);
```