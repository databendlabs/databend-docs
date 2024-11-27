---
title: 元配置
---

本页描述了 [databend-meta.toml](https://github.com/

| 参数                            | 描述                                                                                                                                                          |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                              | Raft 配置的唯一标识符。                                                                                                                                       |
| raft_dir                        | 存储 Raft 数据的目录。                                                                                                                                        |
| raft_api_port                   | Databend Raft API 的端口。                                                                                                                                     |
| raft_listen_host                | Raft 监听的 IP 地址。                                                                                                                                          |
| raft_advertise_host             | 用于广告 Raft API 的 IP 地址。                                                                                                                                 |
| cluster_name                    | 节点名称。如果用户指定了名称，则使用提供的名称；否则，使用默认名称。                                                                                            |
| wait_leader_timeout             | 等待领导者的超时时间，以毫秒为单位。默认值：180000。                                                                                                            |
| -- **管理** --                  |                                                                                                                                                               |
| single                          | 布尔值，指示 Databend 是否应以单节点集群模式运行（`true` 或 `false`）。                                                                                        |
| join                            | 现有集群节点的地址列表（`<raft_advertise_host>:<raft_api_port>`），新节点将加入此集群。                                                                         |
| leave_via                       | 不运行 `databend-meta`，而是通过提供的端点从集群中移除一个节点。节点将通过 `id` 被移除。                                                                       |
| leave_id                        | 要离开集群的节点的 ID。                                                                                                                                        |
| -- **RPC** --                   |                                                                                                                                                               |
| heartbeat_interval              | 心跳间隔，以毫秒为单位。默认值：500。                                                                                                                          |
| install_snapshot_timeout        | 安装快照的超时时间，以毫秒为单位。默认值：4000。                                                                                                                |
| -- **Raft 日志存储** --         |                                                                                                                                                               |
| log_cache_max_items             | Raft 日志中缓存的最大日志条目数。默认值：1,000,000。                                                                                                            |
| log_cache_capacity              | Raft 日志中日志缓存的最大内存（字节）。默认值：1G。                                                                                                             |
| log_wal_chunk_max_records       | Raft 日志 WAL 中每个文件块的最大记录数。默认值：100,000。                                                                                                        |
| log_wal_chunk_max_size          | Raft 日志 WAL 中文件块的最大大小（字节）。默认值：256M。                                                                                                         |
| -- **Raft 快照存储** --         |                                                                                                                                                               |
| snapshot_chunk_size             | 传输快照的块大小，以字节为单位。默认值：4MB。                                                                                                                  |
| snapshot_logs_since_last        | 自上次快照以来的最大日志数。如果超过，则创建新快照。默认值：1024。                                                                                             |
| snapshot_db_debug_check         | 是否检查输入快照中的键是否已排序。仅用于调试；默认值：`true`。                                                                                                  |
| snapshot_db_block_keys          | 快照数据库中每个块允许的最大键数。默认值：8000。                                                                                                               |
| snapshot_db_block_cache_item    | 要缓存的总块数。默认值：1024。                                                                                                                                |
| snapshot_db_block_cache_size    | 快照块的总缓存大小。默认值：1GB。                                                                                                                             |
| max_applied_log_to_keep         | 快照中保留的最大应用日志数。默认值：1000。                                                                                                                    |