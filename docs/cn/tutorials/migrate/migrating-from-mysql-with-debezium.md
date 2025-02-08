<think>
好的，我需要把用户提供的关于使用Debezium从MySQL迁移数据到Databend的教程翻译成简体中文。首先，我要仔细阅读整个内容，理解每个步骤和配置项的作用。用户特别强调要保留Markdown结构，不改变链接和代码块，所以我要特别注意这些部分不要动。

首先，标题部分“Migrating from MySQL with Debezium”应该翻译为“使用 Debezium 从 MySQL 迁移数据”，保持简洁明了。接下来，各个步骤的标题需要准确翻译，比如“Step 1. Prepare Data in MySQL”翻译成“步骤 1. 在 MySQL 中准备数据”。注意用户要求保留数据库术语不翻译，比如“MySQL”和“Databend”保持不变。

在代码块部分，比如SQL语句和配置文件，我需要确保不修改任何内容，包括注释和参数设置。例如，`CREATE DATABASE mydb;` 保持原样，只翻译周围的说明文字。同时，注意用户提到的特定词汇翻译，比如“warehouse”要翻译为“计算集群”，“time travel”翻译为“时间回溯”等。

配置文件的翻译需要特别注意属性键（如`debezium.sink.type`）不能改动，而值中的中文部分要正确翻译。例如，`debezium.sink.databend.database.username=<your-username>`中的占位符保持不变，只翻译注释或说明部分。

用户还提到保留HTML标签如`<Notes>`，所以在翻译过程中要检查是否有这样的标签并保持原样。此外，确保不添加或删除空行，保持原有的换行结构。

在翻译过程中，可能会遇到一些技术术语需要确认，比如“upsert”通常不翻译，保持原样。同时，注意用户对“Self-Hosted”翻译为“私有化部署”，“Databend Cloud”等专有名词不翻译。

最后，完成翻译后要通读一遍，检查是否符合所有规则，特别是结构是否与原文一致，代码块和链接是否正确保留，以及特定术语的翻译是否准确。确保没有遗漏任何部分，并且格式正确，以便在渲染时显示良好。
</think>

---
title: 使用 Debezium 从 MySQL 迁移数据
---

在本教程中，您将使用 Debezium 将数据从 MySQL 加载到 Databend。开始之前，请确保您已在环境中成功设置 Databend、MySQL 和 Debezium。

## 步骤 1. 在 MySQL 中准备数据

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

## 步骤 2. 在 Databend 中创建数据库

在 Databend 中创建对应的数据库。请注意，您不需要创建与 MySQL 中对应的表。

```sql
CREATE DATABASE debezium;
```

## 步骤 3. 创建 application.properties

创建文件 _application.properties_，然后启动 debezium-server-databend。关于如何安装和启动该工具，请参阅[安装 debezium-server-databend](#installing-debezium-server-databend)。

首次启动时，该工具会使用指定的批量大小将 MySQL 中的数据全量同步到 Databend。因此，成功复制后，MySQL 中的数据现在可以在 Databend 中查看。

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

# MySQL 源配置
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
# 忽略 Jetty 的警告级别以下消息，因为它比较冗长
quarkus.log.category."org.eclipse.jetty".level=WARN
```

一切就绪！如果您在 Databend 中查询 products 表，将会看到 MySQL 中的数据已成功同步。您可以随时在 MySQL 中执行插入、更新或删除操作，并观察这些变化也会在 Databend 中反映出来。