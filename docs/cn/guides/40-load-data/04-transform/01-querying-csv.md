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

:::info 提示
**查询返回内容说明：**

* **返回格式**：默认以字符串形式返回各列值
* **访问方法**：使用位置引用 `$<col_position>`（例如 `$1`、`$2`、`$3`）
* **示例**：`SELECT $1, $2, $3 FROM @stage_name`
* **关键特性**：
  * 通过位置而非名称访问列
  * 每个 `$<col_position>` 引用单列而非整行
  * 非字符串操作需类型转换（例如 `CAST($1 AS INT)`）
  * CSV 文件不包含内嵌模式信息
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您的 S3 存储桶和凭证创建外部 Stage：
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
    SKIP_HEADER = 1;        -- 当 CSV 文件含标题行时，查询跳过首行
```

- 更多 CSV 文件格式选项参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)

### 步骤 3. 查询 CSV 文件

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```

若 CSV 文件经 gzip 压缩，使用以下查询：

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv[.]gz'
);
```

### 包含元数据的查询

直接从 Stage 查询 CSV 文件，包含元数据列 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER`：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```