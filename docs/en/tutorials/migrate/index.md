---
title: Data Migration to Databend
---

# Data Migration to Databend

Select your source database to find the most suitable migration method to Databend.

## MySQL to Databend

### Real-time Synchronization

| Tool | Best For |
|------|----------|
| [Debezium](/tutorials/migrate/migrating-from-mysql-with-debezium) | Capturing row-level changes with minimal latency |
| [Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc) | Complex ETL with real-time transformation |
| [Kafka Connect](/guides/load-data/kafka-to-databend) | Existing Kafka infrastructure |

### Batch Migration

| Tool | Best For |
|------|----------|
| [DataX](/tutorials/migrate/migrating-from-mysql-with-datax) | High-performance large dataset transfers |
| [Addax](/tutorials/migrate/migrating-from-mysql-with-addax) | Enhanced DataX with better performance |
| [db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver) | Efficient historical data archiving |

## Snowflake to Databend

| Tool | Best For |
|------|----------|
| [Snowflake Migration](/tutorials/migrate/migrating-from-snowflake) | Complete data warehouse transition |

## Selection Guide

- **Large datasets**: Use batch tools (DataX, ADataX)
- **Real-time needs**: Choose CDC solutions (Debezium, Flink CDC)
- **Complex transformations**: Consider Flink CDC
- **Existing Kafka**: Leverage Kafka Connect

## Related Topics

- [Loading Data](/guides/load-data/)
- [Unloading Data](/guides/unload-data/)
