---
title: 使用工具加载数据
---

Databend 提供了与主要数据导入工具集成的连接器和插件，确保高效的数据同步。请参阅下表了解支持的工具及其 Databend 连接器。

:::info
这些连接器也支持 Databend Cloud。有关设置说明，请访问：[连接到计算集群](/guides/cloud/using-databend-cloud/warehouses/#connecting) 
:::

| 工具      	| 插件 / 连接器                                                                                                                                                 	|
|-----------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Addax     	| [DatabendReader](https://wgzhao.github.io/Addax/develop/reader/databendreader/) &  [DatabendWriter](https://wgzhao.github.io/Addax/develop/writer/databendwriter/) 	|
| Airbyte   	| [datafuselabs/destination-databend:alpha](https://hub.docker.com/r/airbyte/destination-databend)                                                                   	|
| DataX     	| [DatabendWriter](https://github.com/alibaba/DataX/blob/master/databendwriter/doc/databendwriter.md)                                                                	|
| dbt       	| [dbt-databend-cloud](https://github.com/databendcloud/dbt-databend)                                                                                                	|
| Debezium       	| [debezium-server-databend](https://github.com/databendcloud/debezium-server-databend)                                                                                    	|
| Flink CDC 	| [Flink SQL connector for Databend](https://github.com/databendcloud/flink-connector-databend)                                                                      	|
| Kafka     	| [bend-ingest-kafka](https://github.com/databendcloud/bend-ingest-kafka)                                                                                            	|
| Vector    	| [Databend sink](https://vector.dev/docs/reference/configuration/sinks/databend/)                                                                                   	|