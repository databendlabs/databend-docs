---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) 是一个开源的分布式事件流平台，允许您发布和订阅记录流。它旨在处理高吞吐量、容错和实时数据流。Kafka 使各种应用程序之间的无缝通信成为可能，是构建数据管道和流数据处理应用程序的理想选择。

Databend 提供了一个高效的数据摄取工具（[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka)），专门设计用于将 Kafka 中的数据加载到 Databend 中。使用这个工具，您可以无缝地将 Kafka 主题中的数据传输并插入到目标 Databend 表中，简化您的数据摄取工作流程。

## 安装 bend-ingest-kafka

要安装该工具，请确保您的计算机上安装了 Go 编程语言，然后使用 "go get" 命令如下所示：

```bash
go get https://github.com/databendcloud/bend-ingest-kafka
```
## 使用示例

本节假设您在 Kafka 中的数据如下所示，并解释了如何使用工具 bend-ingest-kafka 将数据加载到 Databend 中。

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

创建表后，执行带有所需参数的 bend-ingest-kafka 命令以启动数据加载过程。该命令将启动数据摄取器，它会持续监控您的 Kafka 主题，消费数据，并将其插入到 Databend 中指定的表中。

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

| 参数                        	| 描述                                                                                              	|
|---------------------------	|-----------------------------------------------------------------------------------------------------	|
| --kafka-bootstrap-servers 	| 用于连接的 Kafka 引导服务器的逗号分隔列表。                                                        	|
| --kafka-topic             	| 将从中摄取数据的 Kafka 主题。                                                                      	|
| --kafka-consumer-group    	| Kafka 消费者加入的消费者组。                                                                       	|
| --databend-dsn            	| 用于连接到 Databend 的数据源名称（DSN）。格式：`http(s)://username:password@host:port`。          	|
| --databend-table          	| 将插入数据的目标 Databend 表。                                                                     	|
| --data-format             	| 正在摄取的数据的格式。                                                                              	|
| --batch-size              	| 摄取过程中每批次的记录数。                                                                         	|
| --batch-max-interval      	| 在刷新批次之前等待的最大间隔时间（以秒为单位）。                                                   	|