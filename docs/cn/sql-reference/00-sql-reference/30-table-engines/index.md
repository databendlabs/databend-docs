---
title: 表引擎
---

Databend 提供了多种表引擎（Table Engine），让您无需移动数据即可在性能与互操作性之间取得平衡。每种引擎都针对特定场景进行了优化——从 Databend 的原生 Fuse 存储到外部数据湖格式。

## 可用引擎

| 引擎 | 最适合 | 亮点 |
| ------ | -------- | ---------- |
| [Fuse 引擎表](table-engines/fuse) | Databend 原生表 | 基于快照的存储、自动聚类、变更跟踪 |
| [Apache Iceberg™ 表](table-engines/iceberg) | Lakehouse 目录 | 时间回溯（Time Travel）、模式演进、REST/Hive/存储目录 |

## 选择引擎

- 若您直接在 Databend 内部管理数据，并希望获得最佳存储与查询性能，请使用 **Fuse**。
- 若您已通过 Iceberg 目录管理数据集，并需要紧密的 Lakehouse 集成，请选择 **Iceberg**。