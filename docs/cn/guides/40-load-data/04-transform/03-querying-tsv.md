---
title: 在 Stage 中查询 TSV 文件
sidebar_label: 查询 TSV 文件
---

## 在 Stage 中查询 TSV 文件

语法：
```sql
SELECT [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'TSV| <custom_format_name>']
)]
```


:::info 提示
TSV 没有模式信息，因此我们只能通过位置查询列 `$<col_position> [, $<col_position> ...]`。
:::

## 教程

### 第 1 步. 创建一个外部 Stage

使用您自己的 S3 桶和凭证创建一个外部 stage，您的 TSV 文件存储在其中。
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步. 创建自定义 TSV 文件格式

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- 更多 TSV 文件格式选项请参考 [TSV 文件格式选项](/sql/sql-reference/file-format-options#tsv-options)

### 第 3 步. 查询 TSV 文件

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```

如果 TSV 文件使用 gzip 压缩，我们可以使用以下查询：

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv[.]gz'
);
```