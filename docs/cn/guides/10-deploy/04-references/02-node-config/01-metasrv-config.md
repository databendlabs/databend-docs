---
title: Meta 节点配置
---

本页介绍了 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的 Meta 节点配置。

```toml title='databend-meta.toml'
# Usage:
# databend-meta -c databend-meta.toml

admin_api_address       = "0.0.0.0:28002"
grpc_api_address        = "0.0.0.0:9191"
# databend-query fetch this address to update its databend-meta endpoints list,
# in case databend-meta cluster changes.
grpc_api_advertise_host = "127.0.0.1"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28004

# Assign raft_{listen|advertise}_host in test config.
# This allows you to catch a bug in unit tests when something goes wrong in raft meta nodes communication.
raft_listen_host = "127.0.0.1"
raft_advertise_host = "localhost"

# Start up mode: single node cluster
single        = true
```

- 下表列出的一些参数可能不存在于 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中。如果需要这些参数，可以手动将它们添加到文件中。

- 你可以在 GitHub 上找到[示例配置文件](https://github.com/databendlabs/databend/tree/main/scripts/ci/deploy/config)，用于为各种部署环境设置 Databend。这些文件仅供内部测试使用。请不要为了自己的目的修改它们。但是，如果你有类似的部署，参考它们来编辑你自己的配置文件是个好主意。

## 通用参数

以下是 [databend-meta.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的通用参数列表。这些参数不应包含在任何特定部分下。

| Parameter               | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| admin_api_address       | Databend 的管理 API 的 IP 地址和端口。                        |
| admin_tls_server_cert   | 管理 TLS 服务器证书文件的路径。                               |
| admin_tls_server_key    | 管理 TLS 服务器密钥文件的路径。                               |
| grpc_api_address        | Databend 的 gRPC API 的 IP 地址和端口。                       |
| grpc_api_advertise_host | 用于广播 gRPC API 的 IP 地址（用于更新 Databend-meta 端点）。 |
| grpc_tls_server_cert    | gRPC TLS 服务器证书文件的路径。                               |
| grpc_tls_server_key     | gRPC TLS 服务器密钥文件的路径。                               |

## [log] 部分

本节可以包含两个小节：[log.file] 和 [log.stderr]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| Parameter | Description                                                            |
| --------- | ---------------------------------------------------------------------- |
| on        | 启用基于文件的日志记录（true 或 false）。默认值：true                  |
| level     | 基于文件的日志记录的日志级别（例如，“DEBUG”，“INFO”）。默认值：“DEBUG” |
| dir       | 将存储日志文件的目录。默认值：“./.databend/logs”                       |
| format    | 基于文件的日志记录的日志格式（例如，“json”，“text”）。默认值：“json”   |
| limit     | 确定要保留的日志文件的最大数量。默认为 48                              |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| Parameter | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| on        | 启用 stderr 日志记录（true 或 false）。默认值：true                 |
| level     | stderr 日志记录的日志级别（例如，“DEBUG”，“INFO”）。默认值：“DEBUG” |
| format    | stderr 日志记录的日志格式（例如，“text”，“json”）。默认值：“text”   |

## [raft_config] 部分

以下是 [raft_config] 部分中可用的参数列表：

这是翻译后的 `databend-meta` 启动配置表：

| 参数                         | 描述                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| id                           | Raft 配置的唯一标识符。                                                                  |
| raft_dir                     | 用于存储 Raft 数据的目录。                                                               |
| raft_api_port                | Databend Raft API 的端口。                                                               |
| raft_listen_host             | Raft 监听的 IP 地址。                                                                    |
| raft_advertise_host          | 用于广播 Raft API 的 IP 地址。                                                           |
| cluster_name                 | 节点名称。如果用户指定了名称，则使用提供的名称；否则，使用默认名称。                     |
| wait_leader_timeout          | 等待 leader 的超时时间，以毫秒为单位。默认值：180000。                                   |
| -- **管理** --               |                                                                                          |
| single                       | 布尔值，指示 Databend 是否应以单节点集群模式运行 (`true` 或 `false`)。                   |
| join                         | 现有集群节点的地址列表 (`<raft_advertise_host>:<raft_api_port>`)，新节点将加入此集群。   |
| leave_via                    | 不运行 `databend-meta`，而是通过提供的端点从集群中删除一个节点。该节点将通过 `id` 删除。 |
| leave_id                     | 要离开集群的节点的 ID。                                                                  |
| -- **RPC** --                |                                                                                          |
| heartbeat_interval           | 心跳间隔，以毫秒为单位。默认值：500。                                                    |
| install_snapshot_timeout     | 安装快照的超时时间，以毫秒为单位。默认值：4000。                                         |
| -- **Raft 日志存储** --      |                                                                                          |
| log_cache_max_items          | Raft 日志中缓存的最大日志条目数。默认值：1,000,000。                                     |
| log_cache_capacity           | Raft 日志中用于日志缓存的最大内存（字节）。默认值：1G。                                  |
| log_wal_chunk_max_records    | Raft 日志 WAL 中每个文件块的最大记录数。默认值：100,000。                                |
| log_wal_chunk_max_size       | Raft 日志 WAL 中文件块的最大大小（字节）。默认值：256M。                                 |
| -- **Raft 快照存储** --      |                                                                                          |
| snapshot_chunk_size          | 用于传输快照的块大小，以字节为单位。默认值：4MB。                                        |
| snapshot_logs_since_last     | 自上次快照以来的最大日志数。如果超过此值，则会创建一个新快照。默认值：1024。             |
| snapshot_db_debug_check      | 是否检查输入快照中的键是否已排序。仅用于调试；默认值：`true`。                           |
| snapshot_db_block_keys       | 快照数据库中每个块允许的最大键数。默认值：8000。                                         |
| snapshot_db_block_cache_item | 要缓存的块的总数。默认值：1024。                                                         |
| snapshot_db_block_cache_size | 快照块的总缓存大小。默认值：1GB。                                                        |
| max_applied_log_to_keep      | 在快照中保留的最大已应用日志数。默认值：1000。                                           |
