---
title: 将 CSV 加载到 Databend
sidebar_label: CSV
---

## 什么是 CSV？

CSV（Comma-Separated Values）是一种用于存储表格数据（如电子表格或数据库）的简单文件格式。CSV 文件是以表格格式存储数据的纯文本文件，每行代表一条新记录，列间通过分隔符分隔。

以下示例展示包含两条记录的 CSV 文件：

```text
Title_0,Author_0
Title_1,Author_1
```

## 加载 CSV 文件

加载 CSV 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
FROM { userStage | internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
    TYPE = CSV,
    RECORD_DELIMITER = '<character>',
    FIELD_DELIMITER = '<character>',
    SKIP_HEADER = <integer>,
    COMPRESSION = AUTO
) ]
```

- 更多 CSV 文件格式选项详见 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)
- 更多 COPY INTO 表选项详见 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)

## 教程：从 CSV 文件加载数据

### 步骤 1. 创建内部存储阶段

创建内部存储阶段用于存放 CSV 文件：

```sql
CREATE STAGE my_csv_stage;
```

### 步骤 2. 创建 CSV 文件

通过 SQL 语句生成 CSV 文件：

```sql
COPY INTO @my_csv_stage
FROM (
    SELECT
        'Title_' || CAST(number AS VARCHAR) AS title,
        'Author_' || CAST(number AS VARCHAR) AS author
    FROM numbers(100000)
)
    FILE_FORMAT = (TYPE = CSV, COMPRESSION = gzip)
;
```

验证 CSV 文件创建结果：

```sql
LIST @my_csv_stage;
```

返回结果：

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              文件名                             │  大小  │                 md5                │         最后修改时间         │      创建者      │
├────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼──────────────────────────────┼──────────────────┤
│ data_4bb7f864-f5f2-41e8-a442-68c2a709be5a_0000_00000000.csv.gz │ 483110 │ "0c8e28daed524468269e44ac13d2f463" │ 2023-12-26 11:37:21.000 +0000 │ NULL             │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 直接从 CSV 导入

通过 SQL 命令直接从 CSV 文件导入数据：

```sql
COPY INTO books
FROM @my_csv_stage
PATTERN = '.*[.]csv.gz'
FILE_FORMAT = (
    TYPE = CSV,
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0, -- 若首行为标题则跳过，此处无标题
    COMPRESSION = AUTO
);
```

执行结果：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              文件                              │ 加载行数 │ 错误数 │    首个错误    │ 首个错误行 │
├────────────────────────────────────────────────────────────────┼────────────┼───────────┼─────────────────┼───────────────┤
│ data_4bb7f864-f5f2-41e8-a442-68c2a709be5a_0000_00000000.csv.gz │     100000 │         0 │ NULL            │          NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4（可选）. 使用 SELECT 导入数据

如需更灵活的控制（例如数据转换），可使用 SELECT 语句。详见 [`从 CSV 查询`](../04-transform/01-querying-csv.md)：

```sql
COPY INTO books (title, author)
FROM (
    SELECT $1, $2
    FROM @my_csv_stage
)
PATTERN = '.*[.]csv.gz'
FILE_FORMAT = (
    TYPE = 'CSV',
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0, -- 若首行为标题则跳过，此处无标题
    COMPRESSION = 'AUTO'
);
```