---
title: DataX
---

[DataX](https://github.com/alibaba/DataX) 是阿里巴巴开源的一款高效、可靠的数据集成工具，专为在不同数据存储系统与平台（如关系型数据库、大数据平台和云存储服务）之间传输数据而设计。DataX 支持丰富的数据源与目标端，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现已新增对 Databend 作为数据源的支持。这一增强功能使您能够利用 DolphinScheduler 管理 DataX 任务，轻松实现从 MySQL 到 Databend 的数据加载。
:::

有关 DataX 的系统要求、下载及部署步骤，请参阅 DataX 的 [快速入门指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了详细的安装与使用说明。

### DatabendWriter

DatabendWriter 是 DataX 的内置插件，无需手动安装即可使用。它作为无缝连接器，能够便捷地将其他数据库的数据迁移至 Databend。通过 DatabendWriter，您可以充分发挥 DataX 的能力，高效地将各类数据库的数据加载到 Databend 中。

DatabendWriter 支持两种操作模式：INSERT（默认）和 REPLACE。在 INSERT 模式下，系统会添加新数据并避免与现有记录冲突以保障数据完整性；而 REPLACE 模式则通过用新数据替换冲突记录来确保数据一致性。

如需了解更多关于 DatabendWriter 及其功能的信息，请访问：https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md

### 教程

- [使用 DataX 从 MySQL 迁移数据](/tutorials/migrate/migrating-from-mysql-with-datax)