---
title: 数据迁移到 Databend
---

# 数据迁移到 Databend

选择您的源数据库和迁移需求，找到最适合迁移到 Databend 的方法。

## MySQL 到 Databend

Databend 支持从 MySQL 迁移的两种主要方法：

| 迁移方法                 | 推荐工具                     | 支持的 MySQL 版本        |
|--------------------------|------------------------------|--------------------------|
| 批量加载                 | db-archiver                  | 所有 MySQL 版本          |
| CDC 持续同步             | Debezium                     | 所有 MySQL 版本          |

### 何时选择实时迁移 (CDC)

> **推荐**：对于实时迁移，我们推荐 **Debezium** 作为默认选择。

- 您需要最小延迟的持续数据同步
- 您需要捕获所有数据变更 (插入、更新、删除)

| 工具 | 功能 | 最适合 | 选择条件 |
|------|------------|----------|-------------|
| [Debezium](/tutorials/migrate/migrating-from-mysql-with-debezium) | CDC、全量加载 | 以最小延迟捕获行级变更 | 您需要完整的 CDC 以及所有 DML 操作 (INSERT/UPDATE/DELETE)；您希望基于 binlog 的复制对源数据库影响最小 |
| [Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc) | CDC、全量加载、转换 | 具有实时转换的复杂 ETL | 您需要在迁移过程中过滤或转换数据；您需要可扩展的处理框架；您希望基于 SQL 的转换功能 |
| [Kafka Connect](/tutorials/migrate/migrating-from-mysql-with-kafka-connect) | CDC、增量、全量加载 | 现有的 Kafka 基础设施 | 您已经在使用 Kafka；您需要简单的配置；您可以使用时间戳或自增列进行增量同步 |

### 何时选择批量迁移

> **推荐**：对于批量迁移，我们推荐 **db-archiver** 作为默认选择。

- 您需要一次性或定时数据传输
- 您有大量历史数据需要迁移
- 您不需要实时同步

| 工具 | 功能 | 最适合 | 选择条件 |
|------|------------|----------|-------------|
| [db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver) | 全量加载、增量 | 高效的历史数据归档 | 您有按时间分区的数据；您需要归档历史数据；您希望使用轻量级、专注的工具 |
| [DataX](/tutorials/migrate/migrating-from-mysql-with-datax) | 全量加载、增量 | 大数据集的高性能传输 | 您需要大数据集的高吞吐量；您希望并行处理能力；您需要成熟、广泛使用的工具 |
| [Addax](/tutorials/migrate/migrating-from-mysql-with-addax) | 全量加载、增量 | 性能更好的增强版 DataX | 您需要比 DataX 更好的错误处理；您希望改进的监控功能；您需要更新的特性和功能 |

## Snowflake 到 Databend

从 Snowflake 迁移到 Databend 包含三个步骤：

1. **为 Amazon S3 配置 Snowflake Storage Integration**：在 Snowflake 和 S3 之间建立安全访问
2. **准备并导出数据到 Amazon S3**：将您的 Snowflake 数据以 Parquet 格式导出到 S3
3. **将数据加载到 Databend**：从 S3 将数据导入到 Databend

### 何时选择 Snowflake 迁移

| 工具 | 功能 | 最适合 | 选择条件 |
|------|------------|----------|-------------|
| [Snowflake 迁移](/tutorials/migrate/migrating-from-snowflake) | 全量加载 | 完整的数仓转换 | 您需要迁移整个 Snowflake 数仓；您希望使用 Parquet 格式进行高效数据传输；您需要在系统间保持 schema 兼容性 |

## 相关主题

- [加载数据](/guides/load-data/)
- [卸载数据](/guides/unload-data/)