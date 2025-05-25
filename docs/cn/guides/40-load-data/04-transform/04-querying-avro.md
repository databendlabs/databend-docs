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

:::info 提示
**查询返回内容说明：**

* **返回格式**：每行作为单个 variant 对象 (引用为 `$1`)
* **访问方法**：使用路径表达式 `$1:column_name`
* **示例**：`SELECT $1:id, $1:name FROM @stage_name`
* **关键特性**：
  * 必须使用路径表示法访问特定字段
  * 类型转换需用于特定类型操作 (例如 `CAST($1:id AS INT)`)
  * Avro 模式映射为 variant 结构
  * 整行表示为单个 variant 对象
:::

## Avro 查询功能概述

Databend 提供对直接从 stage 查询 Avro 文件的全面支持，无需先将数据加载到表中即可实现灵活的数据探索和转换。

*   **Variant 表示**：Avro 文件中的每行被视为一个 variant，通过 `$1` 引用，可灵活访问 Avro 数据中的嵌套结构。
*   **类型映射**：每个 Avro 类型映射到 Databend 中对应的 variant 类型。
*   **元数据访问**：可访问 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列，获取有关源文件和行的额外上下文。

## 教程

本教程演示如何查询存储在 stage 中的 Avro 文件。

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

创建一个外部 stage，使用您自己的 S3 存储桶和凭证，其中存储了您的 Avro 文件。

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

### 包含元数据的查询

直接从 stage 查询 Avro 文件，包括 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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

Databend 中的 variant 以 JSONB 格式存储。虽然大多数 Avro 类型可直接映射，但需注意以下特殊情况：

*   **时间类型**：`TimeMillis` 和 `TimeMicros` 映射为 `INT64`，因为 JSONB 没有原生 Time 类型。处理这些值时用户应了解原始类型。
*   **Decimal 类型**：Decimal 加载为 `DECIMAL128` 或 `DECIMAL256`。如果精度超过支持限制，可能会报错。
*   **枚举类型**：Avro `ENUM` 类型映射为 Databend 中的 `STRING` 值。