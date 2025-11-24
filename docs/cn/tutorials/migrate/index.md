---
title: 规划向 Databend 的迁移
---

# 数据迁移到 Databend

请选择源数据库与迁移需求，找到最适合的 Databend 迁移方案。

## MySQL → Databend

Databend 支持两类主要迁移方式：

| 迁移方式 | 推荐工具 | 支持的 MySQL 版本 |
|----------|----------|-------------------|
| 批量加载 | db-archiver | 所有 MySQL 版本 |
| 以 CDC 实时同步 | Debezium | 所有 MySQL 版本 |

### 何时选择实时迁移（CDC）

> **推荐**：实时迁移优先选择 **Debezium**。

- 需要持续同步，延迟尽量低
- 需要捕获所有数据变更（插入、更新、删除）

| 工具 | 能力 | 最适合场景 | 适用情形 |
|------|------|------------|----------|
| [Debezium](/tutorials/migrate/migrating-from-mysql-with-debezium) | CDC、全量 | 以极低延迟捕获行级变更 | 需要完整的 INSERT/UPDATE/DELETE CDC；希望基于 binlog 的复制以降低源库压力 |
| [Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc) | CDC、全量、转换 | 复杂 ETL + 实时转换 | 迁移过程中需要过滤/转换；需要可扩展的计算框架；希望使用 SQL 完成转换 |
| [Kafka Connect](/tutorials/migrate/migrating-from-mysql-with-kafka-connect) | CDC、增量、全量 | 已有 Kafka 基础设施 | 已经使用 Kafka；需要简单配置；可以依赖时间戳或自增字段做增量同步 |

### 何时选择批量迁移

> **推荐**：批量迁移优先选择 **db-archiver**。

- 需要一次性或定期批量迁移
- 需要迁移大量历史数据
- 对实时性没有要求

| 工具 | 能力 | 最适合场景 | 适用情形 |
|------|------|------------|----------|
| [db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver) | 全量、增量 | 高效归档历史数据 | 数据按时间分区；需要归档历史；希望轻量化工具 |
| [DataX](/tutorials/migrate/migrating-from-mysql-with-datax) | 全量、增量 | 大规模数据高速迁移 | 需要高吞吐；希望并行处理；需要成熟广泛使用的工具 |
| [Addax](/tutorials/migrate/migrating-from-mysql-with-addax) | 全量、增量 | DataX 增强版，更高性能 | 相比 DataX 需要更好的错误处理；想要监控增强；希望使用更新的功能 |

## Snowflake → Databend

Snowflake 迁移 Databend 需要三步：

1. **为 Amazon S3 配置 Snowflake Storage Integration**：建立 Snowflake 与 S3 的安全访问
2. **准备并导出数据到 S3**：将 Snowflake 数据导出为 Parquet
3. **加载数据到 Databend**：从 S3 导入 Databend

### 何时选择 Snowflake 迁移

| 工具 | 能力 | 最适合场景 | 适用情形 |
|------|------|------------|----------|
| [Snowflake 迁移](/tutorials/migrate/migrating-from-snowflake) | 全量 | 整体数据仓库迁移 | 需要迁出整个 Snowflake 仓库；希望通过 Parquet 高效传输；需要保持两边的 schema 兼容 |

## 相关主题

- [加载数据](/guides/load-data/)
- [导出数据](/guides/unload-data/)
