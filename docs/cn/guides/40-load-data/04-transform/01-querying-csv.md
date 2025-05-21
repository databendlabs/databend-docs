---
title: 查询 Stage 中的 CSV 文件
sidebar_label: CSV
---

## 查询 Stage 中的 CSV 文件

语法：
```sql
SELECT [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV| <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```


:::info Tips
CSV 没有 schema 信息，所以我们只能通过位置查询列 `$<col_position> [, $<col_position> ...]`。
:::

## 教程

### 步骤 1. 创建一个外部 Stage

使用您自己的 S3 bucket 和存储 CSV 文件的凭据创建一个外部 Stage。
```sql
CREATE STAGE csv_query_stage 
URL = 's3://load/csv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2. 创建自定义 CSV 文件格式

```sql
CREATE FILE FORMAT csv_query_format 
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO,
    SKIP_HEADER = 1;        -- 如果 CSV 文件有 header，则在查询时跳过第一行
```

- 更多 CSV 文件格式选项请参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)

### 步骤 3. 查询 CSV 文件

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```

如果 CSV 文件使用 gzip 压缩，我们可以使用以下查询：

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv[.]gz'
);
```
### 使用元数据查询

直接从 Stage 查询 CSV 文件，包括元数据列，如 `metadata$filename` 和 `metadata$file_row_number`：

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```