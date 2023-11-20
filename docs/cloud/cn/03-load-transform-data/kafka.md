---
title: Kafka
---


[Apache Kafka](https://kafka.apache.org/) 是一个开放源码分布式事件流媒体平台，允许您发布和订阅流记录。它旨在处理高通量、过失容忍度和实时数据源。Kafka 能够使各种应用程序之间无缝沟通，使之成为建设数据管道和流式数据处理应用程序的理想选择。

Databend 提供了一个有效的数据摄取工具 ([bend-ingest-Kafka](https://github.com/databendcloud/bend-ingest-kafka))，专门用于将 Kafka 的数据加载到 Databend。使用这个工具，您可以无缝地从 Kafka 主题传输数据并将其插入目标数据表中，简化您的数据摄取流程。

## 安装 Bend-Ingest-Kafka

若要安装工具，请确保您已在计算机上安装转向编程语言，然后使用“go get”命令显示：

```bash
go get https://github.com/databendcloud/bend-ingest-kafka
```
## 用法示例

本节假定您在 Kafka 的数据看起来如下并解释如何使用工具将数据加载到 Databend-Ingest-Kafka。

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

### 步骤 1、在 Databend 中创建一个表

在获取数据之前，您需要在数据包中创建一个与您的 Kafka 数据结构匹配的表。

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

### 步骤 2、运行 Bend-Inest-kafka

一旦表创建，执行带有所需参数的 bend-ingest-Kafka 命令来启动数据加载过程。命令将启动数据摄取器，持续监视您的 Kafka 主题，消耗数据，并将其插入指定的数据表。

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

| 参数                 	| 描述                                                                                         	|
|---------------------------	|-----------------------------------------------------------------------------------------------------	|
| --kafka-bootstrap-servers 	| Comma-separated list of Kafka bootstrap servers to connect to.                                      	|
| --kafka-topic             	| The Kafka topic from which the data will be ingested.                                               	|
| --kafka-consumer-group    	| The consumer group for Kafka consumer to join.                                                      	|
| --databend-dsn            	| The Data Source Name (DSN) to connect to Databend. Format: `http(s)://username:password@host:port`. 	|
| --databend-table          	| The target Databend table where the data will be inserted.                                          	|
| --data-format             	| The format of the data being ingested.                                                              	|
| --batch-size              	| The number of records per batch during ingestion.                                                   	|
| --batch-max-interval      	| The maximum interval (in seconds) to wait before flushing a batch.                                  	|