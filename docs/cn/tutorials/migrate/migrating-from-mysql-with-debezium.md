<think>
好的，我现在需要处理用户提供的关于使用Debezium将MySQL数据迁移到Databend的教程翻译任务。首先，我要仔细阅读用户提供的规则，确保翻译过程中严格遵守这些要求。

首先，用户强调必须保持Markdown的结构不变，不能添加或删除链接，也不能改变任何URL。这意味着在翻译过程中，我需要特别注意保留原有的格式，比如代码块、标题层级以及列表结构。例如，原文中的代码块部分必须原封不动，只翻译周围的说明文字。

接下来，用户提到不能修改代码块中的内容，即使看起来有错误。这需要我在翻译时特别小心，避免无意中调整代码中的任何部分，包括注释或字符串内容。例如，MySQL的INSERT语句中的产品描述必须保持原样，只翻译周围的步骤说明。

保持原有的换行和空白行也是关键。这意味着在翻译过程中，我需要确保段落之间的换行与原文一致，避免因格式问题导致文档渲染错误。同时，不能删除任何内容，包括可能存在的占位符或示例数据。

关于特定的术语翻译，用户给出了明确的指示。例如，“time travel”要翻译为“时间回溯”，“warehouse”或“Data Warehouse”要分别译为“计算集群”和“数仓”。此外，“Databend Cloud”、“Vector”、“Stage”等专有名词不需要翻译。这需要我在翻译过程中建立术语表，确保一致性。

在处理JSON文件时，用户指出`_category_.json`中的键不能翻译。因此，在遇到类似结构时，我需要仅翻译值部分，而保留键的原文。同时，必须避免添加任何新的`</think>`标签，确保输出内容完全符合用户的要求。

现在，具体到用户提供的教程内容，我需要逐步处理每个部分。标题“Migrating from MySQL with Debezium”应翻译为“使用 Debezium 从 MySQL 迁移数据”，并保留原有的Markdown结构。步骤中的代码块需要保持原样，仅翻译周围的说明文字。例如，“Step 1. Prepare Data in MySQL”翻译为“步骤 1. 在 MySQL 中准备数据”，而其中的SQL语句保持不变。

在“application.properties”部分，所有配置项和值都需保留原文，仅翻译注释和说明。例如，注释“# mysql source”应翻译为“# MySQL 源”，但配置项如“debezium.source.connector.class”保持不变。同时，注意处理像“param.ssl=true”这样的参数，确保不修改其内容。

最后，用户要求翻译后的文档保持最佳渲染格式，因此需要检查翻译后的Markdown结构是否正确，确保代码块正确缩进，标题层级无误。此外，验证所有链接和URL是否未被修改，确保技术术语的正确翻译，如“Self-Hosted”译为“私有化部署”等。

完成翻译后，我会通读整个文档，检查是否符合所有规则，特别是格式保留和术语一致性。确保没有遗漏任何部分，所有步骤清晰准确，最终提供符合用户需求的高质量翻译结果。
</think>

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