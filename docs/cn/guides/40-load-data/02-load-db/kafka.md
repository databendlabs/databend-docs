---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) 是一个开源的分布式事件流平台，支持发布与订阅数据记录流。该平台专为处理高吞吐量、高容错的实时数据流而设计，能够实现不同应用间的无缝通信，是构建数据管道和流数据处理应用的理想选择。

Databend 提供以下插件和工具用于从 Kafka 主题摄取数据：

- [databend-kafka-connect](#databend-kafka-connect)
- [bend-ingest-kafka](#bend-ingest-kafka)

## databend-kafka-connect

[databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 是专为 Databend 设计的 Kafka Connect 接收器连接器插件。该插件支持将 Kafka 主题数据无缝传输至 Databend 表，通过最小化配置实现实时数据摄取。主要功能包括：

- 根据数据模式自动创建 Databend 表
- 支持**仅追加（Append Only）**与**更新插入（Upsert）**写入模式
- 当数据结构变化时自动调整 Databend 表模式

下载插件及获取详细信息，请访问 [GitHub 仓库](https://github.com/databendcloud/databend-kafka-connect)并参阅 README 文档。

## bend-ingest-kafka

[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 是专为高效加载 Kafka 主题数据至 Databend 表设计的高性能摄取工具，提供两种核心操作模式：JSON 转换模式与原始模式，满足不同数据摄取需求。主要功能包括：

- 支持**JSON 转换模式（JSON Transform Mode）**：根据数据模式将 Kafka JSON 数据直接映射至 Databend 表
- 支持**原始模式（Raw Mode）**：摄取原始 Kafka 数据并捕获完整记录元数据
- 提供可配置的批处理参数（大小与间隔），确保高效可扩展的数据摄取

下载工具及获取详细信息，请访问 [GitHub 仓库](https://github.com/databendcloud/bend-ingest-kafka)并参阅 README 文档。

## 教程

- [使用 bend-ingest-kafka 从 Kafka 加载数据](/tutorials/load/kafka-bend-ingest-kafka)
- [使用 databend-kafka-connect 从 Kafka 加载数据](/tutorials/load/kafka-databend-kafka-connect)