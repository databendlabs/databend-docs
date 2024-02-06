---
title: 在 Stage 中查询 Parquet 文件
sidebar_label: 查询 Parquet 文件
---

## 在 Stage 中查询 Parquet 文件

语法：
```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>']
)]
```

:::info 提示
Parquet 包含了架构信息，因此我们可以直接查询列 `<column> [, <column> ...]`。
:::

## 教程

### 第 1 步. 创建一个外部 Stage

使用您自己的 S3 桶和凭证创建一个外部 stage，您的 Parquet 文件存储在其中。
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步. 创建自定义 Parquet 文件格式

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```
- 更多 Parquet 文件格式选项，请参考 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)

### 第 3 步. 查询 Parquet 文件

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```