---
title: 使用文件和列元数据
sidebar_label: 元数据
---

以下文件级别的元数据字段可用于支持的文件格式：

| 文件元数据              | 类型    | 描述                                             |
|----------------------------|---------|-------------------------------------------------|
| `metadata$filename`        | VARCHAR | 读取行的文件名                               |
| `metadata$file_row_number` | INT     | 文件中的行号（从 0 开始）                        |

这些元数据字段在以下位置可用：

- 基于 Stage 的 SELECT 查询（例如，`SELECT FROM @stage`）
- `COPY INTO <table>` 语句

## 查询元数据的详细指南

| 文件格式 | 指南                                                                                             |
|-------------|---------------------------------------------------------------------------------------------------|
| Parquet     | [使用元数据查询 Parquet 文件](/docs/en/guides/40-load-data/04-transform/00-querying-parquet.md#query-with-metadata) |
| CSV         | [使用元数据查询 CSV 文件](/docs/en/guides/40-load-data/04-transform/01-querying-csv.md#query-with-metadata)     |
| TSV         | [使用元数据查询 TSV 文件](/docs/en/guides/40-load-data/04-transform/02-querying-tsv.md#query-with-metadata)     |
| NDJSON      | [使用元数据查询 NDJSON 文件](/docs/en/guides/40-load-data/04-transform/03-querying-ndjson.md#query-with-metadata) |
| ORC         | [使用元数据查询 ORC 文件](/docs/en/guides/40-load-data/04-transform/03-querying-orc.md#query-with-metadata)     |
| Avro        | [使用元数据查询 Avro 文件](/docs/en/guides/40-load-data/04-transform/04-querying-avro.md#query-with-metadata)     |