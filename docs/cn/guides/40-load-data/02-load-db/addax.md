---
title: Addax
---

[Addax](https://github.com/wgzhao/Addax) 最初源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)，是一款多功能开源 ETL（Extract, Transform, Load）工具。它专长于在各种 RDBMS（关系数据库管理系统）和 NoSQL 数据库间无缝传输数据，是高效数据迁移的理想选择。

有关 Addax 的系统要求、下载及部署步骤，请参阅 [入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了 Addax 配置与使用的详细说明。

### DatabendReader 与 DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的内置插件，支持与 Databend 无缝集成。DatabendReader 插件用于从 Databend 读取数据。由于 Databend 兼容 MySQL 客户端协议，您也可使用 [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) 插件获取数据。更多信息请访问：https://wgzhao.github.io/Addax/develop/reader/databendreader/

### 教程

- [使用 Addax 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-addax)