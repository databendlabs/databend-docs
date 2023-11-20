---
title: Debezium
---

[Debezium](https://debezium.io/) 是一套分布式服务，用于捕捉您数据库中的更改，从而使您的应用程序能够看到这些更改并作出反应。Debezium 记录每个数据库表中在更改事件流中的所有行级变化，和应用程序只是阅读这些流以按照其发生的顺序查看更改事件。

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) 是 Databend 开发的轻量 CDC 工具，基于 Debezium Engine。其目的是实时捕捉关系数据库的变化，并将其作为事件流传递，以便最终将数据写入目标数据库 Databend。这个工具提供了监测和捕获数据库更改的简单方法。将它们变成可消耗的事件，而不需要像 Flink、Kafka 或 Spark 这样的大型数据基础设施。

## 安装 debezium-server-databend

debezium-server-databend 可以独立安装，而无需事先安装 Debezium。一旦您决定安装 debezium-server-databend，您有两个可用的选项。第一个是通过下载源代码并自行构建它从源代码来安装它。或者，您可以选择使用 Docker 更直接的安装过程。

### 从源安装中

在您开始之前，请确保 JDK 11 和 Maven 安装在您的系统上。

1. 克隆项目：

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. 更改项目的根目录：

```bash
cd debezium-server-databend
```

3. 构建和打包拆解服务器：

```go
mvn -Passembly -Dmaven.test.skip package
```

4. 构建完成后，解压服务器分发包：

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. 输入提取的文件夹：

```bash
cd databendDist
```

6. 创建一个名为 *应用程序的文件。在 *conf* 带有示例 A 中内容的 [这里](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)中的* 文件夹，并根据您的具体要求修改配置。关于可用参数的描述，请参阅此 [页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

7. 使用提供的脚本启动工具：

```bash
bash run.sh
```

### 使用 Docker 安装

在你开始之前，请确保 Docker 和 Docker Compose 安装在你的系统上。

1. 创建一个名为 *应用程序的文件。在 *conf* 带有示例 A 中内容的 [这里](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example)中的* 文件夹，并根据您的具体要求修改配置。关于可用的 Databend 参数的描述，请参阅此 [页面](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md)。

```bash
nano conf/application.properties
```

2. 创建一个名为 *docker-compose.yml* 的文件，包含以下内容：

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

3. 打开终端或命令行接口并导航到包含 *docker-compose.yml* 文件的目录。

4. 使用以下命令来启动工具：

```bash
docker-compose up -d
```

## 用法示例

本节展示了将 MySQL 数据加载到 Databend 的一般步骤，并假定您已经有一个本地 MySQL 实例在运行。

### 步骤 1. 准备 MySQL 中的数据

在 MySQL 中创建一个数据库和一个表，并在表中插入样本数据。

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

在 Databend 中创建相应的数据库。请注意，您不需要创建一个与 MySQL 中的相应的表。

```sql
CREATE DATABASE debezium;
```

### 步骤 3. 创建应用程序属性

创建文件 *application.properties*, 然后启动 debezium-server-databend。关于如何安装和启动工具，见 [安装 debezium-server-databend](#installing-debezium-server-databend)

当首次启动时，工具将使用指定的批处理尺寸实现从 MySQL 到数据端的完全同步。结果，MySQL 的数据在成功复制后现在可在 Databend 中看到。

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

# enable event schemas
debezium.format.value.schemas.enable=true
debezium.format.key.schemas.enable=true
debezium.format.value=json
debezium.format.key=json

# mysql source
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
# Run without Kafka, use local file to store checkpoints
debezium.source.database.history=io.debezium.relational.history.FileDatabaseHistory
debezium.source.database.history.file.filename=data/status.dat
# do event flattening. unwrap message!
debezium.transforms=unwrap
debezium.transforms.unwrap.type=io.debezium.transforms.ExtractNewRecordState
debezium.transforms.unwrap.delete.handling.mode=rewrite
debezium.transforms.unwrap.drop.tombstones=true

# ############ SET LOG LEVELS ############
quarkus.log.level=INFO
# Ignore messages below warning level from Jetty, because it's a bit verbose
quarkus.log.category."org.eclipse.jetty".level=WARN
```

你都已设置了！如果您查询 Databend 中的产品表，您将会看到 MySQL 的数据已成功同步。请随时在 MySQL 中执行插入、更新或删除，您也将观察相应的 Databend 中反映的更改。