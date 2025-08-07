---
title: 查询暂存区中的 CSV 文件
sidebar_label: CSV
---

## 语法：

- [按位置查询列](./index.md#query-columns-by-position)
- [查询元数据](./index.md#query-metadata)

## 教程

### 步骤 1：创建外部暂存区

创建一个外部暂存区（Stage），并配置你的 S3 存储桶和凭证，CSV 文件存储在该位置。
```sql
CREATE STAGE csv_query_stage 
URL = 's3://load/csv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 2：创建自定义 CSV 文件格式

```sql
CREATE FILE FORMAT csv_query_format 
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO,
    SKIP_HEADER = 1;        -- 如果 CSV 文件包含表头，查询时跳过第一行
```

- 更多 CSV 文件格式选项，请参考 [CSV 文件格式选项](/sql/sql-reference/file-format-options#csv-options)

### 步骤 3：查询 CSV 文件

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```

如果 CSV 文件使用 gzip 压缩，我们可以使用以下查询：

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv[.]gz'
);
```
### 查询元数据

直接从暂存区（Stage）查询 CSV 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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