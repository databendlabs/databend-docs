---
title: Querying NDJSON Files in Stage
sidebar_label: NDJSON
---

## Query NDJSON Files in Stage

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
NDJSON 是整行的变体，列是 `$1:<column> [, $1:<column> ...]`。
:::

## Tutorial

### Step 1. Create an External Stage

使用您自己的 S3 存储桶和凭据创建一个外部 Stage，用于存储您的 NDJSON 文件。

```sql
CREATE STAGE ndjson_query_stage
URL = 's3://load/ndjson/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom NDJSON File Format

```sql
CREATE FILE FORMAT ndjson_query_format
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- 更多 NDJSON 文件格式选项请参考 [NDJSON File Format Options](/sql/sql-reference/file-format-options#ndjson-options)

### Step 3. Query NDJSON Files

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
