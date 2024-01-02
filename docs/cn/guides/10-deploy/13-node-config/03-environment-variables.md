---
title: 环境变量
---

Databend 允许您使用环境变量来指向自定义配置文件并对单个配置进行精确调整，从而提供了灵活性。这一能力不仅使您能够在不干扰默认设置的情况下进行修改，而且在需要快速调整、使用容器化环境或需要保护敏感数据时特别有益。

:::note
- 并非所有配置都可以仅通过环境变量来管理。在某些情况下，可能需要在配置文件中进行调整，而不是依赖于环境变量。
:::

## 设置配置文件路径

METASRV_CONFIG_FILE 和 CONFIG_FILE 是用于指定配置文件位置的环境变量，分别对应 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 和 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml)。如果您想要偏离默认设置并选择自定义配置文件位置，这些变量使您能够指定文件的确切路径。

```sql title='示例'
export METASRV_CONFIG_FILE='/etc/databend/databend-meta.toml'
export CONFIG_FILE='/etc/databend/databend-query.toml'
```

## Meta 环境变量

下面是可用的环境变量列表，每个变量都对应映射到配置文件 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中的参数。有关每个参数的详细说明，请参见 [Meta 配置](01-metasrv-config.md)。

| 环境变量                         	| 映射到                   	|
|---------------------------------	|-------------------------	|
| METASRV_LOG_DIR                 	| log_dir                 	|
| ADMIN_API_ADDRESS               	| admin_api_address       	|
| METASRV_GRPC_API_ADDRESS        	| grpc_api_address        	|
| METASRV_GRPC_API_ADVERTISE_HOST 	| grpc_api_advertise_host 	|
| KVSRV_ID                        	| id                      	|
| KVSRV_RAFT_DIR                  	| raft_dir                	|
| KVSRV_API_PORT                  	| raft_api_port           	|
| KVSRV_LISTEN_HOST               	| raft_listen_host        	|
| KVSRV_ADVERTISE_HOST            	| raft_advertise_host     	|
| KVSRV_SINGLE                    	| single                  	|

## Query 环境变量

配置文件 [databend-query.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中的 [query] 和 [storage] 部分下的参数可以使用环境变量进行配置。环境变量的名称是通过将 QUERY 或 STORAGE 与相应的参数名称使用下划线组合而成的。

当存储服务的环境变量与 Databend 的环境变量匹配时，Databend 也接受来自存储服务的环境变量。这允许您使用最熟悉的环境变量命名约定，无需记住额外的变量名称，简化了配置过程。

例如，如果您想使用环境变量设置 S3 的访问密钥 ID，您可以选择使用 Databend 提供的 STORAGE_S3_ACCESS_KEY_ID，或者使用通常与 AWS S3 关联的众所周知的 AWS_ACCESS_KEY_ID。