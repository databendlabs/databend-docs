---
title: 使用 Debezium 从 MySQL 迁移数据
---

在本教程中，您将使用 Debezium 将数据从 MySQL 加载到 Databend。开始之前，请确保您已在环境中成功部署 Databend、MySQL 和 Debezium。

## 步骤 1. 在 MySQL 中准备数据 {#step-1-prepare-data-in-mysql}

在 MySQL 中创建数据库和表，并插入示例数据。

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

## 步骤 2. 在 Databend 中创建数据库 {#step-2-create-database-in-databend}

在 Databend 中创建对应的数据库。请注意，您无需创建与 MySQL 对应的表。

```sql
CREATE DATABASE debezium;
```

## 步骤 3. 创建 application.properties {#step-3-create-applicationproperties}

创建文件 _application.properties_，然后启动 debezium-server-databend。关于如何安装和启动该工具，请参阅[安装 debezium-server-databend](#installing-debezium-server-databend)。

首次启动时，该工具会使用指定的批处理大小将 MySQL 数据全量同步到 Databend。因此，成功复制后，MySQL 中的数据将出现在 Databend 中。

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

# MySQL 源
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
# 执行事件扁平化。解包消息！
debezium.transforms=unwrap
debezium.transforms.unwrap.type=io.debezium.transforms.ExtractNewRecordState
debezium.transforms.unwrap.delete.handling.mode=rewrite
debezium.transforms.unwrap.drop.tombstones=true

# ############ 设置日志级别 ############
quarkus.log.level=INFO
# 忽略 Jetty 的 warning 级别以下日志，因其较为冗长
quarkus.log.category."org.eclipse.jetty".level=WARN
```

一切就绪！如果您查询 Databend 中的 products 表，将会看到 MySQL 的数据已成功同步。您可以在 MySQL 中执行插入、更新或删除操作，相应的变更也会实时反映到 Databend 中。
