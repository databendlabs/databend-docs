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


:::info 提示
**查询返回内容说明：**

* **返回格式**：默认以字符串形式返回各列值
* **访问方式**：使用位置引用 `$<col_position>` (例如 `$1`, `$2`, `$3`)
* **示例**：`SELECT $1, $2, $3 FROM @stage_name`
* **关键特性**：
  * 通过位置而非列名访问数据
  * 每个 `$<col_position>` 对应单个列而非整行
  * 非字符串操作需类型转换 (例如 `CAST($1 AS INT)`)
  * TSV 文件中不包含内嵌的 schema 信息
:::

## 教程

### 第一步：创建外部 Stage

使用您的 S3 存储桶和凭证创建外部 stage，用于存储 TSV 文件。
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第二步：创建自定义 TSV 文件格式

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- 更多 TSV 文件格式选项请参考 [TSV 文件格式选项](/sql/sql-reference/file-format-options#tsv-options)

### 第三步：查询 TSV 文件

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```

如果 TSV 文件使用 gzip 压缩，可以使用以下查询：

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv[.]gz'
);
```

### 查询包含元数据

直接从 stage 查询 TSV 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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