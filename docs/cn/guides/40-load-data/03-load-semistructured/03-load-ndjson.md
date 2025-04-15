---
title: 将 NDJSON 加载到 Databend
sidebar_label: NDJSON
---

## 什么是 NDJSON？

NDJSON 构建于 JSON 之上，是 JSON 的严格子集。每一行必须包含一个单独的、自包含的有效 JSON 对象。

以下示例展示了一个包含两个 JSON 对象的 NDJSON 文件：

```text
{"title":"Title_0","author":"Author_0"}
{"title":"Title_1","author":"Author_1"}
```

## 加载 NDJSON 文件

加载 NDJSON 文件的常见语法如下：

```sql
COPY INTO [<database>.]<table_name>
FROM { userStage | internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
    TYPE = NDJSON,
    COMPRESSION = AUTO
) ]
```

有关语法的更多详细信息，请参见 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从 NDJSON 文件加载数据

### 步骤 1. 创建一个内部 Stage

创建一个内部 Stage 来存储 NDJSON 文件。

```sql
CREATE STAGE my_ndjson_stage;
```

### 步骤 2. 创建 NDJSON 文件

使用以下 SQL 语句生成一个 NDJSON 文件：

```sql
COPY INTO @my_ndjson_stage
FROM (
    SELECT
        'Title_' || CAST(number AS VARCHAR) AS title,
        'Author_' || CAST(number AS VARCHAR) AS author
    FROM numbers(100000)
)
    FILE_FORMAT = (TYPE = NDJSON)
;
```

验证 NDJSON 文件的创建：

```sql
LIST @my_ndjson_stage;
```

结果：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              name                              │   size  │                 md5                │         last_modified         │      creator     │
├────────────────────────────────────────────────────────────────┼─────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_b3d94fad-3052-42e4-b090-26409e88c7b9_0000_00000000.ndjson │ 4777780 │ "d1cc98fefc3e3aa0649cade880d754aa" │ 2023-12-26 12:15:59.000 +0000 │ NULL             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 直接从 NDJSON 复制

要直接从 NDJSON 文件将数据复制到您的表中，请使用以下 SQL 命令：

```sql
COPY INTO books
FROM @my_ndjson_stage
PATTERN = '.*[.]ndjson'
FILE_FORMAT = (
    TYPE = NDJSON
);
```

结果：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_b3d94fad-3052-42e4-b090-26409e88c7b9_0000_00000000.ndjson │      100000 │           0 │ NULL             │             NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4（可选）。使用 SELECT 复制数据

为了获得更多控制，例如在复制时转换数据，请使用 SELECT 语句。在 [`SELECT from NDJSON`](../04-transform/03-querying-ndjson.md) 了解更多信息。

```sql
COPY INTO books(title, author)
FROM (
    SELECT $1:title, $1:author
    FROM @my_ndjson_stage
)
PATTERN = '.*[.]ndjson'
FILE_FORMAT = (
    TYPE = NDJSON
);
```