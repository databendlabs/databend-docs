---
title: 将 Parquet 文件加载到 Databend
sidebar_label: 加载 Parquet 文件
---

## 什么是 Parquet？

Parquet 是一种常用于数据分析的列式存储格式。它旨在支持复杂的数据结构，并且在处理大型数据集时效率很高。

Parquet 文件对 Databend 来说非常友好。建议使用 Parquet 文件作为 Databend 的数据源。

## 加载 Parquet 文件

加载 Parquet 文件的常见语法如下：

```sql
COPY INTO [<database>.]<table_name>
     FROM { internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
FILE_FORMAT = (TYPE = PARQUET)
```

更多关于语法的细节可以在 [COPY INTO <table\>](/sql/sql-commands/dml/dml-copy-into-table) 中找到。

## 教程：从 Parquet 文件加载数据

### 步骤 1. 创建内部阶段

创建一个内部阶段来存储 Parquet 文件。
```sql
CREATE STAGE my_parquet_stage;
```

### 步骤 2. 创建 Parquet 文件

使用以下 SQL 语句生成一个 Parquet 文件：
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

验证 Parquet 文件的创建：
```sql
LIST @my_parquet_stage;
```

结果：
```text

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               name                              │  size  │                 md5                │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────────┼────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │  65443 │ "ab4631846ca8a2beed6a48be75d2acac" │ 2023-12-26 10:28:18.000 +0000 │ NULL             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

更多关于卸载数据到阶段的细节可以在 [COPY INTO <location\>](/sql/sql-commands/dml/dml-copy-into-location) 中找到。


### 步骤 3：创建目标表

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```

### 步骤 4. 将数据复制到表中

```sql
COPY INTO books
    FROM @my_parquet_stage
    PATTERN = '.*[.]parquet'
    FILE_FORMAT = (TYPE = PARQUET); 
```

结果：
```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               File                              │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_3890e0b1-0233-422c-b506-3a4501602f28_0000_00000000.parquet │      100000 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```