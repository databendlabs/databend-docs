---
title: 用户友好的发布
description: 针对用户友好发布的RFC
---

- RFC PR: [datafuselabs/databend#5665](https://github.com/datafuselabs/databend/pull/5665)
- 跟踪问题: [datafuselabs/databend#5681](https://github.com/datafuselabs/databend/issues/5681)

# 摘要

一个简单的用户友好发布解决方案。

# 动机

在过去，Databend的发布中只包含了特定的二进制文件。理解如何操作和维护Databend往往需要广泛的讨论。

这个提案旨在通过提供一些简单的提示和默认配置来改善这一过程，帮助用户轻松进行。

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
- `configs`，基本配置，提示配置使用和启动Databend服务。

## 可选

- `databend-metactl`，也许我们不再需要发布databend-tools。
- `scripts`，便于安装和部署。

# 基本原理和替代方案

## 为什么不使用更接近包的目录结构，如`/etc`、`/usr`？

只是为了让用户一瞥即可非常直观地找到他们关心的内容。

也很容易切换到更像包的目录结构，但我们目前没有足够的动机这样做。

## 还有哪些其他好的实践？

大多数开源数据库的发布与我们无异。然而，仍然可以找到一些好的例子。

- [`clickhouse`](https://github.com/ClickHouse/ClickHouse/releases)，类似包的目录结构，包括配置和实用程序，文档主要是有用链接的集合。
- [`cayley`](https://github.com/cayleygraph/cayley/releases/)，一个值得注意的亮点是包含数据和查询，帮助用户快速探索链接数据。