---
title: 访问数据湖
---

Databend 与三种强大的数据湖技术——[Apache Hive](https://hive.apache.org/)、[Apache Iceberg](https://iceberg.apache.org/) 和 [Delta Lake](https://delta.io/) 无缝集成。这种集成通过支持数据湖功能的多个方面带来了显著优势。Databend 提供了一个多功能且全面的平台，使用户在数据湖环境中处理多样数据集时具有更大的灵活性和效率。

此外，这三种技术在 Databend 中的集成采用了不同的方法。一些技术，如 Apache Hive，在目录级别进行集成，而其他技术，如 Delta Lake，则在表引擎级别进行操作。Apache Iceberg 支持在这两个级别进行集成。基于目录的集成建立了与数据湖的集中连接，简化了跨多个表的访问和管理。另一方面，表引擎级别的集成提供了更细粒度的控制，允许在单个表级别进行定制优化和微调。

- [Apache Hive 目录](01-hive.md)
- [Apache Iceberg 目录](02-iceberg/iceberg-catalog.md)
- [Apache Iceberg 表引擎](02-iceberg/iceberg-engine.md)
- [Delta Lake 表引擎](03-delta.md)