---
title: DataX
---

[DataX](https://github.com/alibaba/DataX) 是由阿里巴巴开发的开源数据集成工具。它旨在高效可靠地在各种数据存储系统和平台之间传输数据，例如关系数据库、大数据平台和云存储服务。DataX 支持各种数据源和数据接收器，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现在增加了对 Databend 作为数据源的支持。此增强功能使您可以利用 DolphinScheduler 管理 DataX 任务，并轻松地将数据从 MySQL 加载到 Databend。
:::

有关 DataX 的系统要求、下载和部署步骤的信息，请参阅 DataX 的 [快速入门指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了有关设置和使用 DataX 的详细说明和指南。

### DatabendWriter

DatabendWriter 是 DataX 的一个集成插件，这意味着它已预先安装，不需要任何手动安装。它充当一个无缝连接器，可以轻松地将数据从其他数据库传输到 Databend。借助 DatabendWriter，您可以利用 DataX 的功能将数据从各种数据库高效地加载到 Databend 中。

DatabendWriter 支持两种操作模式：INSERT（默认）和 REPLACE。在 INSERT 模式下，添加新数据，同时防止与现有记录冲突，以保持数据完整性。另一方面，REPLACE 模式通过在发生冲突时用较新的数据替换现有记录来优先考虑数据一致性。

如果您需要有关 DatabendWriter 及其功能的更多信息，可以参考 https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md 上的文档

### 教程

- [使用 DataX 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-datax)
