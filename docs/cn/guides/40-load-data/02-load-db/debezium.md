---
title: Debezium
---

[Debezium](https://debezium.io/) 是一套分布式服务，用于捕获数据库中的变更，以便您的应用程序可以看到这些变更并对其做出响应。Debezium 会记录每个数据库表中的所有行级别变更到一个变更事件流中，应用程序只需读取这些流，就可以按照它们发生的顺序看到变更事件。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是由 Databend 开发的基于 Debezium Engine 的轻量级 CDC 工具。其目的是捕获关系型数据库中的实时变更，并将它们作为事件流传递，最终将数据写入目标数据库 Databend。该工具提供了一种简单的方式来监控和捕获数据库变更，将它们转换为可消费的事件，无需像 Flink、Kafka 或 Spark 这样的大型数据基础设施。

## 安装 debezium-server-databend

debezium-server-databend 可以独立安装，无需事先安装 Debezium。一旦您决定安装 debezium-server-databend，您有两个选项可用。第一个是从源代码安装，下载源代码并自己构建。或者，您可以选择使用 Docker 进行更简单的安装过程。

### 从源代码安装

在开始之前，请确保您的系统上安装了 JDK 11 和 Maven。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 切换到项目的根目录：

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

6. 在 *conf* 文件夹中创建一个名为 *application.properties* 的文件，内容请参考[此处](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)的示例，并根据您的具体需求修改配置。有关可用参数的描述，请参见此[页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 使用提供的脚本启动工具：

```bash
bash run.sh
```

### 使用 Docker 安装

在开始之前，请确保您的系统上安装了 Docker 和 Docker Compose。

1. 在 *conf* 文件夹中创建一个名为 *application.properties* 的文件，内容请参考[此处](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)的示例，并根据您的具体需求修改配置。有关可用 Databend 参数的描述，请参见此[页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建一个名为 *docker-compose.yml* 的文件，内容如下：

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

3. 打开终端或命令行界面，导航到包含 *docker-compose.yml* 文件的目录。

4. 使用以下命令启动工具：

```bash
docker-compose up -d
```

## 使用示例

本节演示了将数据从 MySQL 加载到 Databend 的一般步骤，并假设您已经在本地运行了 MySQL 实例。

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

在 Databend 中创建相应的数据库。请注意，您不需要创建与 MySQL 中的表相对应的表。

```sql
CREATE DATABASE debezium;
```

### 步骤 3. 创建 application.properties

创建 *application.properties* 文件，然后启动 debezium-server-databend。有关如何安装和启动工具，请参见[安装 debezium-server-databend](#安装-debezium-server-databend)。

首次启动时，该工具会使用指定的批量大小从 MySQL 到 Databend 进行全量数据同步。因此，在成功复制后，MySQL 中的数据现在在 Databend 中可见。

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

```

```markdown
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
# 对事件进行展平处理。解包消息！
debezium.transforms=unwrap
debezium.transforms.unwrap.type=io.debezium.transforms.ExtractNewRecordState
debezium.transforms.unwrap.delete.handling.mode=rewrite
debezium.transforms.unwrap.drop.tombstones=true

# ############ 设置日志级别 ############
quarkus.log.level=INFO
# 忽略来自 Jetty 的低于警告级别的消息，因为它有点啰嗦
quarkus.log.category."org.eclipse.jetty".level=WARN
```

配置完成！如果您在 Databend 中查询 products 表，您会看到来自 MySQL 的数据已经成功同步。随意在 MySQL 中进行插入、更新或删除操作，您将观察到在 Databend 中反映出相应的变化。