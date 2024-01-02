---
title: 将 NDJSON 文件加载到 Databend
sidebar_label: 加载 NDJSON 文件
---

## 什么是 NDJSON？ {#what-is-ndjson}

NDJSON 基于 JSON 构建，它是 JSON 的一个严格子集。每一行必须包含一个独立的、格式正确的 JSON 对象。

以下示例展示了一个包含两个 JSON 对象的 NDJSON 文件：

```text
{"title":"Title_0","author":"Author_0"}
{"title":"Title_1","author":"Author_1"}
```

## 加载 NDJSON 文件 {#loading-ndjson-file}

加载 NDJSON 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
FROM { userStage | internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
    TYPE = NDJSON,
    COMPRESSION = AUTO
) ]
```
有关语法的更多详细信息，请参见 [COPY INTO <table\>](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从 NDJSON 文件加载数据 {#tutorial-loading-data-from-ndjson-files}

### 第 1 步：创建内部 Stage {#step-1-create-an-internal-stage}

创建一个内部 stage 来存储 NDJSON 文件。
```sql
CREATE STAGE my_ndjson_stage;
```

### 第 2 步：创建 NDJSON 文件 {#step-2-create-ndjson-files}

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

### 第 3 步：创建目标表 {#step-3-create-target-table}

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```
### 第 4 步：将数据复制到表中 {#step-4-copy-data-into-table}

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