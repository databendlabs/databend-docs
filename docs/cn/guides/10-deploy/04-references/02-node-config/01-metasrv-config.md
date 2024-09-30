---
title: 元配置
---

本页描述了 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的 Meta 节点配置。

```toml title='databend-meta.toml'
# 用法:
# databend-meta -c databend-meta.toml

admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 获取此地址以更新其 databend-meta 端点列表，
# 以防 databend-meta 集群发生变化。
grpc_api_advertise_host = "127.0.0.1"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中分配 raft_{listen|advertise}_host。
# 这允许你在单元测试中捕捉到 raft meta 节点通信出错时的错误。
raft_listen_host = "127.0.0.1"
raft_advertise_host = "localhost"

# 启动模式：单节点集群
single        = true
```

- 下表中列出的一些参数可能不在 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中。如果你需要这些参数，可以手动将它们添加到文件中。

- 你可以在 GitHub 上找到为各种部署环境设置 Databend 的[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)。这些文件仅用于内部测试。请勿为你的目的修改它们。但如果你有类似的部署，在编辑你自己的配置文件时参考它们是一个好主意。

## 通用参数

以下是 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的通用参数列表。这些参数不应包含在任何特定部分下。

| 参数                    | 描述                                                                 |
| ----------------------- | -------------------------------------------------------------------- |
| admin_api_address       | Databend 管理 API 的 IP 地址和端口。                                 |
| admin_tls_server_cert   | 管理 TLS 服务器证书文件的路径。                                      |
| admin_tls_server_key    | 管理 TLS 服务器密钥文件的路径。                                      |
| grpc_api_address        | Databend gRPC API 的 IP 地址和端口。                                 |
| grpc_api_advertise_host | 用于广告 gRPC API 的 IP 地址（用于更新 Databend-meta 端点）。        |
| grpc_tls_server_cert    | gRPC TLS 服务器证书文件的路径。                                      |
| grpc_tls_server_key     | gRPC TLS 服务器密钥文件的路径。                                      |

## [log] 部分

此部分可以包括两个子部分：[log.file] 和 [log.stderr]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数    | 描述                                                                 |
| ------- | -------------------------------------------------------------------- |
| on      | 启用基于文件的日志记录（true 或 false）。默认：true                  |
| level   | 基于文件的日志记录的日志级别（例如，"DEBUG"，"INFO"）。默认："DEBUG" |
| dir     | 存储日志文件的目录。默认："./.databend/logs"                          |
| format  | 基于文件的日志记录的日志格式（例如，"json"，"text"）。默认："json"   |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数    | 描述                                                                 |
| ------- | -------------------------------------------------------------------- |
| on      | 启用 stderr 日志记录（true 或 false）。默认：true                    |
| level   | stderr 日志记录的日志级别（例如，"DEBUG"，"INFO"）。默认："DEBUG"    |
| format  | stderr 日志记录的日志格式（例如，"text"，"json"）。默认："text"      |

## [raft_config] 部分

以下是 [raft_config] 部分中可用的参数列表：

| 参数                     | 描述                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| id                       | Raft 配置的唯一标识符。                                               |
| raft_dir                 | 存储 Raft 数据的目录。                                                |
| raft_api_port            | Databend Raft API 的端口。                                            |
| raft_listen_host         | Raft 监听的 IP 地址。                                                 |
| raft_advertise_host      | 用于广告 Raft API 的 IP 地址。                                        |
| single                   | 布尔值，指示 Databend 是否应以单节点集群模式运行（true 或 false）。   |
| join                     | 现有集群中节点的地址列表（&lt;raft_advertise_host&gt;:&lt;raft_api_port&gt;），新节点将加入该集群。 |
| heartbeat_interval       | 心跳间隔（以毫秒为单位）。默认：1000                                 |
| install_snapshot_timeout | 安装快照超时（以毫秒为单位）。默认：4000                             |
| max_applied_log_to_keep  | 保留的最大应用 Raft 日志数。默认：1000                               |
| snapshot_chunk_size      | 传输快照的块大小（以字节为单位）。默认：4MB                          |
| snapshot_logs_since_last | 自上次快照以来的 Raft 日志数。默认：1024                             |
| wait_leader_timeout      | 等待领导者超时（以毫秒为单位）。默认：70000                          |