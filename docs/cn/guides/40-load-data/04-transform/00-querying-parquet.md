---
title: 查询暂存区中的 Parquet 文件
sidebar_label: Parquet
---


## 语法：

- [将行作为 Variant 查询](./index.md#query-rows-as-variants)
- [按名称查询列](./index.md#query-columns-by-name)
- [查询元数据](./index.md#query-metadata)

## 教程

### 步骤 1：创建外部暂存区（Stage）

使用您自己的 S3 存储桶和凭据创建一个外部暂存区（Stage），用于存放 Parquet 文件。
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2：创建自定义 Parquet 文件格式

```sql
CREATE FILE FORMAT parquet_query_format TYPE = PARQUET;
```
- 更多 Parquet 文件格式选项，请参阅 [Parquet 文件格式选项](/sql/sql-reference/file-format-options#parquet-options)

### 步骤 3：查询 Parquet 文件

按列名查询：

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```

按路径表达式查询：


```sql
SELECT $1
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```


### 查询元数据（Metadata）

直接从暂存区（Stage）查询 Parquet 文件，并包含 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据（Metadata）列：

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