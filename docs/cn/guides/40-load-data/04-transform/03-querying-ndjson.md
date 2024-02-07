---
title: 查询 Stage 中的 NDJSON 文件
sidebar_label: 查询 NDJSON 文件
---

## 查询 Stage 中的 NDJSON 文件

语法：

```sql
SELECT [<alias>.]$1:<column> [, $1:<column> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'NDJSON| <custom_format_name>']
)]
```

:::info 提示
NDJSON 是针对整行的变体，列的表示方式为 `$1:<column> [, $1:<column> ...]`。
:::

## 教程

### 步骤 1. 创建外部 Stage

使用您自己的 S3 桶和凭证创建一个外部 stage，您的 NDJSON 文件存储在其中。

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

- 更多 NDJSON 文件格式选项参考 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

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
