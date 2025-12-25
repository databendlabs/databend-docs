---
title: 环境变量
---

Databend 允许您利用环境变量的灵活性，既可以指向自定义配置文件，也可以对单个配置进行精确调整。此功能不仅使您能够在不中断默认设置的情况下进行修改，而且在您需要快速调整、使用容器化环境或需要保护敏感数据时，也被证明特别有用。

:::note

- 并非所有配置都可以仅通过环境变量来管理。在某些情况下，调整可能需要在配置文件中进行修改，而不是依赖环境变量。
  :::

## 设置配置文件路径

METASRV_CONFIG_FILE 和 CONFIG_FILE 是用于指定配置文件 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 和 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 位置的环境变量。它们提供了一种自定义 Databend 中配置文件路径的方法。如果您想偏离默认设置并选择自定义配置文件位置，这些变量使您可以指定文件的确切路径。

```sql title='示例'
export METASRV_CONFIG_FILE='/etc/databend/databend-meta.toml'
export CONFIG_FILE='/etc/databend/databend-query.toml'
```

## Meta 环境变量

以下是可用环境变量的列表，每个变量都相应地映射到配置文件 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中的参数。有关每个参数的详细说明，请参阅 [Meta 配置](metasrv-config.md)。

| 环境变量                    | 映射到               |
| ------------------------------- | ----------------------- |
| METASRV_LOG_DIR                 | log_dir                 |
| ADMIN_API_ADDRESS               | admin_api_address       |
| METASRV_GRPC_API_ADDRESS        | grpc_api_address        |
| METASRV_GRPC_API_ADVERTISE_HOST | grpc_api_advertise_host |
| KVSRV_ID                        | id                      |
| KVSRV_RAFT_DIR                  | raft_dir                |
| KVSRV_API_PORT                  | raft_api_port           |
| KVSRV_LISTEN_HOST               | raft_listen_host        |
| KVSRV_ADVERTISE_HOST            | raft_advertise_host     |
| KVSRV_SINGLE                    | single                  |

## Query 环境变量

可以使用环境变量配置配置文件 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 中 [query] 和 [storage] 部分下的参数。环境变量的名称是通过将单词 QUERY 或 STORAGE 与使用下划线分隔的相应参数名称组合而成的。

当存储服务的环境变量与 Databend 的环境变量匹配时，Databend 也会接受它们。这允许您使用最熟悉的环境变量命名约定，从而无需记住其他变量名称并简化配置过程。

为了用一个例子来说明，如果您想使用环境变量设置 S3 的访问密钥 ID，您可以灵活地使用 Databend 提供的 STORAGE_S3_ACCESS_KEY_ID 或通常与 AWS S3 关联的众所周知的 AWS_ACCESS_KEY_ID。
