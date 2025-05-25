---
title: Addax
---

[Addax](https://github.com/wgzhao/Addax) 最初源自阿里巴巴的 [DataX](https://github.com/alibaba/DataX)，是一款功能强大的开源 ETL (数据提取、转换、加载) 工具。它擅长在不同类型的 RDBMS (关系型数据库管理系统) 和 NoSQL 数据库之间无缝传输数据，是实现高效数据迁移的理想解决方案。

有关 Addax 的系统要求、下载和部署步骤，请参阅 Addax 的 [入门指南](https://github.com/wgzhao/Addax#getting-started)。该指南提供了详细的安装和使用说明。

### DatabendReader 与 DatabendWriter

DatabendReader 和 DatabendWriter 是 Addax 的集成插件，可实现与 Databend 的无缝对接。DatabendReader 插件用于从 Databend 读取数据。由于 Databend 兼容 MySQL 客户端协议，您也可以使用 [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) 插件从 Databend 获取数据。有关 DatabendReader 的更多信息，请访问 https://wgzhao.github.io/Addax/develop/reader/databendreader/

### 教程

- [使用 Addax 从 MySQL 迁移数据](/tutorials/migrate/migrating-from-mysql-with-addax)