---
title: 访问数据湖
---

Databend 与三种强大的数据湖技术——[Apache Hive](https://hive.apache.org/)、[Apache Iceberg](https://iceberg.apache.org/) 和 [Delta Lake](https://delta.io/) 实现了无缝集成。这种集成通过支持数据湖功能的多个方面，带来了明显的优势。Databend 提供了一个多功能且全面的平台，赋予用户在处理数据湖环境中的多样化数据集时更大的灵活性和效率。

此外，这三种技术在 Databend 中的集成特点各不相同。有些技术，如 Apache Hive，在目录级别进行集成；而像 Delta Lake 这样的技术，则在表引擎级别操作。Apache Iceberg 支持在这两个级别上的集成。基于目录的集成建立了与数据湖的中心化连接，简化了跨多个表的访问和管理。另一方面，表引擎级别的集成提供了更细粒度的控制，允许针对个别表进行定制优化和微调。

- [Apache Hive 目录](01-hive.md)
- [Apache Iceberg 目录](02-iceberg/iceberg-catalog.md)
- [Apache Iceberg 表引擎](02-iceberg/iceberg-engine.md)
- [Delta Lake 表引擎](03-delta.md)