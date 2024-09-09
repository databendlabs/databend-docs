---
title: 在Stage中查询CSV文件
sidebar_label: 查询CSV文件
---

## 在Stage中查询CSV文件

语法:
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

:::info 提示
CSV没有schema信息，所以我们只能通过位置查询列 `$<col_position> [, $<col_position> ...]`。
:::

## 教程

### 步骤1. 创建外部Stage

使用您自己的S3 bucket和凭证创建一个外部stage，您的CSV文件存储在该bucket中。
```sql
CREATE STAGE csv_query_stage 
URL = 's3://load/csv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤2. 创建自定义CSV文件格式

```sql
CREATE FILE FORMAT csv_query_format 
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO,
    SKIP_HEADER = 1;        -- 如果CSV文件有header，查询时跳过第一行
```

- 更多CSV文件格式选项请参考 [CSV文件格式选项](/sql/sql-reference/file-format-options#csv-options)

### 步骤3. 查询CSV文件

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```

如果CSV文件使用gzip压缩，我们可以使用以下查询:

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv[.]gz'
);
```