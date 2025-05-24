---
title: 查询 Stage 中的 TSV 文件
sidebar_label: TSV
---

## 查询 Stage 中的 TSV 文件

语法：
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


:::info Tips
**查询返回内容说明：**

* **返回格式**：默认情况下，单个列值以字符串形式返回
* **访问方法**：使用位置引用 `$<col_position>`（例如，`$1`、`$2`、`$3`）
* **示例**：`SELECT $1, $2, $3 FROM @stage_name`
* **主要特点**：
  * 列通过位置而不是名称访问
  * 每个 `$<col_position>` 指的是单个列，而不是整行
  * 对于非字符串操作需要类型转换（例如，`CAST($1 AS INT)`）
  * TSV 文件中没有嵌入的 schema 信息
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您自己的 S3 存储桶和凭据创建外部 Stage，其中存储了您的 TSV 文件。
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2. 创建自定义 TSV 文件格式

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- 更多 TSV 文件格式选项请参考 [TSV 文件格式选项](/sql/sql-reference/file-format-options#tsv-options)

### 步骤 3. 查询 TSV 文件

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
### 查询元数据

直接从 Stage 查询 TSV 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```