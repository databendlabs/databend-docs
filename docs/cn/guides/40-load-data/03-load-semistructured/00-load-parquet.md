---
title: 将 Parquet 数据加载到 Databend
sidebar_label: Parquet
---

## 什么是 Parquet？

Parquet 是一种常用于数据分析的列式存储格式。它专为支持复杂数据结构而设计，能够高效处理大规模数据集。

Parquet 文件是与 Databend 兼容性最佳的数据格式，建议将其作为 Databend 的主要数据源。

## 加载 Parquet 文件

加载 Parquet 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

- 更多 Parquet 文件格式选项，请参阅 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)
- 更多 COPY INTO 表操作选项，请参阅 [COPY INTO 表](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从 Parquet 文件加载数据

### 步骤 1. 创建内部 Stage

创建一个内部 stage 用于存储 Parquet 文件：

```sql
CREATE STAGE my_parquet_stage;
```

### 步骤 2. 生成 Parquet 文件

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

验证 Parquet 文件是否生成成功：

```sql
LIST @my_parquet_stage;
```

执行结果：

```text

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               name                              │  size  │                 md5                │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │  65443 │ "ab4631846ca8a2beed6a48be75d2acac" │ 2023-12-26 10:28:18.000 +0000 │ NULL             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

有关将数据卸载到 stage 的更多细节，请参考 [COPY INTO 位置](/sql/sql-commands/dml/dml-copy-into-location)

### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 直接从 Parquet 文件加载数据

使用以下 SQL 命令直接将 Parquet 文件数据加载到目标表：

```sql
COPY INTO books
    FROM @my_parquet_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET);
```

执行结果：

```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │      100000 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4 (可选). 使用 SELECT 语句加载数据

如需在加载过程中对数据进行转换等更精细的控制，可使用 SELECT 语句。了解更多请参阅 [从 Parquet 查询数据](../04-transform/00-querying-parquet.md)

```sql
COPY INTO books (title, author)
FROM (
    SELECT title, author
    FROM @my_parquet_stage
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET);
```