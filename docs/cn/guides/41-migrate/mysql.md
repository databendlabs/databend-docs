<think>
好的，我需要将用户提供的关于如何从MySQL迁移到Databend的文档翻译成简体中文。首先，我要仔细阅读原文，理解每个部分的内容和结构。用户特别强调要保留Markdown的结构，不改变链接和代码块，同时遵循特定的术语翻译规则。

首先，标题部分“MySQL”需要保持原样，但后面的内容需要翻译。注意用户提到的术语，比如“time travel”要翻译为“时间回溯”，“warehouse”翻译为“计算集群”，“Data Warehouse”是“数仓”，“Self-Hosted”是“私有化部署”，而“Databend Cloud”、“Vector”、“Stage”则保持不译。此外，JSON对象的键不需要翻译，但内容可能需要处理。

接下来是迁移方法的表格。表格中的内容需要准确翻译，同时保持格式不变。例如，“Batch Loading”翻译为“批量加载”，“Continuous Sync with CDC”翻译为“CDC实时同步”。工具名称如“db-archiver”和“Apache Flink CDC”不需要翻译，版本信息也要保留原样。

在“Batch Loading”部分，介绍db-archiver时，需要确保工具名称和GitHub链接不变。安装命令的代码块必须保留原样，不能有任何改动。同时，教程链接的路径也要保持不变，仅翻译显示文本。

然后是“Continuous Sync with CDC”部分，涉及Flink CDC。这里需要注意版本限制和系统要求的翻译，比如“Java 8 or 11”翻译为“Java 8或11”。安装步骤中的命令行操作和路径示例需要保持原样，确保用户能够正确复制和执行。

在教程部分，链接的路径不能改变，但显示文本需要翻译。例如，“Migrating from MySQL with db-archiver”翻译为“使用 db-archiver 从 MySQL 迁移”。

整个过程中，我需要确保不添加或删除任何空行，保持原有的换行符。同时，避免使用任何Markdown之外的格式，比如不要添加新的注释或标签。特别注意用户提到的不要包含任何`</think>

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