---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) 是一个开源的分布式事件流平台，允许您发布和订阅记录流。它旨在处理高吞吐量、容错和实时数据馈送。Kafka 实现了各种应用程序之间的无缝通信，使其成为构建数据管道和流数据处理应用程序的理想选择。

Databend 提供了以下插件和工具，用于从 Kafka topics 提取数据：

- [databend-kafka-connect](#databend-kafka-connect)
- [bend-ingest-kafka](#bend-ingest-kafka)

## databend-kafka-connect

[databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 是一个专为 Databend 设计的 Kafka Connect sink connector 插件。此插件支持从 Kafka topics 直接无缝地将数据传输到 Databend tables 中，从而以最少的配置实现实时数据提取。databend-kafka-connect 的主要功能包括：

- 根据数据模式自动在 Databend 中创建 tables。
- 支持 **Append Only** 和 **Upsert** 写入模式。
- 随着传入数据结构的变化，自动调整 Databend tables 的模式。

要下载 databend-kafka-connect 并了解有关该插件的更多信息，请访问 [GitHub 存储库](https://github.com/databendcloud/databend-kafka-connect) 并参阅 README 以获取详细说明。

## bend-ingest-kafka

[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 是一种高性能数据提取工具，专门用于将数据从 Kafka topics 有效地加载到 Databend tables 中。它支持两种主要的操作模式：JSON Transform Mode 和 Raw Mode，以满足不同的数据提取需求。bend-ingest-kafka 的主要功能包括：

- 支持两种模式：**JSON Transform Mode**，它根据数据模式将 Kafka JSON 数据直接映射到 Databend tables，以及 **Raw Mode**，它提取原始 Kafka 数据，同时捕获完整的 Kafka 记录元数据。
- 提供可配置的批量处理设置，用于大小和间隔，确保高效且可扩展的数据提取。

要下载 bend-ingest-kafka 并了解有关该工具的更多信息，请访问 [GitHub 存储库](https://github.com/databendcloud/bend-ingest-kafka) 并参阅 README 以获取详细说明。

## 教程

- [使用 bend-ingest-kafka 从 Kafka 加载](/tutorials/load/kafka-bend-ingest-kafka)
- [使用 databend-kafka-connect 从 Kafka 加载](/tutorials/load/kafka-databend-kafka-connect)
