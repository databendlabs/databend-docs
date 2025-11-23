---
title: 用户友好发布
description: 关于用户友好的发布的 RFC
---

- RFC PR: [datafuselabs/databend#5665](https://github.com/databendlabs/databend/pull/5665)
- Tracking Issue: [datafuselabs/databend#5681](https://github.com/databendlabs/databend/issues/5681)

# 概要

一个简单的用户友好的发布解决方案。

# 动机

过去，Databend 的发布中只包含特定的二进制文件。理解如何操作和维护 Databend 通常需要大量的讨论。

本提案旨在通过提供一些简单的提示和默认配置来改进这个过程，以帮助用户轻松完成。

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
- `configs`，基本配置，用于提示配置用法并启动 Databend 服务。

## 可选

- `databend-metactl`，也许我们不再需要发布 databend-tools。
- `scripts`，为了方便安装和部署。

# 理由和替代方案

## 为什么不使用更接近于 `/etc`、`/usr` 这样的包的目录结构？

只是为了快速浏览，用户可以非常直观地找到他们关心的内容。

切换到更像包的目录结构也很容易，但我们目前没有足够的动力这样做。

## 还有哪些好的实践？

大多数开源数据库的发布与我们没有什么不同。但是，仍然可以找到一些好的例子。

- [`clickhouse`](https://github.com/ClickHouse/ClickHouse/releases)，类似包的目录结构，包括配置和实用程序，文档主要是有用链接的集合。
- [`cayley`](https://github.com/cayleygraph/cayley/releases/)，一个值得注意的亮点是包含数据和查询，以帮助用户快速探索链接数据。
