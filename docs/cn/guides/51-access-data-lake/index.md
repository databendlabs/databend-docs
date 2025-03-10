---
title: 访问数据湖
---

Databend 与三种强大的数据湖技术——[Apache Hive](https://hive.apache.org/)、[Apache Iceberg](https://iceberg.apache.org/) 和 [Delta Lake](https://delta.io/)——实现了无缝集成。这种集成带来了显著的优势，支持数据湖功能的多个方面。Databend 提供了一个多功能且全面的平台，使用户在数据湖环境中处理多样化数据集时能够获得更高的灵活性和效率。

此外，Databend 中这三种技术的集成方式各不相同。例如，Apache Hive 在目录级别集成，而 Delta Lake 则在表引擎级别操作。基于目录的集成建立了与数据湖的集中连接，简化了对多个表的访问和管理。另一方面，表引擎级别的集成提供了更细粒度的控制，允许在单个表级别进行定制优化和微调。

- [Apache Hive 目录](01-hive.md)
- [Apache Iceberg 目录](02-iceberg.md)
- [Delta Lake 表引擎](03-delta.md)