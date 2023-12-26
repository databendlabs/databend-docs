---
title: 将 CSV 文件加载到 Databend
sidebar_label: 加载 CSV 文件
---

## 什么是 CSV？ {/*what-is-csv*/}

CSV（逗号分隔值）是一种简单的文件格式，用于存储表格数据，如电子表格或数据库。CSV 文件是包含以表格格式存储的数据的纯文本文件，其中每一行表示为新的一行，列由分隔符分开。

以下示例显示了一个包含两条记录的 CSV 文件：
```text
Title_0,Author_0
Title_1,Author_1
```

## 加载 CSV 文件 {/*loading-csv-file*/}

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
有关语法的更多详细信息可以在 [COPY INTO <table\>](/sql/sql-commands/dml/dml-copy-into-table) 中找到。

## 教程：从 CSV 文件加载数据 {/*tutorial-loading-data-from-csv-files*/}

### 第 1 步：创建内部阶段 {/*step-1-create-an-internal-stage*/}

创建一个内部阶段来存储 CSV 文件。
```sql
CREATE STAGE my_csv_stage;
```

### 第 2 步：创建 CSV 文件 {/*step-2-create-csv-files*/}

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

### 第 3 步：创建目标表 {/*step-3-create-target-table*/}

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```
### 第 4 步：将数据复制到表中 {/*step-4-copy-data-into-table*/}

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