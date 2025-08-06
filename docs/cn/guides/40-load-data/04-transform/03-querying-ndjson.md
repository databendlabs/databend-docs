---
title: 查询暂存区中的 NDJSON 文件
sidebar_label: NDJSON
---

在 Databend 中，你可以直接查询存储在暂存区（Stage）中的 NDJSON 文件，而无需先将数据加载到表中。这种方法对于数据探索、ETL 处理和即席分析等场景特别有用。

## 什么是 NDJSON？

NDJSON（Newline Delimited JSON，换行符分隔的 JSON）是一种基于 JSON 的文件格式，其中每一行都包含一个完整且有效的 JSON 对象。这种格式特别适合流式数据处理和大数据分析。

**NDJSON 文件内容示例：**
```json
{"id": 1, "title": "Database Fundamentals", "author": "John Doe", "price": 45.50, "category": "Technology"}
{"id": 2, "title": "Machine Learning in Practice", "author": "Jane Smith", "price": 68.00, "category": "AI"}
{"id": 3, "title": "Web Development Guide", "author": "Mike Johnson", "price": 52.30, "category": "Frontend"}
```

**NDJSON 的优势：**
- **流式友好**：可以逐行解析，无需将整个文件加载到内存中。
- **兼容大数据**：广泛用于日志文件、数据导出和 ETL Pipeline。
- **易于处理**：每一行都是一个独立的 JSON 对象，支持并行处理。

## 查询暂存区中的 NDJSON 文件

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


:::info 提示
**查询返回内容说明：**

* **返回格式**：每一行作为一个单独的 VARIANT 对象（通过 `$1` 引用）。
* **访问方法**：使用路径表达式 `$1:column_name`。
* **示例**：`SELECT $1:title, $1:author FROM @stage_name`。
* **主要特性**：
  * 必须使用路径表示法来访问特定字段。
  * 对于特定类型的操作，需要进行类型转换（例如，`CAST($1:id AS INT)`）。
  * 每一行 NDJSON 都被解析为一个完整的 JSON 对象。
  * 整行数据表示为一个单独的 VARIANT 对象。
:::

## 教程

### 步骤 1. 创建外部暂存区

使用你自己的 S3 存储桶和凭证创建一个外部暂存区，你的 NDJSON 文件存储在该位置。
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

- 更多 NDJSON 文件格式选项，请参考 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

### 步骤 3. 查询 NDJSON 文件

现在你可以直接从暂存区查询 NDJSON 文件。此示例从每个 JSON 对象中提取 `title` 和 `author` 字段：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

**说明：**
- `$1:title` 和 `$1:author`：从 JSON 对象中提取特定字段。`$1` 代表整个 JSON 对象（作为一个 VARIANT），`:字段名` 用于访问单个字段。
- `@ndjson_query_stage`：引用在步骤 1 中创建的外部暂存区。
- `FILE_FORMAT => 'ndjson_query_format'`：使用在步骤 2 中定义的自定义文件格式。
- `PATTERN => '.*[.]ndjson'`：匹配所有以 `.ndjson` 结尾的文件的正则表达式模式。

### 查询压缩文件

如果 NDJSON 文件使用 gzip 进行了压缩，请修改模式以匹配压缩文件：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```

**主要区别：** 模式 `.*[.]ndjson[.]gz` 匹配以 `.ndjson.gz` 结尾的文件。由于文件格式中设置了 `COMPRESSION = AUTO`，Databend 会在查询执行期间自动解压 gzip 文件。
### 带元数据查询

你还可以在查询中包含文件元数据，这对于跟踪数据血缘和调试非常有用：

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

**元数据列说明：**
- `METADATA$FILENAME`：显示每行数据来自哪个文件——在查询多个文件时非常有用。
- `METADATA$FILE_ROW_NUMBER`：显示源文件中的行号——有助于跟踪特定记录。

**使用场景：**
- **数据血缘**：跟踪每条记录来自哪个源文件。
- **调试**：通过文件和行号识别有问题的记录。
- **增量处理**：只处理特定的文件或文件中的特定范围。

## 相关文档

- [加载 NDJSON 文件](../03-load-semistructured/03-load-ndjson.md) - 如何将 NDJSON 数据加载到表中
- [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options) - 完整的 NDJSON 格式配置
- [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) - 管理外部和内部暂存区
- [查询元数据](./04-querying-metadata.md) - 关于元数据列的更多详细信息