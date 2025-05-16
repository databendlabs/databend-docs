---
title: 数据迁移到 Databend
---

# 数据迁移到 Databend

选择您的源数据库和迁移需求，以找到最适合迁移到 Databend 的方法。

## MySQL 到 Databend

### 何时选择实时迁移 (CDC)

> **推荐**: 对于实时迁移，我们推荐 **Debezium** 作为默认选择。

- 您需要持续的数据同步，且延迟最小
- 您需要捕获所有数据更改（插入、更新、删除）

| 工具 | 功能 | 最佳使用场景 | 选择理由 |
|------|------------|----------|-------------|
| [Debezium](/tutorials/migrate/migrating-from-mysql-with-debezium) | CDC, 全量加载 | 以最小的延迟捕获行级更改 | 您需要完整的 CDC，包括所有 DML 操作（INSERT/UPDATE/DELETE）；您希望使用基于 binlog 的复制，以最大程度地减少对源数据库的影响 |
| [Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc) | CDC, 全量加载, 转换 | 具有实时转换的复杂 ETL | 您需要在迁移期间过滤或转换数据；您需要一个可扩展的处理框架；您需要基于 SQL 的转换功能 |
| [Kafka Connect](/tutorials/migrate/migrating-from-mysql-with-kafka-connect) | CDC, 增量, 全量加载 | 现有的 Kafka 基础设施 | 您已经在使用 Kafka；您需要简单的配置；您可以使用时间戳或自增列进行增量同步 |

### 何时选择批量迁移

> **推荐**: 对于批量迁移，我们推荐 **db-archiver** 作为默认选择。

- 您需要一次性或计划的数据传输
- 您有大量的历史数据需要迁移
- 您不需要实时同步

| 工具 | 功能 | 最佳使用场景 | 选择理由 |
|------|------------|----------|-------------|
| [db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver) | 全量加载, 增量 | 高效的历史数据归档 | 您有按时间分区的数据；您需要归档历史数据；您需要一个轻量级的、专注的工具 |
| [DataX](/tutorials/migrate/migrating-from-mysql-with-datax) | 全量加载, 增量 | 高性能的大数据集传输 | 您需要大型数据集的高吞吐量；您需要并行处理能力；您需要一个成熟的、广泛使用的工具 |
| [Addax](/tutorials/migrate/migrating-from-mysql-with-addax) | 全量加载, 增量 | 增强的 DataX，具有更好的性能 | 您需要比 DataX 更好的错误处理；您希望改进监控功能；您需要更新的更新和功能 |

## Snowflake 到 Databend

### 何时选择 Snowflake 迁移

| 工具 | 功能 | 最佳使用场景 | 选择理由 |
|------|------------|----------|-------------|
| [Snowflake Migration](/tutorials/migrate/migrating-from-snowflake) | 全量加载 | 完整的数据仓库过渡 | 您需要迁移整个 Snowflake 计算集群；您希望使用 Parquet 格式进行高效的数据传输；您需要在系统之间保持模式兼容性 |

## 相关主题

- [加载数据](/guides/load-data/)
- [卸载数据](/guides/unload-data/)
