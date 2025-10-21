---
title: 表引擎
---

Databend 提供了多种表引擎（Table Engine），让您无需移动数据即可在性能与互操作性之间取得平衡。每种引擎都针对特定场景进行了优化——从 Databend 的原生 Fuse 存储到外部数据湖格式。

## 可用引擎

| 引擎 | 最适合 | 亮点 |
| ------ | -------- | ---------- |
| [Fuse 引擎表](fuse) | Databend 原生表 | 基于快照的存储、自动聚类、变更跟踪 |
| [Apache Iceberg™ 表](iceberg) | Lakehouse 目录 | 时间回溯（Time Travel）、模式演进、REST/Hive/存储目录 |
| [Apache Hive 表](hive) | Hive 元存储数据 | 通过外部表查询 Hive 管理的数据存储 |
| [Delta Lake 引擎](delta) | Delta Lake 数据集 | 在对象存储中读取具备 ACID 保证的 Delta 表 |

## 选择引擎

- 若您直接在 Databend 内部管理数据，并希望获得最佳存储与查询性能，请使用 **Fuse**。
- 若您已通过 Iceberg 目录管理数据集，并需要紧密的 Lakehouse 集成，请选择 **Iceberg**。
- 若您依赖现有 Hive Metastore，但想使用 Databend 的查询引擎，请配置 **Hive**。
- 若您希望就地分析 Delta Lake 表而无需将其摄取到 Fuse，请选择 **Delta**。