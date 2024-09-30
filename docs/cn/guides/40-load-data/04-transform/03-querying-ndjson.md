---
title: 在Stage中查询NDJSON文件
sidebar_label: 查询NDJSON文件
---

## 在Stage中查询NDJSON文件

语法:
```sql
SELECT [<alias>.]$1:<column> [, $1:<column> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'NDJSON| <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```


:::info 提示
NDJSON是整行的变体，列是`$1:<column> [, $1:<column> ...]`。
:::

## 教程

### 步骤1. 创建外部Stage

使用您自己的S3桶和凭证创建一个外部Stage，其中存储了您的NDJSON文件。
```sql
CREATE STAGE ndjson_query_stage 
URL = 's3://load/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤2. 创建自定义NDJSON文件格式

```sql
CREATE FILE FORMAT ndjson_query_format 
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- 更多NDJSON文件格式选项请参考[NDJSON文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

### 步骤3. 查询NDJSON文件

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

如果NDJSON文件使用gzip压缩，我们可以使用以下查询：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```