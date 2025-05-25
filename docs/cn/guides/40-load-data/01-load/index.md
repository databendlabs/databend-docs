---
title: 从文件加载数据
---

Databend 提供了简单而强大的命令，可将数据文件加载到表中。大多数操作只需一条命令即可完成。您的数据必须采用[支持的格式](/sql/sql-reference/file-format-options)。

![数据加载与卸载概览](/img/load/load-unload.jpeg)

## 支持的文件格式

| 格式 | 类型 | 描述 |
|--------|------|-------------|
| [**CSV**](/guides/load-data/load-semistructured/load-csv)、[**TSV**](/guides/load-data/load-semistructured/load-tsv) | 分隔符 | 可自定义分隔符的文本文件 |
| [**NDJSON**](/guides/load-data/load-semistructured/load-ndjson) | 半结构化 | 每行一个 JSON 对象 |
| [**Parquet**](/guides/load-data/load-semistructured/load-parquet) | 半结构化 | 高效的列式存储格式 |
| [**ORC**](/guides/load-data/load-semistructured/load-orc) | 半结构化 | 高性能列式格式 |
| [**Avro**](/guides/load-data/load-semistructured/load-avro) | 半结构化 | 带模式的紧凑二进制格式 |

## 按文件位置加载

根据文件所在位置选择推荐的加载方法：

| 数据源 | 推荐工具 | 描述 | 文档 |
|-------------|-----------------|-------------|---------------|
| **暂存数据文件** | **COPY INTO** | 从内部/外部 stage 或用户 stage 快速高效加载 | [从 Stage 加载](stage) |
| **云存储** | **COPY INTO** | 从 Amazon S3、Google 云存储、Microsoft Azure 加载 | [从存储桶加载](s3) |
| **本地文件** | [**BendSQL**](https://github.com/databendlabs/BendSQL) | Databend 原生 CLI 工具，用于本地文件加载 | [从本地文件加载](local) |
| **远程文件** | **COPY INTO** | 从远程 HTTP/HTTPS 位置加载数据 | [从远程文件加载](http) |