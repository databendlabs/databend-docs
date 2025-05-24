---
title: 从文件加载
---

Databend 提供了简单而强大的命令，用于将数据文件加载到表中。大多数操作只需要一个命令。您的数据必须采用 [支持的格式](/sql/sql-reference/file-format-options)。

![数据加载和卸载概述](/img/load/load-unload.jpeg)

## 支持的文件格式

| 格式 | 类型 | 描述 |
|--------|------|-------------|
| [**CSV**](/guides/load-data/load-semistructured/load-csv)、[**TSV**](/guides/load-data/load-semistructured/load-tsv) | 分隔符 | 可自定义分隔符的文本文件 |
| [**NDJSON**](/guides/load-data/load-semistructured/load-ndjson) | 半结构化 | JSON 对象，每行一个 |
| [**Parquet**](/guides/load-data/load-semistructured/load-parquet) | 半结构化 | 高效的列式存储格式 |
| [**ORC**](/guides/load-data/load-semistructured/load-orc) | 半结构化 | 高性能列式格式 |
| [**Avro**](/guides/load-data/load-semistructured/load-avro) | 半结构化 | 带有 schema 的紧凑二进制格式 |

## 按文件位置加载

选择您的文件位置以查找推荐的加载方法：

| 数据源 | 推荐工具 | 描述 | 文档 |
|-------------|-----------------|-------------|---------------|
| **Stage 中的数据文件** | **COPY INTO** | 从内部/外部 Stage 或用户 Stage 快速高效地加载 | [从 Stage 加载](stage) |
| **云存储** | **COPY INTO** | 从 Amazon S3、Google Cloud Storage、Microsoft Azure 加载 | [从 Bucket 加载](s3) |
| **本地文件** | [**BendSQL**](https://github.com/databendlabs/BendSQL) | Databend 用于本地文件加载的原生 CLI 工具 | [从本地文件加载](local) |
| **远程文件** | **COPY INTO** | 从远程 HTTP/HTTPS 位置加载数据 | [从远程文件加载](http) |