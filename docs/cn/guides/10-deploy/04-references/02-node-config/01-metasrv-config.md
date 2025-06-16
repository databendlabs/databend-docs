---
title: Meta 服务配置
---

本页面介绍在 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的 Meta 节点配置。

```toml title='databend-meta.toml'
# 用法:
# databend-meta -c databend-meta.toml

admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 会获取此地址来更新其 databend-meta 端点列表，
# 以防 databend-meta 集群发生变化。
grpc_api_advertise_host = "127.0.0.1"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这可以让你在单元测试中，当 Raft meta 节点通信出错时捕获到错误。
raft_listen_host = "127.0.0.1"
raft_advertise_host = "localhost"

# 启动模式：单节点集群
single        = true
```

- 下表中列出的某些参数可能并未在 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 文件中提供。如果需要使用这些参数，可以手动将它们添加到文件中。

- 你可以在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，这些文件为不同部署环境下的 Databend 提供了配置。这些文件仅用于内部测试，请不要为了个人目的修改它们。但如果你有类似的部署环境，在编辑自己的配置文件时参考它们会是一个好主意。

## 通用参数

以下是在 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的通用参数列表。这些参数不应包含在任何特定配置节下。

| 参数                     | 说明                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| admin_api_address       | Databend 管理 API 的 IP 地址和端口。                                                         |
| admin_tls_server_cert   | 管理 TLS 服务器证书文件的路径。                                                              |
| admin_tls_server_key    | 管理 TLS 服务器密钥文件的路径。                                                              |
| grpc_api_address        | Databend gRPC API 的 IP 地址和端口。                                                         |
| grpc_api_advertise_host | 用于广播 gRPC API 的 IP 地址（用于更新 Databend-meta 端点）。                                |
| grpc_tls_server_cert    | gRPC TLS 服务器证书文件的路径。                                                              |
| grpc_tls_server_key     | gRPC TLS 服务器密钥文件的路径。                                                              |

## [log] 配置节

该配置节可以包含两个子配置节：[log.file] 和 [log.stderr]。

### [log.file] 配置节

以下是 [log.file] 配置节中可用的参数列表：

| 参数   | 说明                                                                 |
| ------ | -------------------------------------------------------------------- |
| on     | 启用基于文件的日志记录（true 或 false）。默认值：true                |
| level  | 基于文件的日志记录的日志级别（例如 "DEBUG"、"INFO"）。默认值："DEBUG" |
| dir    | 存储日志文件的目录。默认值："./.databend/logs"                       |
| format | 基于文件的日志记录的日志格式（例如 "json"、"text"）。默认值："json"   |
| limit  | 决定要保留的日志文件的最大数量。默认值：48                           |

### [log.stderr] 配置节

以下是 [log.stderr] 配置节中可用的参数列表：

| 参数   | 说明                                                               |
| ------ | ------------------------------------------------------------------ |
| on     | 启用 stderr 日志记录（true 或 false）。默认值：true                |
| level  | stderr 日志记录的日志级别（例如 "DEBUG"、"INFO"）。默认值："DEBUG" |
| format | stderr 日志记录的日志格式（例如 "text"、"json"）。默认值："text"   |

## [raft_config] 配置节

以下是 [raft_config] 配置节中可用的参数列表：

| 参数                         | 说明                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| id                           | Raft 配置的唯一标识符。                                                                                                   |
| raft_dir                     | 存储 Raft 数据的目录。                                                                                                    |
| raft_api_port                | Databend Raft API 的端口。                                                                                                |
| raft_listen_host             | Raft 监听的 IP 地址。                                                                                                     |
| raft_advertise_host          | 用于广播 Raft API 的 IP 地址。                                                                                            |
| cluster_name                 | 节点名称。如果用户指定了名称，则使用提供的名称；否则使用默认名称。                                                        |
| wait_leader_timeout          | 等待 leader 的超时时间（毫秒）。默认值：180000                                                                            |
| -- **管理** --               |                                                                                                                           |
| single                       | 布尔值，表示 Databend 是否以单节点集群模式运行（`true` 或 `false`）。                                                     |
| join                         | 现有集群节点的地址列表（`<raft_advertise_host>:<raft_api_port>`），新节点将加入此集群。                                    |
| leave_via                    | 不运行 `databend-meta`，而是通过提供的端点从集群中移除节点。该节点将通过 `id` 被移除。                                    |
| leave_id                     | 要离开集群的节点 ID。                                                                                                     |
| -- **RPC** --                |                                                                                                                           |
| heartbeat_interval           | 心跳间隔（毫秒）。默认值：500                                                                                             |
| install_snapshot_timeout     | 安装快照的超时时间（毫秒）。默认值：4000                                                                                  |
| -- **Raft 日志存储** --      |                                                                                                                           |
| log_cache_max_items          | Raft 日志中缓存的日志条目最大数量。默认值：1,000,000                                                                      |
| log_cache_capacity           | Raft 日志中用于日志缓存的最大内存（字节）。默认值：1G                                                                     |
| log_wal_chunk_max_records    | Raft 日志 WAL 中每个文件块的最大记录数。默认值：100,000                                                                  |
| log_wal_chunk_max_size       | Raft 日志 WAL 中文件块的最大大小（字节）。默认值：256M                                                                    |
| -- **Raft 快照存储** --      |                                                                                                                           |
| snapshot_chunk_size          | 传输快照的块大小（字节）。默认值：4MB                                                                                     |
| snapshot_logs_since_last     | 自上次快照以来的最大日志数。超过此值将创建新快照。默认值：1024                                                            |
| snapshot_db_debug_check      | 是否检查输入快照中的键是否已排序（仅用于调试）。默认值：`true`                                                            |
| snapshot_db_block_keys       | 快照数据库中每个块允许的最大键数。默认值：8000                                                                            |
| snapshot_db_block_cache_item | 要缓存的总块数。默认值：1024                                                                                              |
| snapshot_db_block_cache_size | 快照块的总缓存大小。默认值：1GB                                                                                           |
| max_applied_log_to_keep      | 快照中要保留的最大已应用日志数。默认值：1000                                                                              |