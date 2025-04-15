---
title: 加载半结构化格式
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';

## 什么是半结构化数据？

半结构化数据是一种不符合传统数据库那样严格结构的数据形式，但仍然包含标签或标记来分隔语义元素并强制执行记录和字段的层次结构。

Databend 能够高效且用户友好地加载半结构化数据。它支持各种格式，如 **Parquet**、**CSV**、**TSV** 和 **NDJSON**。

此外，Databend 允许在加载过程中对数据进行即时转换。
从半结构化数据格式复制是加载数据到 Databend 的最常见方式，它非常高效且易于使用。

## 支持的格式

Databend 支持使用 `COPY INTO` 命令加载的几种半结构化数据格式：

<IndexOverviewList />