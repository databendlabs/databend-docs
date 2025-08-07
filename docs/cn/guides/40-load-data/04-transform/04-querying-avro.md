---
title: 在 Stage 中查询 Avro 文件
sidebar_label: Avro
---

## 语法：

- [将行作为 Variant 查询](./index.md#query-rows-as-variants)
- [查询元数据](./index.md#query-metadata)

## Avro 查询功能概述

Databend 全面支持直接从 Stage 查询 Avro 文件，无需先将数据加载到表中即可灵活地进行数据探索与转换。

*   **Variant 表示**：Avro 文件中的每一行都被视为一个 Variant（变体类型），通过 `$1` 引用，从而灵活访问 Avro 数据中的嵌套结构。
*   **类型映射**：每个 Avro 类型都会映射到 Databend 中对应的 Variant 类型。
*   **元数据访问**：可访问 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列，获取源文件及行的额外上下文信息。

## 教程

本教程演示如何查询存储在 Stage 中的 Avro 文件。

### 步骤 1. 准备 Avro 文件

假设有一个名为 `user` 的 Avro 文件，其 Schema 如下：

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

使用您自己的 S3 存储桶和凭证创建外部 Stage，用于存放 Avro 文件。

```sql
CREATE STAGE avro_query_stage
URL = 's3://load/avro/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 步骤 3. 查询 Avro 文件

#### 基础查询

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

直接从 Stage 查询 Avro 文件，并包含 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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

Databend 中的 Variant 以 JSONB 存储。大多数 Avro 类型可直接映射，但需注意以下特殊情况：

*   **时间类型**：`TimeMillis` 和 `TimeMicros` 映射为 `INT64`，因为 JSONB 没有原生时间类型，处理时需留意原始类型。
*   **Decimal 类型**：Decimal 加载为 `DECIMAL128` 或 `DECIMAL256`；若精度超出支持范围，将报错。
*   **枚举类型**：Avro 的 `ENUM` 类型在 Databend 中映射为 `STRING` 值。