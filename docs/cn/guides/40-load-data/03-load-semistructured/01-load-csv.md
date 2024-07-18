---
title: 将CSV文件加载到Databend
sidebar_label: 加载CSV文件
---

## 什么是CSV？

CSV（逗号分隔值）是一种简单的文件格式，用于存储表格数据，如电子表格或数据库。CSV文件是纯文本文件，包含以表格格式存储的数据，其中每一行在新行上表示，列由分隔符分隔。

以下示例显示了一个包含两个记录的CSV文件：

```text
Title_0,Author_0
Title_1,Author_1
```

## 加载CSV文件

加载CSV文件的常见语法如下：

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

有关语法的更多详细信息，请参见[COPY INTO table](/sql/sql-commands/dml/dml-copy-into-table)。

## 教程：从CSV文件加载数据

### 步骤1. 创建内部阶段

创建一个内部阶段来存储CSV文件。

```sql
CREATE STAGE my_csv_stage;
```

### 步骤2. 创建CSV文件

使用以下SQL语句生成一个CSV文件：

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

验证CSV文件的创建：

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

### 步骤3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤4. 直接从CSV复制数据

要直接从CSV文件将数据复制到表中，请使用以下SQL命令：

```sql
COPY INTO books
FROM @my_csv_stage
PATTERN = '.*[.]csv.gz'
FILE_FORMAT = (
    TYPE = CSV,
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0, -- 如果第一行是标题，则跳过，这里我们没有标题
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

### 步骤4（选项）。使用SELECT复制数据

为了更精细的控制，例如在复制过程中转换数据，请使用SELECT语句。了解更多信息请参见[`SELECT from CSV`](../04-transform/01-querying-csv.md)。

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
    SKIP_HEADER = 0, -- 如果第一行是标题，则跳过，这里我们没有标题
    COMPRESSION = 'AUTO'
);
```