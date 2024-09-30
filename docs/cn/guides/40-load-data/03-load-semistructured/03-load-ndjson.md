---
title: 加载NDJSON文件到Databend
sidebar_label: 加载NDJSON文件
---

## 什么是NDJSON？

NDJSON基于JSON构建，是JSON的一个严格子集。每行必须包含一个独立的、自包含的有效JSON对象。

以下示例展示了一个包含两个JSON对象的NDJSON文件：

```text
{"title":"Title_0","author":"Author_0"}
{"title":"Title_1","author":"Author_1"}
```

## 加载NDJSON文件

加载NDJSON文件的常见语法如下：

```sql
COPY INTO [<database>.]<table_name>
FROM { userStage | internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
    TYPE = NDJSON,
    COMPRESSION = AUTO
) ]
```

更多关于语法的详细信息可以在[COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)中找到。

## 教程：从NDJSON文件加载数据

### 步骤1. 创建内部Stage

创建一个内部Stage来存储NDJSON文件。

```sql
CREATE STAGE my_ndjson_stage;
```

### 步骤2. 创建NDJSON文件

使用以下SQL语句生成一个NDJSON文件：

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

验证NDJSON文件的创建：

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

### 步骤3: 创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤4. 直接从NDJSON复制数据

要直接从NDJSON文件将数据复制到表中，请使用以下SQL命令：

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

### 步骤4（选项）. 使用SELECT复制数据

为了获得更多控制，例如在复制时转换数据，请使用SELECT语句。了解更多信息请参见[`SELECT from NDJSON`](../04-transform/03-querying-ndjson.md)。

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