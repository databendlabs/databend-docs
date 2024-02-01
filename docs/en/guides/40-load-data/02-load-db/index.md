---
title: Loading Data with Tools
---

Databend offers connectors and plugins for integrating with major data import tools, ensuring efficient data synchronization. See the below table for supported tools and their Databend connectors.

:::info
These connectors also support Databend Cloud. For setup instructions, visit: [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses/#connecting) 
:::

| Tool      	| Plugin / Connector                                                                                                                                                 	|
|-----------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Addax     	| [DatabendReader](https://wgzhao.github.io/Addax/develop/reader/databendreader/) &  [DatabendWriter](https://wgzhao.github.io/Addax/develop/writer/databendwriter/) 	|
| Airbyte   	| [datafuselabs/destination-databend:alpha](https://hub.docker.com/r/airbyte/destination-databend)                                                                   	|
| DataX     	| [DatabendWriter](https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md)                                                                	|
| dbt       	| [dbt-databend-cloud](https://github.com/databendcloud/dbt-databend)                                                                                                	|
| Debezium       	| [debezium-server-databend](https://github.com/databendcloud/debezium-server-databend)                                                                                    	|
| Flink CDC 	| [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend)                                                                      	|
| Kafka     	| [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka)                                                                                            	|
| Vector    	| [Databend sink](https://vector.dev/docs/reference/configuration/sinks/databend/)                                                                                   	|
