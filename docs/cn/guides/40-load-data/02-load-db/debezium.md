---
title: Debezium
---

[Debezium](https://debezium.io/) 是一组分布式服务，用于捕获数据库中的更改，以便您的应用程序可以看到这些更改并对其做出响应。Debezium 记录每个数据库表中的所有行级更改，并将其作为变更事件流，应用程序只需读取这些流即可按发生顺序查看变更事件。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是 Databend 基于 Debezium Engine 开发的一款轻量级 CDC 工具。其目的是捕获关系数据库中的实时更改，并将其作为事件流传递，最终将数据写入目标数据库 Databend。该工具提供了一种简单的方式来监控和捕获数据库更改，将其转换为可消费的事件，无需像 Flink、Kafka 或 Spark 这样的大型数据基础设施。

## 安装 debezium-server-databend

debezium-server-databend 可以独立安装，无需事先安装 Debezium。一旦决定安装 debezium-server-databend，您有两种选择。第一种是从源代码安装，通过下载源代码并自行构建。另一种是使用 Docker 进行更简单的安装过程。

### 从源代码安装

在开始之前，请确保您的系统上已安装 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 进入项目的根目录：

```bash
cd debezium-server-databend
```

3. 构建并打包 debezium 服务器：

```go
mvn -Passembly -Dmaven.test.skip package
```

4. 构建完成后，解压服务器分发包：

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. 进入解压后的文件夹：

```bash
cd databendDist
```

6. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，内容参考[这里](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并根据您的具体需求修改配置。可用参数的描述见[此页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 使用提供的脚本启动工具：

```bash
bash run.sh
```

### 使用 Docker 安装

在开始之前，请确保您的系统上已安装 Docker 和 Docker Compose。

1. 在 _conf_ 文件夹中创建一个名为 _application.properties_ 的文件，内容参考[这里](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)，并根据您的具体需求修改配置。Databend 参数的描述见[此页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建一个名为 _docker-compose.yml_ 的文件，内容如下：

```dockerfile
version: '2.1'
services:
  debezium:
    image: ghcr.io/databendcloud/debezium-server-databend:pr-2
    ports:
      - "8080:8080"
      - "8083:8083"
    volumes:
      - $PWD/conf:/app/conf
      - $PWD/data:/app/data
```

3. 打开终端或命令行界面，导航到包含 _docker-compose.yml_ 文件的目录。

4. 使用以下命令启动工具：

```bash
docker-compose up -d
```

## 使用示例

本节演示了将数据从 MySQL 加载到 Databend 的一般步骤，并假设您已经有一个本地运行的 MySQL 实例。

### 步骤 1. 在 MySQL 中准备数据

在 MySQL 中创建一个数据库和一个表，并向表中插入示例数据。

```sql
CREATE DATABASE mydb;
USE mydb;

CREATE TABLE products (id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255) NOT NULL,description VARCHAR(512));
ALTER TABLE products AUTO_INCREMENT = 10;

INSERT INTO products VALUES (default,"scooter","Small 2-wheel scooter"),
(default,"car battery","12V car battery"),
(default,"12-pack drill bits","12-pack of drill bits with sizes ranging from #40 to #3"),
(default,"hammer","12oz carpenter's hammer"),
(default,"hammer","14oz carpenter's hammer"),
(default,"hammer","16oz carpenter's hammer"),
(default,"rocks","box of assorted rocks"),
(default,"jacket","water-proof black wind breaker"),
(default,"cloud","test for databend"),
(default,"spare tire","24 inch spare tire");
```

### 步骤 2. 在 Databend 中创建数据库

在 Databend 中创建相应的数据库。请注意，您不需要创建与 MySQL 中对应的表。

```sql
CREATE DATABASE debezium;
```

### 步骤 3. 创建 application.properties

创建 _application.properties_ 文件，然后启动 debezium-server-databend。关于如何安装和启动该工具，请参见[安装 debezium-server-databend](#installing-debezium-server-databend)。

首次启动时，该工具会使用指定的批量大小从 MySQL 到 Databend 进行全量同步。因此，成功复制后，MySQL 中的数据现在在 Databend 中可见。

```text title='application.properties'
debezium.sink.type=databend
debezium.sink.databend.upsert=true
debezium.sink.databend.upsert-keep-deletes=false
debezium.sink.databend.database.databaseName=debezium
debezium.sink.databend.database.url=jdbc:databend://<your-databend-host>:<port>
debezium.sink.databend.database.username=<your-username>
debezium.sink.databend.database.password=<your-password>
debezium.sink.databend.database.primaryKey=id
debezium.sink.databend.database.tableName=products
debezium.sink.databend.database.param.ssl=true

# 启用事件模式
debezium.format.value.schemas.enable=true
debezium.format.key.schemas.enable=true
debezium.format.value=json
debezium.format.key=json

# mysql 源
debezium.source.connector.class=io.debezium.connector.mysql.MySqlConnector
debezium.source.offset.storage.file.filename=data/offsets.dat
debezium.source.offset.flush.interval.ms=60000

debezium.source.database.hostname=127.0.0.1
debezium.source.database.port=3306
debezium.source.database.user=root
debezium.source.database.password=123456
debezium.source.database.dbname=mydb
debezium.source.database.server.name=from_mysql
debezium.source.include.schema.changes=false
debezium.source.table.include.list=mydb.products
# debezium.source.database.ssl.mode=required
# 不使用 Kafka，使用本地文件存储检查点
debezium.source.database.history=io.debezium.relational.history.FileDatabaseHistory
debezium.source.database.history.file.filename=data/status.dat
# 进行事件展平。解包消息！
debezium.transforms=unwrap
debezium.transforms.unwrap.type=io.debezium.transforms.ExtractNewRecordState
debezium.transforms.unwrap.delete.handling.mode=rewrite
debezium.transforms.unwrap.drop.tombstones=true

# ############ 设置日志级别 ############
quarkus.log.level=INFO
# 忽略 Jetty 的警告级别以下的消息，因为它有点冗长
quarkus.log.category."org.eclipse.jetty".level=WARN
```

一切就绪！如果您查询 Databend 中的 products 表，您将看到 MySQL 中的数据已成功同步。您可以自由地在 MySQL 中进行插入、更新或删除操作，并观察到 Databend 中相应的更改。