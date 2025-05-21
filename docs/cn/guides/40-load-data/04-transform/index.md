---
title: 查询和转换
slug: querying-stage
---

Databend 支持使用 `SELECT` 语句直接从 Stage 文件中查询和转换数据。此功能适用于用户、内部和外部 Stage，以及对象存储中的存储桶（例如，Amazon S3、Google Cloud Storage、Microsoft Azure）和通过 HTTPS 的远程服务器。它对于在数据加载之前或之后检查 Stage 文件的内容非常有用。

## 语法

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

## 参数概览

用于 Stage 文件的 `SELECT` 语句支持各种参数来控制数据访问和解析。有关每个参数的详细信息和示例，请参阅它们各自的文档部分：

- **`FILE_FORMAT`**: 指定文件格式（例如，CSV、TSV、NDJSON、PARQUET、ORC、Avro 或自定义格式）。
- **`PATTERN`**: 使用正则表达式来匹配和过滤文件名。
- **`FILES`**: 显式列出要查询的特定文件名。
- **`CASE_SENSITIVE`**: 控制 Parquet 文件中列名的大小写敏感性。
- **`table_alias`**: 为 Stage 文件分配别名，以便在查询中更轻松地引用。
- **`$col_position`**: 按位置索引（从 1 开始）选择列。
- **`connection_parameters`**: 提供外部存储的连接详细信息。
- **`uri`**: 指定远程文件的 URI。

## 支持的文件格式

| 文件格式 | 指南                                          |
| -------- | --------------------------------------------- |
| Parquet  | [查询 Parquet 文件](./00-querying-parquet.md) |
| CSV      | [查询 CSV 文件](./01-querying-csv.md)         |
| TSV      | [查询 TSV 文件](./02-querying-tsv.md)         |
| NDJSON   | [查询 NDJSON 文件](./03-querying-ndjson.md)   |
| ORC      | [查询 ORC 文件](./03-querying-orc.md)         |
| Avro     | [查询 Avro 文件](./04-querying-avro.md)       |
