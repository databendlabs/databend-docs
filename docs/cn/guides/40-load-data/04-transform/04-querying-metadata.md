---
title: 处理文件与列元数据
sidebar_label: 元数据
---

以下是支持的文件格式可用的文件级元数据字段：

| 文件元数据                  | 类型     | 描述                                      |
| -------------------------- | ------- | ---------------------------------------- |
| `METADATA$FILENAME`        | VARCHAR | 读取行数据的源文件名                     |
| `METADATA$FILE_ROW_NUMBER` | INT     | 文件内的行号（从0开始计数）              |

这些元数据字段可用于：

- 对 Stage 的 SELECT 查询（例如 `SELECT FROM @stage`）
- `COPY INTO <table>` 语句

## 查询元数据详细指南

| 文件格式 | 指南                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| Parquet     | [使用元数据查询 Parquet 文件](./00-querying-parquet.md#query-with-metadata)         |
| CSV         | [使用元数据查询 CSV 文件](./01-querying-csv.md#query-with-metadata)                 |
| TSV         | [使用元数据查询 TSV 文件](./02-querying-tsv.md#query-with-metadata)                 |
| NDJSON      | [使用元数据查询 NDJSON 文件](./03-querying-ndjson.md#query-with-metadata)           |
| ORC         | [使用元数据查询 ORC 文件](./03-querying-orc.md#query-with-metadata)                 |
| Avro        | [使用元数据查询 Avro 文件](./04-querying-avro.md#query-with-metadata)               |