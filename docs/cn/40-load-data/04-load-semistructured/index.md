---
title: 加载半结构化数据
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

## 什么是半结构化数据？ {#what-is-semi-structured-data}

半结构化数据是一种不符合传统数据库严格结构的数据形式，但仍包含标签或标记来分隔语义元素，并强制记录和字段的层次结构。

Databend 提供了高效且用户友好的半结构化数据加载功能。它支持多种格式，如 **Parquet**、**CSV**、**TSV** 和 **NDJSON**。

此外，Databend 允许在加载过程中即时转换数据。
从半结构化数据格式复制是将数据加载到 Databend 中最常见的方式，它非常高效且易于使用。


## 支持的格式 {#supported-formats}

Databend 支持使用 `COPY INTO` 命令加载的几种半结构化数据格式：

- **Parquet**：一种列式存储格式，非常适合优化数据存储和检索。它最适合复杂的数据结构，并提供高效的数据压缩和编码方案。

- **CSV (逗号分隔值)**：一种简单的格式，广泛用于数据交换。CSV 文件易于读写，但可能不适合复杂的层次数据结构。

- **TSV (制表符分隔值)**：类似于 CSV，但使用制表符作为分隔符。它通常用于结构简单且需要非逗号分隔符的数据。

- **NDJSON (换行符分隔 JSON)**：该格式表示每个 JSON 对象由换行符分隔的 JSON 数据。它特别适用于流式传输大型数据集和处理频繁变化的数据。NDJSON 通过将数据分解为可管理的、以行为单位的块，促进了大量数据的处理。


有关如何加载半结构化数据的详细说明，请查看以下主题：
<IndexOverviewList />