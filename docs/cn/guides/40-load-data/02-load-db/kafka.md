---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) 是一个开源的分布式事件流平台，允许您发布和订阅记录流。它旨在处理高吞吐量、容错和实时的数据流。Kafka 实现了不同应用程序之间的无缝通信，是构建数据管道和流式数据处理应用的理想选择。

Databend 提供了以下插件和工具，用于从 Kafka 主题中摄取数据：

- [databend-kafka-connect](#databend-kafka-connect)
- [bend-ingest-kafka](#bend-ingest-kafka)

## databend-kafka-connect

[databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 是一个专为 Databend 设计的 Kafka Connect sink 连接器插件。该插件能够将数据从 Kafka 主题无缝传输到 Databend 表中，只需最少的配置即可实现实时数据摄取。databend-kafka-connect 的主要特性包括：

- 根据数据模式自动在 Databend 中创建表。
- 支持 **Append Only** 和 **Upsert** 两种写入模式。
- 随着传入数据结构的变化，自动调整 Databend 表的模式。

要下载 databend-kafka-connect 并了解有关该插件的更多信息，请访问 [GitHub 仓库](https://github.com/databendcloud/databend-kafka-connect) 并参阅 README 获取详细说明。

## bend-ingest-kafka

[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 是一款高性能的数据摄取工具，专门用于将数据从 Kafka 主题高效加载到 Databend 表中。它支持两种主要操作模式：JSON 转换模式和原始模式，以满足不同的数据摄取需求。bend-ingest-kafka 的主要特性包括：

- 支持两种模式：**JSON 转换模式**，该模式根据数据模式将 Kafka JSON 数据直接映射到 Databend 表；以及**原始模式**，该模式摄取原始 Kafka 数据，同时捕获 Kafka 记录的完整元数据。
- 提供可配置的批处理大小和间隔设置，确保高效和可扩展的数据摄取。

要下载 bend-ingest-kafka 并了解有关该工具的更多信息，请访问 [GitHub 仓库](https://github.com/databendcloud/bend-ingest-kafka) 并参阅 README 获取详细说明。

## 教程

- [使用 bend-ingest-kafka 从 Kafka 加载](/tutorials/load/kafka-bend-ingest-kafka)
- [使用 databend-kafka-connect 从 Kafka 加载](/tutorials/load/kafka-databend-kafka-connect)