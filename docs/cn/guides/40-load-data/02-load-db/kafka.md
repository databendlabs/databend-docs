---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) 是一个开源的分布式事件流处理平台，允许您发布和订阅记录流。它旨在处理高吞吐量、容错和实时数据流。Kafka 使得不同应用程序之间的无缝通信成为可能，是构建数据管道和流数据处理应用程序的理想选择。

Databend 提供了以下插件和工具，用于从 Kafka 主题中摄取数据：

- [databend-kafka-connect](#databend-kafka-connect)
- [bend-ingest-kafka](#bend-ingest-kafka)

## databend-kafka-connect

[databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) 是一个专为 Databend 设计的 Kafka Connect 接收器连接器插件。该插件能够将数据从 Kafka 主题直接无缝传输到 Databend 表中，实现实时数据摄取且配置简单。databend-kafka-connect 的主要特性包括：

- 根据数据模式自动在 Databend 中创建表。
- 支持**仅追加**和**更新插入**两种写入模式。
- 随着传入数据结构的变化，自动调整 Databend 表的模式。

要下载 databend-kafka-connect 并了解更多关于该插件的信息，请访问 [GitHub 仓库](https://github.com/databendcloud/databend-kafka-connect) 并参考 README 获取详细说明。

## bend-ingest-kafka

[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 是一个高性能的数据摄取工具，专门设计用于高效地将数据从 Kafka 主题加载到 Databend 表中。它支持两种主要操作模式：JSON 转换模式和原始模式，以满足不同的数据摄取需求。bend-ingest-kafka 的主要特性包括：

- 支持两种模式：**JSON 转换模式**，直接根据数据模式将 Kafka 的 JSON 数据映射到 Databend 表；**原始模式**，摄取原始 Kafka 数据同时捕获完整的 Kafka 记录元数据。
- 提供可配置的批处理设置，包括大小和间隔，确保数据摄取的高效和可扩展性。

要下载 bend-ingest-kafka 并了解更多关于该工具的信息，请访问 [GitHub 仓库](https://github.com/databendcloud/bend-ingest-kafka) 并参考 README 获取详细说明。

## 示例

本示例假设 Kafka 中的数据如下所示，并解释如何使用 bend-ingest-kafka 工具将数据加载到 Databend 中。

```json
{
  "employee_id": 10,
  "salary": 30000,
  "rating": 4.8,
  "name": "Eric",
  "address": "123 King Street",
  "skills": ["Java", "Python"],
  "projects": ["Project A", "Project B"],
  "hire_date": "2011-03-06",
  "last_update": "2016-04-04 11:30:00"
}
```

### 步骤 1. 在 Databend 中创建表

在摄取数据之前，您需要在 Databend 中创建一个与 Kafka 数据结构相匹配的表。

```sql
CREATE TABLE employee_data (
  employee_id Int64,
  salary UInt64,
  rating Float64,
  name String,
  address String,
  skills Array(String),
  projects Array(String),
  hire_date Date,
  last_update DateTime
);
```

### 步骤 2. 运行 bend-ingest-kafka

表创建完成后，执行带有必要参数的 bend-ingest-kafka 命令以启动数据加载过程。该命令将启动数据摄取器，持续监控您的 Kafka 主题，消费数据并将其插入到 Databend 中指定的表。

```bash
bend-ingest-kafka \
  --kafka-bootstrap-servers="127.0.0.1:9092,127.0.0.2:9092" \
  --kafka-topic="Your Topic" \
  --kafka-consumer-group="Consumer Group" \
  --databend-dsn="http://root:root@127.0.0.1:8000" \
  --databend-table="default.employee_data" \
  --data-format="json" \
  --batch-size=100000 \
  --batch-max-interval=300s
```

| 参数                       | 描述                                                                                          |
|---------------------------|-----------------------------------------------------------------------------------------------------|
| --kafka-bootstrap-servers | 逗号分隔的 Kafka 引导服务器列表，用于连接。                                       |
| --kafka-topic             | 要从中摄取数据的 Kafka 主题。                                                |
| --kafka-consumer-group    | Kafka 消费者加入的消费组。                                                       |
| --databend-dsn            | 连接到 Databend 的数据源名称 (DSN)。格式：`http(s)://username:password@host:port`。  |
| --databend-table          | 数据将被插入的目标 Databend 表。                                           |
| --data-format             | 正在摄取的数据格式。                                                               |
| --batch-size              | 摄取过程中每批记录的数量。                                                    |
| --batch-max-interval      | 刷新一批数据前的最大等待间隔（以秒为单位）。                                   |