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
**查询返回内容说明：**

*   **返回格式**：每行作为一个独立的 Variant 对象 (引用为 `$1`)
*   **访问方法**：使用路径表达式 `$1:column_name`
*   **示例**：`SELECT $1:id, $1:name FROM @stage_name`
*   **主要特性**：
    *   必须使用路径表示法访问特定字段
    *   对于特定类型操作 (例如 `CAST($1:id AS INT)`) 需要进行类型转换
    *   Avro 模式映射到 Variant 结构
    *   整行表示为一个独立的 Variant 对象
:::

## Avro 查询功能概述

Databend 全面支持直接从 Stage 查询 Avro 文件。这允许灵活的数据探索和转换，而无需先将数据加载到表中。

*   **Variant 表示**：Avro 文件中的每一行都被视为一个 Variant，引用为 `$1`。这允许灵活访问 Avro 数据中的嵌套结构。
*   **类型映射**：每个 Avro 类型都映射到 Databend 中相应的 Variant 类型。
*   **元数据访问**：你可以访问元数据列，例如 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER`，以获取有关源文件和行的额外上下文。

## 教程

本教程演示如何查询存储在 Stage 中的 Avro 文件。

### 步骤 1. 准备 Avro 文件

考虑一个名为 `user` 的 Avro 文件，其模式如下：

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

### 步骤 2. 创建外部 Stage

使用你自己的 S3 存储桶和凭据创建外部 Stage，你的 Avro 文件将存储在此处。

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

直接从 Stage 查询 Avro 文件：

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

### 带元数据的查询

直接从 Stage 查询 Avro 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    CAST($1:id AS INT) AS id,
    $1:name AS name
FROM @avro_query_stage
(
    FILE_FORMAT => 'AVRO',
    PATTERN => '.*[.]avro'
);
```

## 类型映射到 Variant

Databend 中的 Variant 存储为 JSONB。虽然大多数 Avro 类型都可以直接映射，但仍有一些特殊注意事项：

*   **时间类型**：`TimeMillis` 和 `TimeMicros` 映射到 `INT64`，因为 JSONB 没有原生的时间类型。用户在处理这些值时应注意原始类型。
*   **Decimal 类型**：Decimal 加载为 `DECIMAL128` 或 `DECIMAL256`。如果精度超出支持的限制，可能会发生错误。
*   **Enum 类型**：Avro `ENUM` 类型映射到 Databend 中的 `STRING` 值。