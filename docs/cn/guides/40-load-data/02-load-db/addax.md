---
title: Addax
---

[Addax](https://github.com/wgzhao/Addax) 是一个通用的开源 ETL（Extract, Transform, Load）工具，最初源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)。它擅长在各种 RDBMS（Relational Database Management Systems）和 NoSQL 数据库之间无缝传输数据，是高效数据迁移的理想解决方案。

有关 Addax 的系统要求、下载和部署步骤，请参阅其[入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了详细的设置和使用说明。

### DatabendReader 与 DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的集成插件，可与 Databend 无缝集成。DatabendReader 插件用于从 Databend 读取数据。Databend 兼容 MySQL 客户端协议，因此你也可以使用 MySQLReader 插件从 Databend 检索数据。

### 教程

- [使用 Addax 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-addax)
