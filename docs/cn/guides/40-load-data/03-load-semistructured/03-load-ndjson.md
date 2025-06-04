---
title: 将 NDJSON 加载到 Databend
sidebar_label: NDJSON
---

## 什么是 NDJSON？

NDJSON 基于 JSON 构建，是 JSON 的一个严格子集。每一行必须包含一个独立且自包含的有效 JSON 对象。

以下示例展示包含两个 JSON 对象的 NDJSON 文件：

```text
{"title":"Title_0","author":"Author_0"}
{"title":"Title_1","author":"Author_1"}
```

## 加载 NDJSON 文件

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

- 更多 NDJSON 文件格式选项请参阅 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)
- 更多 COPY INTO 表选项请参阅 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从 NDJSON 文件加载数据

### 步骤 1. 创建内部存储阶段

创建内部存储阶段用于存放 NDJSON 文件：

```sql
CREATE STAGE my_ndjson_stage;
```

### 步骤 2. 创建 NDJSON 文件

通过 SQL 语句生成 NDJSON 文件：

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

验证 NDJSON 文件创建结果：

```sql
LIST @my_ndjson_stage;
```

结果：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              名称                              │   大小  │                 md5                │         最后修改时间          │      创建者      │
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

### 步骤 4. 直接从 NDJSON 复制数据

执行以下 SQL 命令直接从 NDJSON 文件复制数据到表：

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
│                              文件                              │ 已加载行数 │ 错误数 │    首个错误    │ 首个错误行号 │
├────────────────────────────────────────────────────────────────┼─────────────┼────────┼────────────────┼──────────────┤
│ data_b3d94fad-3052-42e4-b090-26409e88c7b9_0000_00000000.ndjson │      100000 │      0 │ NULL           │         NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4（可选）. 使用 SELECT 复制数据

如需在复制时转换数据等高级控制，请使用 SELECT 语句。详见 [`从 NDJSON 查询`](../04-transform/03-querying-ndjson.md)：

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