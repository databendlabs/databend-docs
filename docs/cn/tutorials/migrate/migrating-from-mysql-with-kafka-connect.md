---
title: 使用 Kafka Connect 从 MySQL 迁移
sidebar_label: 'MySQL → Databend: Kafka Connect'
---

> **功能**: CDC, 增量, 全量加载

本教程展示了如何使用 Kafka Connect 构建从 MySQL 到 Databend 的实时数据管道。

## 概述

Kafka Connect 是一个在 Apache Kafka 和其他系统之间可靠且大规模地流式传输数据的工具。它通过标准化 Kafka 数据的传入和传出，简化了实时数据管道的构建。对于 MySQL 到 Databend 的迁移，Kafka Connect 提供了一个无缝的解决方案，可以实现：

- 从 MySQL 到 Databend 的实时数据同步
- 自动模式演变和表创建
- 支持新数据捕获和现有数据的更新

迁移管道由两个主要组件组成：

- **MySQL JDBC Source Connector**: 从 MySQL 读取数据并将其发布到 Kafka topics
- **Databend Sink Connector**: 从 Kafka topics 消费数据并将其写入 Databend

## 前提条件

- 包含要迁移数据的 MySQL 数据库
- 已安装的 Apache Kafka ([Kafka 快速入门指南](https://kafka.apache.org/quickstart))
- 正在运行的 Databend 实例
- SQL 和命令行的基本知识

## 步骤 1：设置 Kafka Connect

Kafka Connect 支持两种执行模式：Standalone 和 Distributed。在本教程中，我们将使用 Standalone 模式，这种模式更简单，适合测试。

### 配置 Kafka Connect

在 Kafka `config` 目录中创建一个基本的 worker 配置文件 `connect-standalone.properties`：

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

### 安装所需组件

1. 从 Confluent Hub 下载 [Kafka Connect JDBC](https://www.confluent.io/hub/confluentinc/kafka-connect-jdbc) 插件，并将其解压到 Kafka `libs` 目录

2. 下载 [MySQL JDBC Driver](https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.32/) 并将 JAR 文件复制到相同的 `libs` 目录

### 创建 MySQL Source 配置

在 Kafka `config` 目录中创建一个文件 `mysql-source.properties`，内容如下：

```properties
name=mysql-source
connector.class=io.confluent.connect.jdbc.JdbcSourceConnector
tasks.max=1

# Connection settings
connection.url=jdbc:mysql://localhost:3306/your_database?useSSL=false
connection.user=your_username
connection.password=your_password

# Table selection and topic mapping
table.whitelist=your_database.your_table
topics=mysql_data

# Sync mode configuration
mode=incrementing
incrementing.column.name=id

# Polling frequency
poll.interval.ms=5000
```

将以下值替换为您的实际 MySQL 配置：
- `your_database`: 您的 MySQL 数据库名称
- `your_username`: MySQL 用户名
- `your_password`: MySQL 密码
- `your_table`: 您要迁移的表

### 同步模式

MySQL Source Connector 支持三种同步模式：

1. **Incrementing Mode**: 最适合具有自动递增 ID 列的表
   ```properties
   mode=incrementing
   incrementing.column.name=id
   ```

2. **Timestamp Mode**: 最适合捕获插入和更新
   ```properties
   mode=timestamp
   timestamp.column.name=updated_at
   ```

3. **Timestamp+Incrementing Mode**: 对于所有更改最可靠
   ```properties
   mode=timestamp+incrementing
   incrementing.column.name=id
   timestamp.column.name=updated_at
   ```

## 步骤 3：配置 Databend Sink Connector

### 安装所需组件

1. 下载 [Databend Kafka Connector](https://github.com/databendcloud/databend-kafka-connect/releases) 并将其放置在 Kafka `libs` 目录中

2. 下载 [Databend JDBC Driver](https://central.sonatype.com/artifact/com.databend/databend-jdbc/) 并将其复制到 Kafka `libs` 目录

### 创建 Databend Sink 配置

在 Kafka `config` 目录中创建一个文件 `databend-sink.properties`：

```properties
name=databend-sink
connector.class=com.databend.kafka.connect.DatabendSinkConnector

# Connection settings
connection.url=jdbc:databend://localhost:8000
connection.user=databend
connection.password=databend
connection.database=default

# Topic to table mapping
topics=mysql_data
table.name.format=${topic}

# Table management
auto.create=true
auto.evolve=true

# Write behavior
insert.mode=upsert
pk.mode=record_value
pk.fields=id
batch.size=1000
```

根据您的环境需要调整 Databend 连接设置。

## 步骤 4：启动迁移管道

使用两个连接器配置启动 Kafka Connect：

```shell
bin/connect-standalone.sh config/connect-standalone.properties \
    config/mysql-source.properties \
    config/databend-sink.properties
```

## 步骤 5：验证迁移

### 检查数据同步

1. **监控 Kafka Connect 日志**

   ```shell
   tail -f /path/to/kafka/logs/connect.log
   ```

2. **验证 Databend 中的数据**

   连接到您的 Databend 实例并运行：

   ```sql
   SELECT * FROM mysql_data LIMIT 10;
   ```

### 测试模式演变

如果您向 MySQL 表中添加新列，则模式更改将自动传播到 Databend：

1. **在 MySQL 中添加列**

   ```sql
   ALTER TABLE your_table ADD COLUMN new_field VARCHAR(100);
   ```

2. **验证 Databend 中的模式更新**

   ```sql
   DESC mysql_data;
   ```

### 测试更新操作

要测试更新，请确保您正在使用 timestamp 或 timestamp+incrementing 模式：

1. **更新您的 MySQL 连接器配置**

   如果您的表具有时间戳列，请编辑 `mysql-source.properties` 以使用 timestamp+incrementing 模式。

2. **更新 MySQL 中的数据**

   ```sql
   UPDATE your_table SET some_column='new value' WHERE id=1;
   ```

3. **验证 Databend 中的更新**

   ```sql
   SELECT * FROM mysql_data WHERE id=1;
   ```

## Databend Kafka Connect 的主要功能

1. **自动表和列创建**: 通过 `auto.create` 和 `auto.evolve` 设置，表和列会根据 Kafka topic 数据自动创建

2. **模式支持**: 支持 Avro、JSON Schema 和 Protobuf 输入数据格式（需要 Schema Registry）

3. **多种写入模式**: 支持 `insert` 和 `upsert` 写入模式

4. **多任务支持**: 可以运行多个任务以提高性能

5. **高可用性**: 在分布式模式下，工作负载会自动平衡，具有动态伸缩和容错能力

## 故障排除

- **连接器未启动**: 检查 Kafka Connect 日志以查找错误
- **Databend 中没有数据**: 使用 Kafka 控制台消费者验证 topic 是否存在并包含数据
- **模式问题**: 确保 `auto.create` 和 `auto.evolve` 设置为 `true`
