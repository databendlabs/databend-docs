---
title: Flink CDC
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.1.70"/>

[Apache Flink](https://github.com/apache/flink) CDC (Change Data Capture) refers to the capability of Apache Flink to capture and process real-time data changes from various sources using SQL-based queries. CDC allows you to monitor and capture data modifications (inserts, updates, and deletes) happening in a database or streaming system and react to those changes in real time. You can utilize the [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend) to load data from other databases in real-time into Databend. The Flink SQL connector for Databend offers a connector that integrates Flink's stream processing capabilities with Databend. By configuring this connector, you can capture data changes from various databases as streams and load them into Databend for processing and analysis in real-time.

## Downloading & Installing Connector

To download and install the Flink SQL connector for Databend, follow these steps:

1. Download and set up Flink: Before installing the Flink SQL connector for Databend, ensure that you have downloaded and set up Flink on your system. You can download Flink from the official website: https://flink.apache.org/downloads/

2. Download the connector: Visit the releases page of the Flink SQL connector for Databend on GitHub: [https://github.com/databendcloud/flink-connector-databend/releases](https://github.com/databendcloud/flink-connector-databend/releases). Download the latest version of the connector (e.g., flink-connector-databend-0.0.2.jar).

   Please note that you can also compile the Flink SQL connector for Databend from source:

   ```shell
   git clone https://github.com/databendcloud/flink-connector-databend
   cd flink-connector-databend
   mvn clean install -DskipTests
   ```

3. Move the JAR file: Once you have downloaded the connector, move the JAR file to the lib folder in your Flink installation directory. For example, if you have Flink version 1.16.0 installed, move the JAR file to the flink-1.16.0/lib/ directory.

## Tutorials

- [Migrating from MySQL with Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)