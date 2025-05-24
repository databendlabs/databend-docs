---
title: DataX
---

[DataX](https://github.com/alibaba/DataX) 是阿里巴巴开发的一款开源数据集成工具。它旨在高效、可靠地在各种数据存储系统和平台之间传输数据，例如关系型数据库、大数据平台和云存储服务。DataX 支持广泛的数据源和数据接收端，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现已添加对 Databend 作为数据源的支持。此增强功能使您能够利用 DolphinScheduler 管理 DataX 任务，并轻松地将数据从 MySQL 加载到 Databend。
:::

有关 DataX 的系统要求、下载和部署步骤的信息，请参阅 DataX 的 [快速入门指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了设置和使用 DataX 的详细说明和指导。

### DatabendWriter

DatabendWriter 是 DataX 的一个集成插件，这意味着它预装在 DataX 中，无需手动安装。它作为一个无缝连接器，能够轻松地将数据从其他数据库传输到 Databend。借助 DatabendWriter，您可以利用 DataX 的功能，高效地将数据从各种数据库加载到 Databend。

DatabendWriter 支持两种操作模式：INSERT (默认) 和 REPLACE。在 INSERT 模式下，新数据会被添加，同时防止与现有记录冲突，以维护数据完整性。另一方面，REPLACE 模式通过在发生冲突时用新数据替换现有记录来优先考虑数据一致性。

如果您需要有关 DatabendWriter 及其功能的更多信息，可以参考 https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md 上的文档。

### 教程

- [使用 DataX 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-datax)