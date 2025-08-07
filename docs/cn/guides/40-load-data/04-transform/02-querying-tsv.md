---
title: 查询暂存区中的 TSV 文件
sidebar_label: TSV
---

## 语法：

- [按位置查询列](./index.md#query-columns-by-position)
- [查询元数据](./index.md#query-metadata)


## 教程

### 第 1 步：创建外部暂存区

创建一个外部暂存区（Stage），并配置你的 S3 存储桶和凭据，你的 TSV 文件存储在该位置。
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步：创建自定义 TSV 文件格式

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- 更多 TSV 文件格式选项，请参阅 [TSV 文件格式选项](/sql/sql-reference/file-format-options#tsv-options)

### 第 3 步：查询 TSV 文件

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

直接从暂存区（Stage）查询 TSV 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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