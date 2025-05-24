---
title: 将 CSV 加载到 Databend
sidebar_label: CSV
---

## 什么是 CSV？

CSV (Comma Separated Values) 是一种用于存储表格数据的简单文件格式，例如电子表格或数据库。CSV 文件是纯文本文件，以表格形式包含数据，其中每行表示一个新行，列由分隔符分隔。

以下示例显示了一个包含两条记录的 CSV 文件：

```text
Title_0,Author_0
Title_1,Author_1
```

## 加载 CSV 文件

加载 CSV 文件的常用语法如下：

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

- 有关更多 CSV 文件格式选项，请参阅 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)。
- 有关更多 COPY INTO table 选项，请参阅 [COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从 CSV 文件加载数据

### 步骤 1. 创建 Internal Stage

创建一个 Internal Stage 来存储 CSV 文件。

```sql
CREATE STAGE my_csv_stage;
```

### 步骤 2. 创建 CSV 文件

使用以下 SQL 语句生成一个 CSV 文件：

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

验证 CSV 文件的创建：

```sql
LIST @my_csv_stage;
```

结果：

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              name                              │  size  │                 md5                │         last_modified         │      creator     │
├────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
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

### 步骤 4. 直接从 CSV 复制

要直接从 CSV 文件将数据复制到表中，请使用以下 SQL 命令：

```sql
COPY INTO books
FROM @my_csv_stage
PATTERN = '.*[.]csv.gz'
FILE_FORMAT = (
    TYPE = CSV,
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0, -- 如果是标题行，则跳过第一行，这里我们没有标题行
    COMPRESSION = AUTO
);
```

结果：

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_4bb7f864-f5f2-41e8-a442-68c2a709be5a_0000_00000000.csv.gz │      100000 │           0 │ NULL             │             NULL │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 步骤 4 (可选). 使用 SELECT 复制数据

为了获得更多控制，例如在复制时转换数据，请使用 SELECT 语句。在 [`SELECT from CSV`](../04-transform/01-querying-csv.md) 中了解更多信息。

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
    SKIP_HEADER = 0, -- 如果是标题行，则跳过第一行，这里我们没有标题行
    COMPRESSION = 'AUTO'
);
```