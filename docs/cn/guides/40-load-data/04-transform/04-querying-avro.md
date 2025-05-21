---
title: 查询 Stage 中的 Avro 文件
sidebar_label: Avro
---

## 查询 Stage 中的 Avro 文件

语法：
```sql
SELECT [<alias>.]$1:<column> [, $1:<column> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'AVRO'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```

:::info Tips
可以使用 `$1:<column>` 直接将 Avro 文件作为 variants 查询。
:::

## Avro 查询功能概述

Databend 提供了全面的支持，可以直接从 stages 查询 Avro 文件。这允许灵活的数据探索和转换，而无需先将数据加载到表中。

*   **Variant 表示**: Avro 文件中的每一行都被视为一个 variant，由 `$1` 引用。这允许灵活访问 Avro 数据中的嵌套结构。
*   **类型映射**: 每个 Avro 类型都映射到 Databend 中相应的 variant 类型。
*   **元数据访问**: 您可以访问元数据列，如 `metadata$filename` 和 `metadata$file_row_number`，以获取有关源文件和行的更多上下文。

## 教程

本教程演示如何查询存储在 stage 中的 Avro 文件。

### 步骤 1. 准备一个 Avro 文件

考虑一个具有以下 schema 的 Avro 文件，命名为 `user`：

```json
{
  "type": "record",
  "name": "user",
  "fields": [
    {
      "name": "id",
      "type": "long"
    },
    {
      "name": "name",
      "type": "string"
    }
  ]
}
```

### 步骤 2. 创建一个外部 Stage

使用您自己的 S3 bucket 和凭据创建一个外部 stage，用于存储您的 Avro 文件。

```sql
CREATE STAGE avro_query_stage
URL = 's3://load/avro/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 3. 查询 Avro 文件

#### 基本查询

直接从 stage 查询 Avro 文件：

```sql
SELECT
    CAST($1:id AS INT) AS id,
    $1:name AS name
FROM @avro_query_stage
(
    FILE_FORMAT => 'AVRO',
    PATTERN => '.*[.]avro'
);
```

### 查询元数据

直接从 stage 查询 Avro 文件，包括元数据列，如 `metadata$filename` 和 `metadata$file_row_number`：

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    CAST($1:id AS INT) AS id,
    $1:name AS name
FROM @avro_query_stage
(
    FILE_FORMAT => 'AVRO',
    PATTERN => '.*[.]avro'
);
```

## 类型映射到 Variant

Databend 中的 Variants 存储为 JSONB。虽然大多数 Avro 类型都可以直接映射，但需要考虑一些特殊情况：

*   **时间类型**: `TimeMillis` 和 `TimeMicros` 映射到 `INT64`，因为 JSONB 没有原生 Time 类型。用户在处理这些值时应注意原始类型。
*   **Decimal 类型**: Decimals 加载为 `DECIMAL128` 或 `DECIMAL256`。如果精度超过支持的限制，可能会发生错误。
*   **Enum 类型**: Avro `ENUM` 类型映射到 Databend 中的 `STRING` 值。