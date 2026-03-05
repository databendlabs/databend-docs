---
title: 将 CSV 数据导入 Databend
sidebar_label: CSV
---

## 什么是 CSV？

CSV (逗号分隔值) 是一种用于存储表格数据的简单文件格式，例如电子表格或数据库。CSV 文件是纯文本文件，以表格形式存储数据，其中每行数据占据新的一行，列之间通过分隔符隔开。

以下示例展示了一个包含两条记录的 CSV 文件：

```text
Title_0,Author_0
Title_1,Author_1
```

## 导入 CSV 文件

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

- 更多 CSV 文件格式选项，请参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options) 。
- 更多 COPY INTO 表选项，请参考 [COPY INTO 表](/sql/sql-commands/dml/dml-copy-into-table) 。

## 教程：从 CSV 文件导入数据

### 步骤 1. 创建内部 Stage

创建一个内部 stage 用于存储 CSV 文件。

```sql
CREATE STAGE my_csv_stage;
```

### 步骤 2. 创建 CSV 文件

使用以下 SQL 语句生成 CSV 文件：

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

验证 CSV 文件是否创建成功：

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

### 步骤 4. 直接从 CSV 导入数据

使用以下 SQL 命令直接从 CSV 文件将数据导入表中：

```sql
COPY INTO books
FROM @my_csv_stage
PATTERN = '.*[.]csv.gz'
FILE_FORMAT = (
    TYPE = CSV,
    FIELD_DELIMITER = ',',
    RECORD_DELIMITER = '\n',
    SKIP_HEADER = 0, -- 如果第一行是标题则跳过，这里我们没有标题行
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

### 步骤 4 (可选). 使用 SELECT 导入数据

如需在导入时对数据进行转换等更精细的控制，可以使用 SELECT 语句。了解更多请参阅 [`从 CSV 查询`](../04-transform/01-querying-csv.md) 。

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
    SKIP_HEADER = 0, -- 如果第一行是标题则跳过，这里我们没有标题行
    COMPRESSION = 'AUTO'
);
```