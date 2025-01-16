---
title: MySQL
---

This guide introduces how to migrate data from MySQL to Databend. Databend supports two main migration approaches: batch loading and continuous data sync.

## Batch Loading

To migrate data from MySQL to Databend in batches, you can use tools such as Addax or DataX. 

### Addax

[Addax](https://github.com/wgzhao/Addax), originally derived from Alibaba's [DataX](https://github.com/alibaba/DataX), is a versatile open-source ETL (Extract, Transform, Load) tool. It excels at seamlessly transferring data between diverse RDBMS (Relational Database Management Systems) and NoSQL databases, making it an optimal solution for efficient data migration.

For information about the system requirements, download, and deployment steps for Addax, refer to Addax's [Getting Started Guide](https://github.com/wgzhao/Addax#getting-started). The guide provides detailed instructions and guidelines for setting up and using Addax.

#### DatabendReader & DatabendWriter

DatabendReader and DatabendWriter are integrated plugins of Addax, allowing seamless integration with Databend. The DatabendReader plugin enables reading data from Databend. Databend provides compatibility with the MySQL client protocol, so you can also use the [MySQLReader](https://wgzhao.github.io/Addax/develop/reader/mysqlreader/) plugin to retrieve data from Databend. For more information about DatabendReader, see https://wgzhao.github.io/Addax/develop/reader/databendreader/

### DataX

[DataX](https://github.com/alibaba/DataX) is an open-source data integration tool developed by Alibaba. It is designed to efficiently and reliably transfer data between various data storage systems and platforms, such as relational databases, big data platforms, and cloud storage services. DataX supports a wide range of data sources and data sinks, including but not limited to MySQL, Oracle, SQL Server, PostgreSQL, HDFS, Hive, HBase, MongoDB, and more.

:::tip
[Apache DolphinScheduler](https://dolphinscheduler.apache.org/) now has added support for Databend as a data source. This enhancement enables you to leverage DolphinScheduler for managing DataX tasks and effortlessly load data from MySQL to Databend.
:::

For information about the system requirements, download, and deployment steps for DataX, refer to DataX's [Quick Start Guide](https://github.com/alibaba/DataX/blob/master/userGuid.md). The guide provides detailed instructions and guidelines for setting up and using DataX.

#### DatabendWriter

DatabendWriter is an integrated plugin of DataX, which means it comes pre-installed and does not require any manual installation. It acts as a seamless connector that enables the effortless transfer of data from other databases to Databend. With DatabendWriter, you can leverage the capabilities of DataX to efficiently load data from various databases into Databend. 

DatabendWriter supports two operational modes: INSERT (default) and REPLACE. In INSERT Mode, new data is added while conflicts with existing records are prevented to maintain data integrity. On the other hand, the REPLACE Mode prioritizes data consistency by replacing existing records with newer data in case of conflicts.

If you need more information about DatabendWriter and its functionalities, you can refer to the documentation available at https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md

## Continuous Sync with CDC

To migrate data from MySQL to Databend in real-time, you can use Change Data Capture (CDC) tools such as Debezium or Flink CDC.

### Debezium

[Debezium](https://debezium.io/) is a set of distributed services to capture changes in your databases so that your applications can see those changes and respond to them. Debezium records all row-level changes within each database table in a change event stream, and applications simply read these streams to see the change events in the same order in which they occurred.

[debezium-server-databend](https://github.com/databendcloud/debezium-server-databend) is a lightweight CDC tool developed by Databend, based on Debezium Engine. Its purpose is to capture real-time changes in relational databases and deliver them as event streams to ultimately write the data into the target database Databend. This tool provides a simple way to monitor and capture database changes, transforming them into consumable events without the need for large data infrastructures like Flink, Kafka, or Spark.

debezium-server-databend can be installed independently without the need for installing Debezium beforehand. Once you have decided to install debezium-server-databend, you have two options available. The first one is to install it from source by downloading the source code and building it yourself. Alternatively, you can opt for a more straightforward installation process using Docker.

#### Installing debezium-server-databend from Source

Before you start, make sure JDK 11 and Maven are installed on your system.

1. Clone the project:

```bash
git clone https://github.com/databendcloud/debezium-server-databend.git
```

2. Change into the project's root directory:

```bash
cd debezium-server-databend
```

3. Build and package debezium server:

```go
mvn -Passembly -Dmaven.test.skip package
```

4. Once the build is completed, unzip the server distribution package:

```bash
unzip debezium-server-databend-dist/target/debezium-server-databend-dist*.zip -d databendDist
```

5. Enter the extracted folder:

```bash
cd databendDist
```

6. Create a file named _application.properties_ in the _conf_ folder with the content in the sample [here](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example), and modify the configurations according to your specific requirements. For description of the available parameters, see this [page](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md).

```bash
nano conf/application.properties
```

7. Use the provided script to start the tool:

```bash
bash run.sh
```

#### Installing debezium-server-databend with Docker

Before you start, make sure Docker and Docker Compose are installed on your system.

1. Create a file named _application.properties_ in the _conf_ folder with the content in the sample [here](https://github.com/databendcloud/debezium-server-databend/blob/main/debezium-server-databend-dist/src/main/resources/distro/conf/application.properties.example), and modify the configurations according to your specific requirements. For description of the available Databend parameters, see this [page](https://github.com/databendcloud/debezium-server-databend/blob/main/docs/docs.md).

```bash
nano conf/application.properties
```

2. Create a file named _docker-compose.yml_ with the following content:

```dockerfile
version: '2.1'
services:
  debezium:
    image: ghcr.io/databendcloud/debezium-server-databend:pr-2
    ports:
      - "8080:8080"
      - "8083:8083"
    volumes:
      - $PWD/conf:/app/conf
      - $PWD/data:/app/data
```

3. Open a terminal or command-line interface and navigate to the directory containing the _docker-compose.yml_ file.

4. Use the following command to start the tool:

```bash
docker-compose up -d
```

### Flink CDC

[Apache Flink](https://github.com/apache/flink) CDC (Change Data Capture) refers to the capability of Apache Flink to capture and process real-time data changes from various sources using SQL-based queries. CDC allows you to monitor and capture data modifications (inserts, updates, and deletes) happening in a database or streaming system and react to those changes in real time. You can utilize the [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend) to load data from other databases in real-time into Databend. The Flink SQL connector for Databend offers a connector that integrates Flink's stream processing capabilities with Databend. By configuring this connector, you can capture data changes from various databases as streams and load them into Databend for processing and analysis in real-time.

#### Downloading & Installing Connector

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

- [Migrating from MySQL with Addax](/tutorials/migrate/migrating-from-mysql-with-addax)
- [Migrating from MySQL with DataX](/tutorials/migrate/migrating-from-mysql-with-datax)
- [Migrating from MySQL with Debezium](/tutorials/migrate/migrating-from-mysql-with-debezium)
- [Migrating from MySQL with Flink CDC](/tutorials/migrate/migrating-from-mysql-with-flink-cdc)