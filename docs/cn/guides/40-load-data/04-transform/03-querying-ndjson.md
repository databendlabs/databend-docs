---
title: 查询暂存区（Stage）中的 NDJSON 文件
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

**NDJSON 的优点：**
- **流式友好**：可以逐行解析，无需将整个文件加载到内存中
- **兼容大数据**：广泛用于日志文件、数据导出和 ETL Pipeline
- **易于处理**：每一行都是一个独立的 JSON 对象，支持并行处理

## 语法

- [将行作为 Variant 查询](./index.md#query-rows-as-variants)
- [查询元数据](./index.md#query-metadata)

## 教程

### 第 1 步：创建外部暂存区（Stage）

使用你自己的 S3 存储桶和凭据创建一个外部暂存区（Stage），你的 NDJSON 文件就存储在这里。
```sql
CREATE STAGE ndjson_query_stage 
URL = 's3://load/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### 第 2 步：创建自定义 NDJSON 文件格式

```sql
CREATE FILE FORMAT ndjson_query_format 
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- 更多 NDJSON 文件格式选项，请参考 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

### 第 3 步：查询 NDJSON 文件

现在你可以直接从暂存区（Stage）查询 NDJSON 文件。此示例从每个 JSON 对象中提取 `title` 和 `author` 字段：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

**说明：**
- `$1:title` 和 `$1:author`：从 JSON 对象中提取特定字段。`$1` 代表整个 JSON 对象（作为 Variant 类型），`:field_name` 用于访问单个字段。
- `@ndjson_query_stage`：引用在第 1 步中创建的外部暂存区（Stage）。
- `FILE_FORMAT => 'ndjson_query_format'`：使用在第 2 步中定义的自定义文件格式。
- `PATTERN => '.*[.]ndjson'`：正则表达式模式，匹配所有以 `.ndjson` 结尾的文件。

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

## 相关文档

- [加载 NDJSON 文件](../03-load-semistructured/03-load-ndjson.md) - 如何将 NDJSON 数据加载到表中
- [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options) - 完整的 NDJSON 格式配置
- [CREATE STAGE](/sql/sql-commands/ddl/stage/ddl-create-stage) - 管理外部和内部暂存区（Stage）