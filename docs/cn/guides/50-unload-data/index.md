---
title: 从 Databend 导出数据
slug: /unload-data
---

Databend 的 `COPY INTO` 命令可以将数据导出到各种文件格式和存储位置，并提供灵活的格式化选项。

## 支持的文件格式


| 格式 | 示例语法 | 主要用途 |
|--------|---------------|------------------|
| [**导出 Parquet 文件**](/guides/unload-data/unload-parquet) | `FILE_FORMAT = (TYPE = PARQUET)` | 分析工作负载，高效存储 |
| [**导出 CSV 文件**](/guides/unload-data/unload-csv) | `FILE_FORMAT = (TYPE = CSV)` | 数据交换，通用兼容性 |
| [**导出 TSV 文件**](/guides/unload-data/unload-tsv) | `FILE_FORMAT = (TYPE = TSV)` | 包含逗号值的表格数据 |
| [**导出 NDJSON 文件**](/guides/unload-data/unload-ndjson) | `FILE_FORMAT = (TYPE = NDJSON)` | 半结构化数据，灵活模式 |

## 存储目标


| 目标 | 示例 | 使用场景 |
|-------------|---------|-------------|
| **命名 Stage** | `COPY INTO my_stage FROM my_table` | 重复导出到相同位置时使用 |
| **S3 兼容存储** | `COPY INTO 's3://bucket/path/' FROM my_table` | 使用 Amazon S3 的云对象存储 |