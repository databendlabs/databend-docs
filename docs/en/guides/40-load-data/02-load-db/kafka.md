---
title: Kafka
---

[Apache Kafka](https://kafka.apache.org/) is an open-source distributed event streaming platform that allows you to publish and subscribe to streams of records. It is designed to handle high-throughput, fault-tolerant, and real-time data feeds. Kafka enables seamless communication between various applications, making it an ideal choice for building data pipelines and streaming data processing applications.

Databend provides the following plugins and tools for data ingestion from Kafka topics:

- [databend-kafka-connect](#databend-kafka-connect)
- [bend-ingest-kafka](#bend-ingest-kafka)

## databend-kafka-connect

The [databend-kafka-connect](https://github.com/databendcloud/databend-kafka-connect) is a Kafka Connect sink connector plugin designed specifically for Databend. This plugin enables seamless data transfer from Kafka topics directly into Databend tables, allowing for real-time data ingestion with minimal configuration. Key features of databend-kafka-connect include:

- Automatically creates tables in Databend based on the data schema.
- Supports both **Append Only** and **Upsert** write modes.
- Automatically adjusts the schema of Databend tables as the structure of incoming data changes.

To download databend-kafka-connect and learn more about the plugin, visit the [GitHub repository](https://github.com/databendcloud/databend-kafka-connect) and refer to the README for detailed instructions.

## bend-ingest-kafka

[bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka) is a high-performance data ingestion tool specifically designed to efficiently load data from Kafka topics into Databend tables. It supports two primary modes of operation: JSON Transform Mode and Raw Mode, catering to different data ingestion requirements. Key features of bend-ingest-kafka include:

- Supports two modes: **JSON Transform Mode**, which maps Kafka JSON data directly to Databend tables based on the data schema, and **Raw Mode**, which ingests raw Kafka data while capturing complete Kafka record metadata.
- Provides configurable batch processing settings for size and interval, ensuring efficient and scalable data ingestion.

To download bend-ingest-kafka and learn more about the tool, visit the [GitHub repository](https://github.com/databendcloud/bend-ingest-kafka) and refer to the README for detailed instructions.

## Examples

This example assumes your data in Kafka appears as follows and explains how to load data into Databend using the tool bend-ingest-kafka.

```json
{
  "employee_id": 10,
  "salary": 30000,
  "rating": 4.8,
  "name": "Eric",
  "address": "123 King Street",
  "skills": ["Java", "Python"],
  "projects": ["Project A", "Project B"],
  "hire_date": "2011-03-06",
  "last_update": "2016-04-04 11:30:00"
}
```

### Step 1. Create Table in Databend

Before ingesting data, you need to create a table in Databend that matches the structure of your Kafka data.

```sql
CREATE TABLE employee_data (
  employee_id Int64,
  salary UInt64,
  rating Float64,
  name String,
  address String,
  skills Array(String),
  projects Array(String),
  hire_date Date,
  last_update DateTime
);
```

### Step 2. Run bend-ingest-kafka

Once the table is created, execute the bend-ingest-kafka command with the required parameters to initiate the data loading process. The command will start the data ingester, which continuously monitors your Kafka topic, consumes the data, and inserts it into the specified table in Databend.

```bash
bend-ingest-kafka \
  --kafka-bootstrap-servers="127.0.0.1:9092,127.0.0.2:9092" \
  --kafka-topic="Your Topic" \
  --kafka-consumer-group="Consumer Group" \
  --databend-dsn="http://root:root@127.0.0.1:8000" \
  --databend-table="default.employee_data" \
  --data-format="json" \
  --batch-size=100000 \
  --batch-max-interval=300s
```

| Parameter                 	| Description                                                                                         	|
|---------------------------	|-----------------------------------------------------------------------------------------------------	|
| --kafka-bootstrap-servers 	| Comma-separated list of Kafka bootstrap servers to connect to.                                      	|
| --kafka-topic             	| The Kafka topic from which the data will be ingested.                                               	|
| --kafka-consumer-group    	| The consumer group for Kafka consumer to join.                                                      	|
| --databend-dsn            	| The Data Source Name (DSN) to connect to Databend. Format: `http(s)://username:password@host:port`. 	|
| --databend-table          	| The target Databend table where the data will be inserted.                                          	|
| --data-format             	| The format of the data being ingested.                                                              	|
| --batch-size              	| The number of records per batch during ingestion.                                                   	|
| --batch-max-interval      	| The maximum interval (in seconds) to wait before flushing a batch.                                  	|