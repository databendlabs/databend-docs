---
title: Kafka Connect 同步 MySQL
sidebar_label: Kafka Connect
---

> **能力**：CDC、增量、全量

本教程展示如何使用 Kafka Connect 构建从 MySQL 到 Databend 的实时数据管道。

## 概览

Kafka Connect 是在 Apache Kafka 与其他系统之间可靠大规模传输数据的工具，可标准化数据进出 Kafka。本方案通过 Kafka Connect 提供：

- 从 MySQL 到 Databend 的实时同步
- 自动 schema 演进与建表
- 既支持新增数据，也支持对既有行的更新

迁移链路包含两个组件：

- **MySQL JDBC Source Connector**：从 MySQL 读取数据写入 Kafka Topic
- **Databend Sink Connector**：从 Kafka 读取数据写入 Databend

## 前提条件

- 已有待迁移数据的 MySQL 数据库
- 已安装 Apache Kafka（参见 [Kafka 快速入门](https://kafka.apache.org/quickstart)）
- 已部署 Databend 实例
- 具备基础 SQL 与命令行知识

## 步骤 1：配置 Kafka Connect

本教程使用 Standalone 模式，便于测试。

### Worker 配置

在 Kafka `config` 目录创建 `connect-standalone.properties`：

```properties
bootstrap.servers=localhost:9092
key.converter=org.apache.kafka.connect.json.JsonConverter
value.converter=org.apache.kafka.connect.json.JsonConverter
key.converter.schemas.enable=true
value.converter.schemas.enable=true
offset.storage.file.filename=/tmp/connect.offsets
offset.flush.interval.ms=10000
```

## 步骤 2：配置 MySQL Source Connector

### 安装依赖

1. 从 Confluent Hub 下载 [Kafka Connect JDBC](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) 插件并解压到 Kafka `libs` 目录。
2. 下载 [MySQL JDBC Driver](https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.32/) 并放入同一目录。

### 创建配置

在 Kafka `config` 目录创建 `mysql-source.properties`：

```properties
name=mysql-source
connector.class=io.confluent.connect.jdbc.JdbcSourceConnector
tasks.max=1
connection.url=jdbc:mysql://localhost:3306/your_database?useSSL=false
connection.user=your_username
connection.password=your_password
table.whitelist=your_database.your_table
topics=mysql_data
mode=incrementing
incrementing.column.name=id
poll.interval.ms=5000
```

将其中 `your_database`、`your_username`、`your_password`、`your_table` 替换为真实值。

### 同步模式

MySQL Source Connector 支持三种模式：

1. **Incrementing**：适用于拥有自增 ID 的表。
   ```properties
   mode=incrementing
   incrementing.column.name=id
   ```
2. **Timestamp**：适合需要捕获插入与更新。
   ```properties
   mode=timestamp
   timestamp.column.name=updated_at
   ```
3. **Timestamp+Incrementing**：最稳妥的模式。
   ```properties
   mode=timestamp+incrementing
   incrementing.column.name=id
   timestamp.column.name=updated_at
   ```

## 步骤 3：配置 Databend Sink Connector

### 安装依赖

1. 下载 [Databend Kafka Connector](https://github.com/databendcloud/databend-kafka-connect/releases) 至 Kafka `libs`。
2. 下载 [Databend JDBC Driver](https://central.sonatype.com/artifact/com.databend/databend-jdbc/) 至同一目录。

### 创建配置

在 `config` 目录创建 `databend-sink.properties`：

```properties
name=databend-sink
connector.class=com.databend.kafka.connect.DatabendSinkConnector
connection.url=jdbc:databend://localhost:8000
connection.user=databend
connection.password=databend
connection.database=default
topics=mysql_data
table.name.format=${topic}
auto.create=true
auto.evolve=true
insert.mode=upsert
pk.mode=record_value
pk.fields=id
batch.size=1000
```

根据环境调整连接信息。

## 步骤 4：启动迁移链路

执行：

```shell
bin/connect-standalone.sh config/connect-standalone.properties \
    config/mysql-source.properties \
    config/databend-sink.properties
```

## 步骤 5：验证迁移

### 检查同步进度

1. **监控 Kafka Connect 日志**：

   ```shell
   tail -f /path/to/kafka/logs/connect.log
   ```

2. **在 Databend 中验证数据**：

   ```sql
   SELECT * FROM mysql_data LIMIT 10;
   ```

### 测试 Schema 演进

若在 MySQL 表中新增列，Schema 会自动同步：

1. 在 MySQL 中执行：

   ```sql
   ALTER TABLE your_table ADD COLUMN new_field VARCHAR(100);
   ```

2. 在 Databend 中验证：

   ```sql
   DESC mysql_data;
   ```

### 测试更新操作

确保 Source Connector 使用 timestamp 或 timestamp+incrementing 模式后：

1. 修改 `mysql-source.properties` 以启用相应模式。
2. 在 MySQL 中更新数据：

   ```sql
   UPDATE your_table SET some_column='new value' WHERE id=1;
   ```

3. 在 Databend 中确认：

   ```sql
   SELECT * FROM mysql_data WHERE id=1;
   ```

## Databend Kafka Connect 的关键特性

1. **自动建表与列创建**：`auto.create`、`auto.evolve` 自动匹配 Kafka Topic schema。
2. **Schema 支持**：兼容 Avro、JSON Schema、Protobuf（需 Schema Registry）。
3. **多种写入模式**：同时支持 `insert` 与 `upsert`。
4. **多任务支持**：可通过多任务提升吞吐。
5. **高可用**：在分布式模式下支持动态扩缩容与容错。

## 常见问题排查

- **Connector 无法启动**：检查 Kafka Connect 日志。
- **Databend 中无数据**：使用 Kafka 控制台消费数据，确认 Topic 有消息。
- **Schema 异常**：确保 `auto.create` 与 `auto.evolve` 均为 `true`。
