---
title: 将 Parquet 文件加载到 Databend
sidebar_label: Parquet
---

## 什么是 Parquet？

Parquet 是一种在数据分析中广泛使用的列式存储格式（Columnar Storage Format）。它支持复杂数据结构，能高效处理大型数据集。

Parquet 文件是 Databend 最友好的数据格式，推荐将其作为 Databend 的数据源。

## 加载 Parquet 文件

加载 Parquet 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

- 更多 Parquet 文件格式选项详见 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)
- 更多 COPY INTO 表选项详见 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从 Parquet 文件加载数据

### 步骤 1. 创建内部存储阶段

创建内部存储阶段用于存放 Parquet 文件：

```sql
CREATE STAGE my_parquet_stage;
```

### 步骤 2. 生成 Parquet 文件

执行以下 SQL 语句生成 Parquet 文件：

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

验证 Parquet 文件是否生成：

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

数据导出到存储阶段的详细说明见 [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location)

### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 从 Parquet 直接复制数据

使用以下命令直接将 Parquet 数据复制到表中：

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

### 步骤 4（可选）. 使用 SELECT 复制数据

若需在复制时转换数据，可使用 SELECT 语句。详见 [`SELECT from Parquet`](../04-transform/00-querying-parquet.md)

```sql
COPY INTO books (title, author)
FROM (
    SELECT title, author
    FROM @my_parquet_stage
)
PATTERN = '.*[.]parquet'
FILE_FORMAT = (TYPE = PARQUET);
```