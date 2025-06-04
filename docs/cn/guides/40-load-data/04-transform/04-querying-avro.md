---
title: 在阶段中查询 Avro 文件
sidebar_label: Avro
---

## 在阶段中查询 Avro 文件

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

* **返回格式**：每行作为单个变体对象（引用为 `$1`）
* **访问方法**：使用路径表达式 `$1:column_name`
* **示例**：`SELECT $1:id, $1:name FROM @stage_name`
* **关键特性**：
  * 必须通过路径表示法访问字段
  * 类型相关操作需显式转换（如 `CAST($1:id AS INT)`）
  * Avro 模式映射为变体结构
  * 整行数据表示为单个变体对象
:::

## Avro 查询功能概述

Databend 支持直接从阶段查询 Avro 文件，无需预先加载到表中即可实现灵活的数据探索和转换。

*   **变体表示**：Avro 文件的每行数据视为变体对象（通过 `$1` 引用），支持访问嵌套结构
*   **类型映射**：Avro 类型直接映射为 Databend 的变体类型
*   **元数据访问**：可通过 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 获取源文件及行号信息

## 教程

本教程演示如何查询阶段中的 Avro 文件。

### 步骤 1. 准备 Avro 文件

创建包含以下模式的 Avro 文件（模式名 `user`）：

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

### 步骤 2. 创建外部阶段

使用存储 Avro 文件的 S3 存储桶和凭证创建外部阶段：

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

从阶段直接查询 Avro 文件：

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

#### 元数据查询

查询时包含元数据列（`METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER`）：

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

## 类型映射到变体

Databend 将变体存储为 JSONB 格式，多数 Avro 类型可直接映射，但需注意：

*   **时间类型**：`TimeMillis`/`TimeMicros` 映射为 `INT64`（JSONB 无原生时间类型），使用时需注意原始类型
*   **十进制类型**：转换为 `DECIMAL128` 或 `DECIMAL256`，精度超限将报错
*   **枚举类型**：Avro `ENUM` 映射为 `STRING` 值