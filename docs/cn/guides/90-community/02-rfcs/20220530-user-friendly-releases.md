---
title: 用户友好的发布
description: 用户友好发布的RFC
---

- RFC PR: [datafuselabs/databend#5665](https://github.com/databendlabs/databend/pull/5665)
- Tracking Issue: [datafuselabs/databend#5681](https://github.com/databendlabs/databend/issues/5681)

# 概述

一个简单的用户友好发布解决方案。

# 动机

过去，Databend 发布中只包含特定的二进制文件。了解如何操作和维护 Databend 通常需要大量的讨论。

本提案旨在通过提供一些简单的提示和默认配置来改进这一过程，以帮助用户无痛地进行操作。

# 详细设计

发布目录结构大致如下：

```rust
.
├── bin
│   ├── databend-query
│   ├── databend-meta
│   └── databend-metactl (?)
├── configs
│   ├── databend-query.toml
│   └── databend-meta.toml
├── scripts/ (?)
│   ├── bootstrap.sh
│   └── benchmark.sh
└── README.txt

- `(?)` 表示可选。
```

## 必需

- `README.txt`，基本信息和重要提示，有用的链接。
- `bin`，当然，我们的二进制文件。
- `configs`，基本配置，提示配置使用并启动 Databend 服务。

## 可选

- `databend-metactl`，也许我们不再需要发布 databend-tools。
- `scripts`，用于方便的安装和部署。

# 理由和替代方案

## 为什么不使用更接近包的目录结构，如`/etc`、`/usr`？

只是为了快速浏览，用户可以非常直观地找到他们关心的内容。

切换到更类似包的目录结构也很容易，但我们目前没有足够的动力这样做。

## 其他好的实践是什么？

大多数开源数据库的发布与我们没有什么不同。然而，仍然可以找到一些好的例子。

- [`clickhouse`](https://github.com/ClickHouse/ClickHouse/releases)，类似包的目录结构，包含配置和实用程序，文档主要是一些有用的链接的集合。
- [`cayley`](https://github.com/cayleygraph/cayley/releases/)，一个显著的特点是包含了数据和查询，以帮助用户快速探索链接数据。
