---
title: 元配置
---

本页面描述了在 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的 Meta 节点配置。

```toml title='databend-meta.toml'
# 使用方法：
# databend-meta -c databend-meta.toml

admin_api_address       = "0.0.0.0:28101"
grpc_api_address        = "0.0.0.0:9191"
# databend-query 通过此地址更新其 databend-meta 端点列表，
# 以应对 databend-meta 集群变化的情况。
grpc_api_advertise_host = "127.0.0.1"

[raft_config]
id            = 1
raft_dir      = "/var/lib/databend/raft"
raft_api_port = 28103

# 在测试配置中指定 raft_{listen|advertise}_host。
# 这允许您在 raft 元节点通信出现问题时，在单元测试中捕获错误。
raft_listen_host = "127.0.0.1"
raft_advertise_host = "localhost"

# 启动模式：单节点集群
single        = true
```

- 下表中列出的一些参数可能不在 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 中出现。如果您需要这些参数，可以手动将它们添加到文件中。

- 您可以在 GitHub 上找到[示例配置文件](https://github.com/datafuselabs/databend/tree/main/scripts/ci/deploy/config)，这些文件设置了 Databend 用于各种部署环境。这些文件仅用于内部测试。请勿为您自己的目的修改它们。但是，如果您有类似的部署，参考它们编辑您自己的配置文件是个好主意。

## 通用参数

以下是 [databend-meta.toml](https://github.com/datafuselabs/databend/blob/main/scripts/distribution/configs/databend-meta.toml) 配置文件中可用的通用参数列表。这些参数不应包含在任何特定部分下。

| 参数                    | 描述                                                          |
| ----------------------- | ------------------------------------------------------------- |
| admin_api_address       | Databend 的管理员 API 的 IP 地址和端口。                      |
| admin_tls_server_cert   | 管理员 TLS 服务器证书文件的路径。                             |
| admin_tls_server_key    | 管理员 TLS 服务器密钥文件的路径。                             |
| grpc_api_address        | Databend 的 gRPC API 的 IP 地址和端口。                       |
| grpc_api_advertise_host | 用于广告 gRPC API 的 IP 地址（用于更新 Databend-meta 端点）。 |
| grpc_tls_server_cert    | gRPC TLS 服务器证书文件的路径。                               |
| grpc_tls_server_key     | gRPC TLS 服务器密钥文件的路径。                               |

## [log] 部分

此部分可以包括两个子部分：[log.file] 和 [log.stderr]。

### [log.file] 部分

以下是 [log.file] 部分中可用的参数列表：

| 参数   | 描述                                                                   |
| ------ | ---------------------------------------------------------------------- |
| on     | 启用基于文件的日志记录（true 或 false）。默认值：true                  |
| level  | 基于文件的日志记录的日志级别（例如，"DEBUG", "INFO"）。默认值："DEBUG" |
| dir    | 存储日志文件的目录。默认值："./.databend/logs"                         |
| format | 基于文件的日志记录的日志格式（例如，"json", "text"）。默认值："json"   |

### [log.stderr] 部分

以下是 [log.stderr] 部分中可用的参数列表：

| 参数   | 描述                                                                |
| ------ | ------------------------------------------------------------------- |
| on     | 启用 stderr 日志记录（true 或 false）。默认值：true                 |
| level  | stderr 日志记录的日志级别（例如，"DEBUG", "INFO"）。默认值："DEBUG" |
| format | stderr 日志记录的日志格式（例如，"text", "json"）。默认值："text"   |

## [raft_config] 部分

以下是 [raft_config] 部分中可用的参数列表：

| 参数                     | 描述                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| id                       | Raft 配置的唯一标识符。                                                                   |
| raft_dir                 | 存储 Raft 数据的目录。                                                                    |
| raft_api_port            | Databend 的 Raft API 端口。                                                               |
| raft_listen_host         | Raft 监听的 IP 地址。                                                                     |
| raft_advertise_host      | 用于宣传 Raft API 的 IP 地址。                                                            |
| single                   | 布尔值，指示 Databend 是否以单节点集群模式运行（true 或 false）。                         |
| join                     | 新节点加入到现有集群时，集群中节点的地址列表`（<raft_advertise_host>:<raft_api_port>）`。 |
| heartbeat_interval       | 心跳间隔，以毫秒为单位。默认值：1000                                                      |
| install_snapshot_timeout | 安装快照超时，以毫秒为单位。默认值：4000                                                  |
| max_applied_log_to_keep  | 保留的已应用 Raft 日志的最大数量。默认值：1000                                            |
| snapshot_chunk_size      | 传输快照的块大小，以字节为单位。默认值为 4MB                                              |
| snapshot_logs_since_last | 自上次快照以来的 Raft 日志数量。默认值：1024                                              |
| wait_leader_timeout      | 等待领导者超时，以毫秒为单位。默认值：70000                                               |
