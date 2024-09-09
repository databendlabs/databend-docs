---
title: 查询Stage中的TSV文件
sidebar_label: 查询TSV文件
---

## 查询Stage中的TSV文件

语法:
```sql
SELECT [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'TSV| <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```


:::info 提示
TSV文件没有模式信息，因此我们只能按位置查询列 `$<col_position> [, $<col_position> ...]`。
:::

## 教程

### 步骤1. 创建外部Stage

使用您自己的S3桶和凭据创建一个外部Stage，其中存储了您的TSV文件。
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤2. 创建自定义TSV文件格式

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- 更多TSV文件格式选项请参考 [TSV文件格式选项](/sql/sql-reference/file-format-options#tsv-options)

### 步骤3. 查询TSV文件

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```

如果TSV文件使用gzip压缩，我们可以使用以下查询:

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv[.]gz'
);
```