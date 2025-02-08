---
title: MySQL
---

本指南介绍如何将数据从 MySQL 迁移到 Databend。Databend 支持两种主要的迁移方式：批量加载和持续数据同步。

| 迁移方式               | 推荐工具                     | 支持的 MySQL 版本          |
|--------------------------|------------------------------|--------------------------|
| 批量加载            | db-archiver                  | 所有 MySQL 版本       |
| CDC 实时同步 | Apache Flink CDC (16.1–17.1) | MySQL 8.0 或以下       |

## 批量加载

Databend 推荐使用 db-archiver 进行 MySQL 的批量迁移。

### db-archiver

[db-archiver](https://github.com/databendcloud/db-archiver) 是 Databend 开发的一款迁移工具，支持从包括所有版本 MySQL 在内的多种数据库迁移数据。

安装 db-archiver：

```shell
go install github.com/databendcloud/db-archiver/cmd@latest
```

有关 db-archiver 的更多详情，请访问 [GitHub 仓库](https://github.com/databendcloud/db-archiver)。要查看实际操作示例，请参阅教程：[使用 db-archiver 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-db-archiver)。

## CDC 实时同步

Databend 推荐使用 Flink CDC 进行 MySQL 的实时 CDC 迁移。

### Flink CDC

[Apache Flink](https://github.com/apache/flink) CDC（变更数据捕获）指 Apache Flink 使用基于 SQL 的查询从各种源捕获和处理实时数据变更的能力。CDC 允许您监控和捕获数据库中发生的数据修改（插入、更新和删除），并实时响应这些变更。

您可以使用 [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend) 将其他数据库的数据实时加载到 Databend。Flink SQL connector for Databend 提供了一个连接器，将 Flink 的流处理能力与 Databend 集成。通过配置此连接器，您可以将来自各种数据库的数据变更作为流捕获，并实时加载到 Databend 进行处理和分析。

- 仅支持 Apache Flink CDC 16.1 至 17.1 版本用于从 MySQL 迁移到 Databend。
- 仅支持从 MySQL 8.0 或以下版本迁移。
- Flink Databend Connector 需要 Java 8 或 11。

下载并安装 Flink SQL connector for Databend：

1. 下载并安装 Flink：在安装 Flink SQL connector for Databend 之前，请确保您已在系统上下载并安装 Flink。您可以从官方网站下载 Flink：https://flink.apache.org/downloads/

2. 下载连接器：访问 Flink SQL connector for Databend 的 GitHub 发布页面：[https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases)。下载最新版本的连接器（例如 flink-connector-databend-0.0.2.jar）。

   请注意，您也可以从源代码编译 Flink SQL connector for Databend：

   ```shell
   git clone https://github.com/databendcloud/flink-connector-databend
   cd flink-connector-databend
   mvn clean install -DskipTests
   ```

3. 移动 JAR 文件：下载连接器后，将 JAR 文件移动到 Flink 安装目录的 lib 文件夹中。例如，如果您安装了 Flink 1.16.1 版本，请将 JAR 文件移动到 `flink-1.16.1/lib/` 目录。

有关 Flink SQL connector for Databend 的更多详情，请访问 [GitHub 仓库](https://github.com/databendcloud/flink-connector-databend)。要查看实际操作示例，请参阅教程：[使用 Flink CDC 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)。

## 教程

- [使用 db-archiver 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-db-archiver)
- [使用 Flink CDC 从 MySQL 迁移](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)
