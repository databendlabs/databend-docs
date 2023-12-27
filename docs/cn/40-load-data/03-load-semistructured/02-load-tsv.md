---
title: 将 TSV 文件加载到 Databend
sidebar_label: 加载 TSV 文件
---

## 什么是 TSV？ {/*what-is-tsv*/}

TSV（制表符分隔值）是一种简单的文件格式，用于存储表格数据，如电子表格或数据库。TSV 文件格式与 CSV 非常相似，记录由换行符分隔，每个字段由制表符分隔。
以下示例显示了一个包含两条记录的 TSV 文件：

```text
Title_0	Author_0
Title_1	Author_1
```


## 加载 TSV 文件 {/*loading-tsv-file*/}

加载 TSV 文件的通用语法如下：

```sql
COPY INTO [<database>.]<table_name>
FROM { userStage | internalStage | externalStage | externalLocation }
[ PATTERN = '<regex_pattern>' ]
[ FILE_FORMAT = (
    TYPE = TSV,
    SKIP_HEADER = <integer>,
    COMPRESSION = AUTO
) ]
```
有关语法的更多细节可以在 [COPY INTO <table\>](/sql/sql-commands/dml/dml-copy-into-table) 中找到。

## 教程：从 TSV 文件加载数据 {/*tutorial-loading-data-from-tsv-files*/}

### 第 1 步. 创建内部阶段 {/*step-1-create-an-internal-stage*/}

创建一个内部阶段来存储 TSV 文件。
```sql
CREATE STAGE my_tsv_stage;
```

### 第 2 步. 创建 TSV 文件 {/*step-2-create-tsv-files*/}

使用以下 SQL 语句生成一个 TSV 文件：
```sql
COPY INTO @my_tsv_stage 
FROM (
    SELECT 
        'Title_' || CAST(number AS VARCHAR) AS title,
        'Author_' || CAST(number AS VARCHAR) AS author
    FROM numbers(100000)
)
    FILE_FORMAT = (TYPE = TSV)
;
```
验证 TSV 文件的创建：
```sql
LIST @my_tsv_stage;
```

结果：
```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             name                            │   size  │                 md5                │         last_modified         │      creator     │
├─────────────────────────────────────────────────────────────┼─────────┼────────────────────────────────────┼───────────────────────────────┼──────────────────┤
│ data_7413d5d0-f992-4d92-b28e-0e501d66bdc1_0000_00000000.tsv │ 2477780 │ "a906769144de7aa6a0056a86ddae97d2" │ 2023-12-26 11:56:19.000 +0000 │ NULL             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 第 3 步：创建目标表 {/*step-3-create-target-table*/}

```sql
CREATE TABLE books
(
    title VARCHAR,
    author VARCHAR
);
```
### 第 4 步. 将数据复制到表中 {/*step-4-copy-data-into-table*/}

```sql
COPY INTO books
FROM @my_tsv_stage
PATTERN = '.*[.]tsv'
FILE_FORMAT = (
    TYPE = TSV,
    SKIP_HEADER = 0, -- 如果第一行是标题，则跳过，这里我们没有标题
    COMPRESSION = AUTO
);
```

结果：
```text
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             File                            │ Rows_loaded │ Errors_seen │    First_error   │ First_error_line │
├─────────────────────────────────────────────────────────────┼─────────────┼─────────────┼──────────────────┼──────────────────┤
│ data_7413d5d0-f992-4d92-b28e-0e501d66bdc1_0000_00000000.tsv │      100000 │           0 │ NULL             │             NULL │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```