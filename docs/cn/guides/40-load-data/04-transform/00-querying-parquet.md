```md
---
title: 查询 Stage 中的 Parquet 文件
sidebar_label: Parquet
---

## 查询 Stage 中的 Parquet 文件

语法：
```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::info Tips
Parquet 具有 schema 信息，因此我们可以直接查询列 `<column> [, <column> ...]`。
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您自己的 S3 bucket 和存储 Parquet 文件的凭据创建一个外部 Stage。
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2. 创建自定义 Parquet 文件格式

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```
- 更多 Parquet 文件格式选项请参考 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)

### 步骤 3. 查询 Parquet 文件

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```
### 使用元数据查询

直接从 Stage 查询 Parquet 文件，包括元数据列，如 `metadata$filename` 和 `metadata$file_row_number`：

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```