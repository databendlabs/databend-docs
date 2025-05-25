---
title: 在 Stage 中查询 NDJSON 文件
sidebar_label: NDJSON
---

## 查询 Stage 中的 NDJSON 文件

语法：
```sql
SELECT [<别名>.]$1:<列名> [, $1:<列名> ...] 
FROM {@<stage名称>[/<路径>] [<表别名>] | '<uri>' [<表别名>]} 
[( 
  [<连接参数>],
  [ PATTERN => '<正则表达式>'],
  [ FILE_FORMAT => 'NDJSON| <自定义格式名称>'],
  [ FILES => ( '<文件名>' [ , '<文件名>' ] [ , ... ] ) ]
)]
```


:::info 提示
**查询返回内容说明：**

* **返回格式**：每行作为单个 variant 对象（引用为 `$1`）
* **访问方式**：使用路径表达式 `$1:列名`
* **示例**：`SELECT $1:title, $1:author FROM @stage名称`
* **关键特性**：
  * 必须使用路径表示法访问特定字段
  * 类型转换需显式声明（例如 `CAST($1:id AS INT)`）
  * 每行 NDJSON 被解析为完整 JSON 对象
  * 整行数据表示为单个 variant 对象
:::

## 教程

### 步骤 1. 创建外部 Stage

在存储 NDJSON 文件的 S3 存储桶中创建外部 stage，需配置访问凭证。
```sql
CREATE STAGE ndjson_query_stage 
URL = 's3://load/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<您的访问密钥ID>' 
    SECRET_ACCESS_KEY = '<您的秘密访问密钥>'
);
```

### 步骤 2. 创建自定义 NDJSON 文件格式

```sql
CREATE FILE FORMAT ndjson_query_format 
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- 更多 NDJSON 文件格式选项参见 [NDJSON 文件格式选项](/sql/sql-reference/file-format-options#ndjson-options)

### 步骤 3. 查询 NDJSON 文件

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

若 NDJSON 文件采用 gzip 压缩，可使用以下查询：

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```
### 带元数据的查询

直接从 stage 查询 NDJSON 文件，包含 `METADATA$FILENAME` 和 `METADATA$FILE_ROW_NUMBER` 等元数据列：

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