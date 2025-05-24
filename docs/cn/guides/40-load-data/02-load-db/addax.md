---
title: Addax
---

[Addax](https://github.com/wgzhao/Addax) 源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)，是一个多功能的开源 ETL (Extract, Transform, Load) 工具。它擅长在各种 RDBMS (关系型数据库管理系统) 和 NoSQL 数据库之间无缝传输数据，是高效数据迁移的理想解决方案。

有关 Addax 的系统要求、下载和部署步骤，请参阅 Addax 的 [入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了设置和使用 Addax 的详细说明和指导。

### DatabendReader 和 DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的集成插件，允许与 Databend 无缝集成。DatabendReader 插件支持从 Databend 读取数据。Databend 兼容 MySQL 客户端协议，因此你也可以使用 [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) 插件从 Databend 检索数据。有关 DatabendReader 的更多信息，请参阅 https://wgzhao.github.io/Addax/develop/reader/databendreader/

### 教程

- [使用 Addax 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-addax)