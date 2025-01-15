---
title: Loading Data with Tools
---

Databend offers connectors and plugins for integrating with major data import tools, ensuring efficient data synchronization. See the below table for supported tools and their Databend connectors.

:::info
These connectors also support Databend Cloud. For setup instructions, visit: [Connecting to a Warehouse](/guides/cloud/using-databend-cloud/warehouses/#connecting) 
:::

| Tool      	| Plugin / Connector                                                                                                                                                 	|
|-----------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Airbyte   	| [datafuselabs/destination-databend:alpha](https://hub.docker.com/r/airbyte/destination-databend)                                                                   	|
| dbt       	| [dbt-databend-cloud](https://github.com/databendcloud/dbt-databend)                                                                                                	|
| Kafka     	| [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka)                                                                                            	|
| Vector    	| [Databend sink](https://vector.dev/docs/reference/configuration/sinks/databend/)                                                                                   	|
