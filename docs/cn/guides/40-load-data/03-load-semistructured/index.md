---
title: 加载半结构化格式
---

## 什么是半结构化数据？

半结构化数据包含用于分隔语义元素的标签或标记，同时不符合严格的数据库结构。Databend 使用 `COPY INTO` 命令有效地加载这些格式，并可选择进行即时数据转换。

## 支持的文件格式

| 文件格式 | 描述 | 指南 |
| ----------- | ----------- | ----- |
| **Parquet** | 高效的列式存储格式 | [加载 Parquet](load-parquet) |
| **CSV** | 逗号分隔值 | [加载 CSV](load-csv) |
| **TSV** | 制表符分隔值 | [加载 TSV](load-tsv) |
| **NDJSON** | 换行符分隔的 JSON | [加载 NDJSON](load-ndjson) |
| **ORC** | 优化的行式列式格式 | [加载 ORC](load-orc) |
| **Avro** | 带有模式定义的行式格式 | [加载 Avro](load-avro) |