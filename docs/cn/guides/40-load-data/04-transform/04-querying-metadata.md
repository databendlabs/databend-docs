---
title: 使用文件和列元数据
sidebar_label: Metadata
---

以下文件级元数据字段适用于支持的文件格式：

| 文件元数据                 | 类型    | 描述                                     |
| -------------------------- | ------- | ---------------------------------------- |
| `METADATA$FILENAME`        | VARCHAR | 读取行的源文件名                         |
| `METADATA$FILE_ROW_NUMBER` | INT     | 文件中的行号 (从 0 开始)                 |

这些元数据字段可在以下场景中使用：

- 对 Stage 执行 SELECT 查询 (例如，`SELECT FROM @stage`)
- `COPY INTO <table>` 语句

## 查询元数据的详细指南

| 文件格式 | 指南                                                                                 |
| -------- | ------------------------------------------------------------------------------------ |
| Parquet  | [使用元数据查询 Parquet 文件](./00-querying-parquet.md#query-with-metadata)          |
| CSV      | [使用元数据查询 CSV 文件](./01-querying-csv.md#query-with-metadata)                  |
| TSV      | [使用元数据查询 TSV 文件](./02-querying-tsv.md#query-with-metadata)                  |
| NDJSON   | [使用元数据查询 NDJSON 文件](./03-querying-ndjson.md#query-with-metadata)            |
| ORC      | [使用元数据查询 ORC 文件](./03-querying-orc.md#query-with-metadata)                  |
| Avro     | [使用元数据查询 Avro 文件](./04-querying-avro.md#query-with-metadata)                |