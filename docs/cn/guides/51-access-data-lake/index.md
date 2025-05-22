---
title: 面向 Data Lakehouse 的 Databend
---

Databend 与流行的 Data Lake 技术集成，提供统一的 lakehouse 架构，将 Data Lake 的灵活性与数仓的性能相结合。

| 技术 | 集成类型 | 主要特性 | 文档 |
|------------|-----------------|--------------|---------------|
| Apache Hive | Catalog 级别 | 支持传统 Data Lake，模式注册 | [Apache Hive Catalog](01-hive.md) |
| Apache Iceberg™ | Catalog 级别 | ACID 事务，模式演化，时间回溯 | [Apache Iceberg™ Catalog](02-iceberg.md) |
| Delta Lake | Table Engine 级别 | ACID 事务，数据版本控制，模式强制 | [Delta Lake Table Engine](03-delta.md) |

这些集成使 Databend 用户能够高效地查询、分析和管理 Data Lake 和数仓环境中的各种数据集，而无需重复数据。