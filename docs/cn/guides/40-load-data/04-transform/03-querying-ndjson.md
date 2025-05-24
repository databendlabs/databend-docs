---
title: 查询 Stage 中的 NDJSON 文件
sidebar_label: NDJSON
---

## 查询 Stage 中的 NDJSON 文件

语法：
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


:::info Tips
**查询返回内容说明：**

* **返回格式**：每行作为一个单独的变体对象（引用为 `$1`）
* **访问方法**：使用路径表达式 `$1:column_name`
* **示例**：`SELECT $1:title, $1:author FROM @stage_name`
* **主要特点**：
  * 必须使用路径表示法访问特定字段
  * 对于特定类型操作需要进行类型转换（例如，`CAST($1:id AS INT)`）
  * 每行 NDJSON 都被解析为一个完整的 JSON 对象
  * 整行表示为一个单独的变体对象
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您自己的 S3 存储桶和凭据创建外部 Stage，其中存储了您的 NDJSON 文件。
```sql
CREATE STAGE ndjson_query_stage 
URL = 's3://load/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2. 创建自定义 NDJSON 文件格式

```sql
CREATE FILE FORMAT ndjson_query_format 
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- 更多 NDJSON 文件格式选项请参考 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

### 步骤 3. 查询 NDJSON 文件

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

如果 NDJSON 文件使用 gzip 压缩，我们可以使用以下查询：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```
### 使用元数据查询

直接从 Stage 查询 NDJSON 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```