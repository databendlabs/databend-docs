---
title: 使用 Debezium 从 MySQL 迁移
sidebar_label: 'MySQL → Databend: Debezium'
---

> **功能**: CDC, 全量加载  
> **✅ 推荐** 用于实时迁移，具有完整变更数据捕获

在本教程中，您将使用 Debezium 将数据从 MySQL 加载到 Databend。在开始之前，请确保您已在环境中成功设置 Databend、MySQL 和 Debezium。

## 步骤 1. 准备 MySQL 中的数据

在 MySQL 中创建一个数据库和一个表，并将示例数据插入到表中。

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

## 步骤 2. 在 Databend 中创建数据库

在 Databend 中创建相应的数据库。请注意，您无需创建与 MySQL 中的表对应的表。

```sql
CREATE DATABASE debezium;
```

## 步骤 3. 创建 application.properties

创建文件 _application.properties_，然后启动 debezium-server-databend。有关如何安装和启动该工具，请参见 [安装 debezium-server-databend](#installing-debezium-server-databend)。

首次启动时，该工具使用指定的批量大小执行从 MySQL 到 Databend 的数据完全同步。因此，成功复制后，MySQL 中的数据现在在 Databend 中可见。

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

一切就绪！如果您查询 Databend 中的 products 表，您将看到 MySQL 中的数据已成功同步。您可以随意在 MySQL 中执行插入、更新或删除操作，并且您会观察到 Databend 中也反映了相应的更改。