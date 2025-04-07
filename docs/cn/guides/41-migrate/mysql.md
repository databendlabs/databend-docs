---
title: MySQL
---

本指南介绍如何将数据从 MySQL 迁移到 Databend。Databend 支持两种主要的迁移方法：批量加载和连续数据同步。

| 迁移方法             | 推荐工具                       | 支持的 MySQL 版本 |
|----------------------|--------------------------------|-------------------|
| 批量加载             | db-archiver                    | 所有 MySQL 版本   |
| 使用 CDC 连续同步 | Apache Flink CDC (16.1–17.1) | MySQL 8.0 或更低版本 |

## 批量加载

Databend 建议使用 db-archiver 从 MySQL 进行批量迁移。

### db-archiver

[db-archiver](https://github.com/databendcloud/db-archiver) 是 Databend 开发的迁移工具，支持从各种数据库迁移数据，包括所有版本的 MySQL。

要安装 db-archiver：

```shell
go install github.com/databendcloud/db-archiver/cmd@latest
```

有关 db-archiver 的更多详细信息，请访问 [GitHub 存储库](https://github.com/databendcloud/db-archiver)。要了解它在实践中如何工作，请查看本教程：[使用 db-archiver 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-db-archiver)。

## 使用 CDC 连续同步

Databend 建议使用 Flink CDC 从 MySQL 进行实时 CDC 迁移。

### Flink CDC

[Apache Flink](https://github.com/apache/flink) CDC（变更数据捕获）是指 Apache Flink 使用基于 SQL 的查询从各种源捕获和处理实时数据变更的能力。CDC 允许你监视和捕获数据库或流系统中发生的数据修改（插入、更新和删除），并实时对这些更改做出反应。

你可以利用 [用于 Databend 的 Flink SQL 连接器](https://github.com/databendcloud/flink-connector-databend) 将来自其他数据库的数据实时加载到 Databend 中。用于 Databend 的 Flink SQL 连接器提供了一个连接器，该连接器将 Flink 的流处理功能与 Databend 集成在一起。通过配置此连接器，你可以捕获来自各种数据库的数据更改作为流，并将它们加载到 Databend 中以进行实时处理和分析。

- 仅支持 Apache Flink CDC 16.1 到 17.1 版本从 MySQL 迁移到 Databend。
- 仅支持从 MySQL 8.0 或更低版本进行迁移。
- Flink Databend Connector 需要 Java 8 或 11。

要下载并安装用于 Databend 的 Flink SQL 连接器：

1. 下载并设置 Flink：在安装用于 Databend 的 Flink SQL 连接器之前，请确保你已在系统上下载并设置了 Flink。你可以从官方网站下载 Flink：https://flink.apache.org/downloads/

2. 下载连接器：访问 GitHub 上用于 Databend 的 Flink SQL 连接器的发布页面：[https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases)。下载最新版本的连接器（例如，flink-connector-databend-0.0.2.jar）。

   请注意，你也可以从源代码编译用于 Databend 的 Flink SQL 连接器：

   ```shell
   git clone https://github.com/databendcloud/flink-connector-databend
   cd flink-connector-databend
   mvn clean install -DskipTests
   ```

3. 移动 JAR 文件：下载连接器后，将 JAR 文件移动到 Flink 安装目录中的 lib 文件夹中。例如，如果你已安装 Flink 1.16.1 版本，请将 JAR 文件移动到 `flink-1.16.1/lib/` 目录。

有关用于 Databend 的 Flink SQL 连接器的更多详细信息，请访问 [GitHub 存储库](https://github.com/databendcloud/flink-connector-databend)。要了解它在实践中如何工作，请查看本教程：[使用 Flink CDC 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)。

## 教程

- [使用 db-archiver 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-db-archiver)
- [使用 Flink CDC 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)
