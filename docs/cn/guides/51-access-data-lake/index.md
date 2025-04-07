---
title: 访问 Data Lake
---

Databend 与三种强大的 Data Lake 技术——[Apache Hive](https://hive.apache.org/)、[Apache Iceberg](https://iceberg.apache.org/) 和 [Delta Lake](https://delta.io/) 实现了无缝集成。这种集成通过支持 Data Lake 功能的多个方面带来了独特的优势。Databend 提供了一个通用且全面的平台，使用户能够在 Data Lake 环境中更灵活、更高效地处理各种数据集。

此外，这三种技术在 Databend 中的集成具有不同的方法。有些（如 Apache Hive）在 catalog 级别集成，而另一些（如 Delta Lake）则在表引擎级别运行。基于 catalog 的集成建立了与 Data Lake 的集中连接，从而简化了跨多个表的访问和管理。另一方面，表引擎级别的集成提供了更精细的控制，允许在单个表级别进行定制优化和微调。

- [Apache Hive Catalog](01-hive.md)
- [Apache Iceberg Catalog](02-iceberg.md)
- [Delta Lake Table Engine](03-delta.md)