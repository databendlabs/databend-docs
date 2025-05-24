---
title: 查询 Stage 中的 Parquet 文件
sidebar_label: Parquet
---

## 查询 Stage 中的 Parquet 文件

语法:
```sql
SELECT [<alias>.]<column> [, <column> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::info Tips
**查询返回内容说明:**

* **返回格式**: 原始数据类型 (而非变体) 的列值
* **访问方法**: 直接使用列名 `column_name`
* **示例**: `SELECT id, name, age FROM @stage_name`
* **主要特性**:
  * 无需路径表达式 (如 `$1:name`)
  * 无需类型转换
  * Parquet 文件包含嵌入式 Schema 信息
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您自己的 S3 存储桶和凭据创建外部 Stage，其中存储了您的 Parquet 文件。
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2. 创建自定义 Parquet 文件格式

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```
- 更多 Parquet 文件格式选项请参考 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)

### 步骤 3. 查询 Parquet 文件

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```
### 查询元数据

直接从 Stage 查询 Parquet 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列:

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```