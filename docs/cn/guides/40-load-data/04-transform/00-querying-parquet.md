---
title: 查询Stage中的Parquet文件
sidebar_label: 查询Parquet文件
---

## 查询Stage中的Parquet文件

语法:
```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```

:::info 提示
Parquet包含模式信息，因此我们可以直接查询列 `<column> [, <column> ...]`。
:::

## 教程

### 步骤1. 创建外部Stage

使用您自己的S3存储桶和凭证创建一个外部Stage，其中存储了您的Parquet文件。
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤2. 创建自定义Parquet文件格式

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```
- 更多Parquet文件格式选项请参考 [Parquet文件格式选项](/sql/sql-reference/file-format-options#parquet-options)

### 步骤3. 查询Parquet文件

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```