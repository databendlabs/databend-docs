---
title: Bend Ingest 接入 Kafka
sidebar_label: Bend Ingest---

本教程将指导你通过 Docker 搭建 Kafka 环境，并使用 [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) 将 Kafka 消息加载到 Databend Cloud。

### 步骤 1：搭建 Kafka 环境

在 9092 端口运行 Apache Kafka Docker 容器：

```shell
MacBook-Air:~ eric$ docker run -d \
>   --name kafka \
>   -p 9092:9092 \
>   apache/kafka:latest
Unable to find image 'apache/kafka:latest' locally
latest: Pulling from apache/kafka
...
```

### 步骤 2：创建 Topic 并生产消息

1. 进入 Kafka 容器：

```shell
MacBook-Air:~ eric$ docker exec --workdir /opt/kafka/bin/ -it kafka sh
```

2. 创建名为 `test-topic` 的 Topic：

```shell
/opt/kafka/bin $ ./kafka-topics.sh --bootstrap-server localhost:9092 --create --topic test-topic
Created topic test-topic.
```

3. 使用控制台 Producer 向 `test-topic` 推送消息：

```shell
/opt/kafka/bin $ ./kafka-console-producer.sh --bootstrap-server localhost:9092 --topic test-topic
```

4. 输入 JSON 消息：

```json
{"id": 1, "name": "Alice", "age": 30}
{"id": 2, "name": "Bob", "age": 25}
```

5. 输入完成后按 Ctrl+C 停止 Producer。

### 步骤 3：在 Databend Cloud 中创建表

```sql
CREATE DATABASE doc;

CREATE    TABLE databend_topic (
          id INT NOT NULL,
          name VARCHAR NOT NULL,
          age INT NOT NULL
          ) ENGINE=FUSE;
```

### 步骤 4：安装并运行 bend-ingest-kafka

1. 安装 bend-ingest-kafka：

```shell
go install  github.com/databendcloud/bend-ingest-kafka@latest
```

2. 执行以下命令，将 `test-topic` 中的消息写入 Databend Cloud 目标表：

```shell
MacBook-Air:~ eric$ bend-ingest-kafka \
>   --kafka-bootstrap-servers="localhost:9092" \
>   --kafka-topic="test-topic" \
>   --databend-dsn="<your-dsn>" \
>   --databend-table="doc.databend_topic" \
>   --data-format="json"
INFO[0000] Starting worker worker-0
...
```

3. 使用 BendSQL 连接 Databend Cloud 验证数据：

```bash
cloudapp@(eric)/doc> SELECT * FROM databend_topic;

-[ RECORD 1 ]-----------------------------------
  id: 1
name: Alice
 age: 30
-[ RECORD 2 ]-----------------------------------
  id: 2
name: Bob
 age: 25
```

4. 如需以 RAW 模式加载消息，请运行：

```bash
bend-ingest-kafka \
  --kafka-bootstrap-servers="localhost:9092" \
  --kafka-topic="test-topic" \
  --databend-dsn="<your-dsn>" \
  --is-json-transform=false 
```

会在 `doc` 数据库生成新表 `test_ingest`，示例数据如下：

```bash
cloudapp@(eric)/doc> SELECT * FROM test_ingest;

-[ RECORD 1 ]-----------------------------------
           uuid: 17f9e56e-19ba-4d42-88a0-e16b27815d04
        koffset: 0
     kpartition: 0
       raw_data: {"age":30,"id":1,"name":"Alice"}
record_metadata: {"create_time":"2024-08-27T19:10:45.888Z",...}
       add_time: 2024-08-27 19:12:55.081444
-[ RECORD 2 ]-----------------------------------
           uuid: 0f57f71a-32ee-4df3-b75e-d123b9a91543
        koffset: 1
     kpartition: 0
       raw_data: {"age":25,"id":2,"name":"Bob"}
record_metadata: {"create_time":"2024-08-27T19:10:52.946Z",...}
       add_time: 2024-08-27 19:12:55.081470
```
