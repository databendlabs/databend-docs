---
title: DataX
---

[DataX](https://github.com/alibaba/DataX) 是阿里巴巴开发的开源数据集成工具，旨在高效可靠地在各类数据存储系统与平台间传输数据，例如关系数据库、大数据平台和云存储服务。DataX 支持广泛的数据源与数据接收端，包括但不限于 MySQL、Oracle、SQL Server、PostgreSQL、HDFS、Hive、HBase、MongoDB 等。

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) 现已支持将 Databend 作为数据源。此功能使您能够利用 DolphinScheduler 管理 DataX 任务，轻松将数据从 MySQL 加载至 Databend。
:::

有关 DataX 的系统要求、下载及部署步骤，请参阅 DataX 的[快速入门指南](https://github.com/alibaba/DataX/blob/master/userGuid.md)。该指南提供了详细的配置与使用说明。

### DatabendWriter

DatabendWriter 是 DataX 的内置插件，已预装且无需手动安装。它作为无缝连接器，可将其他数据库的数据轻松传输至 Databend。借助 DatabendWriter，您能够利用 DataX 功能将各类数据库数据高效加载到 Databend。

DatabendWriter 支持两种操作模式：INSERT（默认）和 REPLACE。在 INSERT 模式下，系统在添加新数据的同时避免与现有记录冲突，确保数据完整性；REPLACE 模式则优先保障数据一致性，冲突时用新数据覆盖现有记录。

更多 DatabendWriter 功能信息，请参阅文档：  
https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md

### 教程

- [使用 DataX 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-datax)