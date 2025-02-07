---
title: MySQL
---

This guide introduces how to migrate data from MySQL to Databend. Databend supports two main migration approaches: batch loading and continuous data sync.

| Migration Approach       | Recommended Tool             | Supported MySQL versions |
|--------------------------|------------------------------|--------------------------|
| Batch Loading            | db-archiver                  | All MySQL versions       |
| Continuous Sync with CDC | Apache Flink CDC (16.1–17.1) | MySQL 8.0 or below       |

## Batch Loading

Databend recommends using db-archiver for batch migration from MySQL.

### db-archiver

[db-archiver](https://github.com/databendcloud/db-archiver) is a migration tool developed by Databend that supports migrating data from various databases, including all versions of MySQL.

To install db-archiver:

```shell
go install github.com/databendcloud/db-archiver/cmd@latest
```

For more details about db-archiver, visit the [GitHub repository](https://github.com/databendcloud/db-archiver). To see how it works in practice, check out this tutorial: [Migrating from MySQL with db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver).

## Continuous Sync with CDC

Databend recommends using Flink CDC for real-time CDC migration from MySQL.

### Flink CDC

[Apache Flink](https://github.com/apache/flink) CDC (Change Data Capture) refers to the capability of Apache Flink to capture and process real-time data changes from various sources using SQL-based queries. CDC allows you to monitor and capture data modifications (inserts, updates, and deletes) happening in a database or streaming system and react to those changes in real time. 

You can utilize the [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend) to load data from other databases in real-time into Databend. The Flink SQL connector for Databend offers a connector that integrates Flink's stream processing capabilities with Databend. By configuring this connector, you can capture data changes from various databases as streams and load them into Databend for processing and analysis in real-time.

- Only Apache Flink CDC versions 16.1 to 17.1 are supported for migrating from MySQL to Databend.
- Supports migration only from MySQL version 8.0 or below.
- Flink Databend Connector requires Java 8 or 11.

To download and install the Flink SQL connector for Databend:

1. Download and set up Flink: Before installing the Flink SQL connector for Databend, ensure that you have downloaded and set up Flink on your system. You can download Flink from the official website: https://flink.apache.org/downloads/

2. Download the connector: Visit the releases page of the Flink SQL connector for Databend on GitHub: [https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases). Download the latest version of the connector (e.g., flink-connector-databend-0.0.2.jar).

   Please note that you can also compile the Flink SQL connector for Databend from source:

   ```shell
   git clone https://github.com/databendcloud/flink-connector-databend
   cd flink-connector-databend
   mvn clean install -DskipTests
   ```

3. Move the JAR file: Once you have downloaded the connector, move the JAR file to the lib folder in your Flink installation directory. For example, if you have Flink version 1.16.1 installed, move the JAR file to the `flink-1.16.1/lib/` directory.

For more details about the Flink SQL connector for Databend, visit the [GitHub repository](https://github.com/databendcloud/flink-connector-databend). To see how it works in practice, check out this tutorial: [Migrating from MySQL with Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc).

## Tutorials

- [Migrating from MySQL with db-archiver](/tutorials/migrate/migrating-from-mysql-with-db-archiver)
- [Migrating from MySQL with Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)