---
title: Databend 指标
sidebar_label: Databend 指标
description: Meta 和 Query 服务指标
---

指标 (Metrics) 对于监控系统的性能和健康状况至关重要。Databend 以 [Prometheus](http://prometheus.io/docs/instrumenting/exposition_formats/) 的格式收集和存储两种类型的指标：Meta 指标 (Meta Metrics) 和 Query 指标 (Query Metrics)。Meta 指标用于对 Metasrv 组件进行实时监控和调试，而 Query 指标用于监控 Databend-query 组件的性能。

您可以通过 Web 浏览器使用以下 URL 访问这些指标：

- Meta 指标：`http://<admin_api_address>/v1/metrics`。默认为 `0.0.0.0:28002/v1/metrics`。
- Query 指标：`http://<metric_api_address>/metrics`。默认为 `0.0.0.0:7070/metrics`。

:::tip
此外，您还可以使用第三方工具来可视化这些指标。有关支持的工具和集成教程的信息，请参阅 **监控** > **使用第三方工具**。在使用 Prometheus & Grafana 解决方案时，您可以使用我们提供的仪表盘模板创建仪表盘，模板可在此处获取：[链接](https://github.com/databendlabs/helm-charts/tree/main/dashboards)。更多详细信息，请查看 [Prometheus & Grafana](tools/prometheus-and-grafana.md) 指南。
:::

## Meta 指标

以下是 Databend 捕获的 Meta 指标列表。

### Server

这些指标描述了 `metasrv` 的状态。所有这些指标都以 `metasrv_server_` 为前缀。

| 名称              | 描述                                       | 类型    |
| ----------------- | ------------------------------------------------- | ------- |
| current_leader_id | 集群当前的 leader (Leader) ID，0 表示没有 leader。 | Gauge   |
| is_leader         | 此节点是否为当前 leader。       | Gauge   |
| node_is_health    | 此节点是否健康。               | Gauge   |
| leader_changes    | 观察到的 leader 变更次数。                    | Counter |
| applying_snapshot | 状态机是否正在应用快照 (Snapshot)。 | Gauge   |
| proposals_applied | 已应用的共识提案总数。      | Gauge   |
| last_log_index    | 最后一个日志条目的索引。                     | Gauge   |
| current_term      | 当前任期。                                     | Gauge   |
| proposals_pending | 待处理提案的总数。                | Gauge   |
| proposals_failed  | 失败提案的总数。                 | Counter |
| watchers          | 活跃的 watcher 总数。                  | Gauge   |

`current_leader_id` 表示集群当前的 leader ID，0 表示没有 leader。如果集群没有 leader，则集群不可用。

`is_leader` 表示此 `metasrv` 当前是否为集群的 leader，`leader_changes` 显示自启动以来的 leader 变更总数。如果 leader 变更过于频繁，会影响 `metasrv` 的性能，也表明集群不稳定。

当且仅当节点状态为 `Follower` 或 `Leader` 时，`node_is_health` 为 1，否则为 0。

`proposals_applied` 记录已应用写请求的总数。

`last_log_index` 记录已附加到此 Raft 节点日志的最后一个日志索引，`current_term` 记录 Raft 节点的当前任期。

`proposals_pending` 表示当前排队等待提交的提案数量。待处理提案数量的增加表明客户端负载较高或成员无法提交提案。

`proposals_failed` 显示失败写请求的总数，通常与两个问题有关：与 leader 选举相关的临时故障，或由集群中法定人数丢失导致的更长停机时间。

`watchers` 显示当前活跃的 watcher 总数。

### Raft Network

这些指标描述了 `metasrv` 中 raft 节点的网络状态。所有这些指标都以 `metasrv_raft_network_` 为前缀。

| 名称                    | 描述                                       | 标签                            | 类型      |
| ----------------------- | ------------------------------------------------- | --------------------------------- | --------- |
| active_peers            | 当前与对等节点的活跃连接数。    | id(node id),address(peer address) | Gauge     |
| fail_connect_to_peer    | 与对等节点连接失败的总次数。        | id(node id),address(peer address) | Counter   |
| sent_bytes              | 发送给对等节点的总字节数。              | to(node id)                       | Counter   |
| recv_bytes              | 从对等节点接收的总字节数。        | from(remote address)              | Counter   |
| sent_failures           | 向对等节点发送失败的总次数。           | to(node id)                       | Counter   |
| snapshot_send_success   | 成功发送快照的总次数。        | to(node id)                       | Counter   |
| snapshot_send_failures  | 发送快照失败的总次数。           | to(node id)                       | Counter   |
| snapshot_send_inflights | 正在进行的 (Inflight) 快照发送总数。          | to(node id)                       | Gauge     |
| snapshot_sent_seconds   | 快照发送的总延迟分布。    | to(node id)                       | Histogram |
| snapshot_recv_success   | 成功接收快照的总次数。      | from(remote address)              | Counter   |
| snapshot_recv_failures  | 接收快照失败的总次数。        | from(remote address)              | Counter   |
| snapshot_recv_inflights | 正在进行的快照接收总数。       | from(remote address)              | Gauge     |
| snapshot_recv_seconds   | 快照接收的总延迟分布。 | from(remote address)              | Histogram |

`active_peers` 表示集群成员之间的活跃连接数，`fail_connect_to_peer` 表示与对等节点连接失败的次数。每个指标都有标签：id（节点 ID）和 address（对等节点地址）。

`sent_bytes` 和 `recv_bytes` 记录发送到对等节点和从对等节点接收的字节数，`sent_failures` 记录向对等节点发送失败的次数。

`snapshot_send_success` 和 `snapshot_send_failures` 表示发送快照的成功和失败次数。`snapshot_send_inflights` 表示正在进行的快照发送，每次发送快照时该字段加一，发送完成后减一。

`snapshot_sent_seconds` 表示快照发送的总延迟分布。

`snapshot_recv_success` 和 `snapshot_recv_failures` 表示接收快照的成功和失败次数。`snapshot_recv_inflights` 表示正在进行的快照接收，每次接收快照时该字段加一，接收完成后减一。

`snapshot_recv_seconds` 表示快照接收的总延迟分布。

### Raft Storage

这些指标描述了 `metasrv` 中 raft 节点的存储状态。所有这些指标都以 `metasrv_raft_storage_` 为前缀。

| 名称                    | 描述                                | 标签              | 类型    |
| ----------------------- | ------------------------------------------ | ------------------- | ------- |
| raft_store_write_failed | raft 存储写入失败的总次数。 | func(function name) | Counter |
| raft_store_read_failed  | raft 存储读取失败的总次数。  | func(function name) | Counter |

`raft_store_write_failed` 和 `raft_store_read_failed` 表示 raft 存储写入和读取失败的总次数。

### Meta Network

这些指标描述了 `metasrv` 中 meta 服务的网络状态。所有这些指标都以 `metasrv_meta_network_` 为前缀。

| 名称              | 描述                                            | 类型      |
| ----------------- | ------------------------------------------------------ | --------- |
| sent_bytes        | 发送到 meta gRPC 客户端的总字节数。        | Counter   |
| recv_bytes        | 从 meta gRPC 客户端接收的总字节数。      | Counter   |
| inflights         | 正在进行的 meta gRPC 请求总数。           | Gauge     |
| req_success       | 来自 meta gRPC 客户端的成功请求总数。 | Counter   |
| req_failed        | 来自 meta gRPC 客户端的失败请求总数。    | Counter   |
| rpc_delay_seconds | meta-service API 的延迟分布（秒）。    | Histogram |

## Query 指标

以下是 Databend 捕获的 Query 指标列表。

| 名称                                                            | 类型      | 描述                                                                                                                                                  | 标签                                                                                                                                                  |
| --------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| databend_cache_access_count                                     | Counter   | 缓存访问次数。                                                                                                                                    | cache_name                                                                                                                                              |
| databend_cache_hit_count                                        | Counter   | 不同缓存类型的缓存命中次数。                                                                                                   | cache_name                                                                                                                                              |
| databend_cache_miss_count                                       | Counter   | 缓存未命中次数。                                                                                                                                      | cache_name                                                                                                                                              |
| databend_cache_miss_load_millisecond                            | Histogram | 缓存未命中加载时间的分布。                                                                                                                       | cache_name                                                                                                                                              |
| databend_cluster_discovered_node                                | Gauge     | 外部暴露的已发现节点信息。                                                                                               | local_id, cluster_id, tenant_id, flight_address                                                                                                         |
| databend_compact_hook_compaction_ms                             | Histogram | 压缩操作耗时的直方图。                                                                                                        | operation                                                                                                                                               |
| databend_compact_hook_execution_ms                              | Histogram | 压缩钩子操作执行时间的分布。                                                                                                  | operation: MergeInto, Insert                                                                                                                            |
| databend_fuse_block_index_read_bytes                            | Counter   | 块索引读取的字节数。                                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_index_write_bytes_total                     | Counter   | 索引块写入的总字节数。                                                                                                              |                                                                                                                                                         |
| databend_fuse_block_index_write_milliseconds                    | Histogram | 写入索引块所用时间的分布。                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_index_write_nums_total                      | Counter   | 写入的索引块总数。                                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_write_bytes                                 | Counter   | 写入的总字节数。                                                                                                                               |                                                                                                                                                         |
| databend_fuse_block_write_millioseconds                         | Histogram | 写入块所用时间的分布。                                                                                                                  |                                                                                                                                                         |
| databend_fuse_block_write_nums                                  | Counter   | 写入的块总数。                                                                                                                              |                                                                                                                                                         |
| databend_fuse_blocks_bloom_pruning_after                        | Counter   | 执行块级布隆 (Bloom) 裁剪后的块数。                                                                                                  |                                                                                                                                                         |
| databend_fuse_blocks_bloom_pruning_before                       | Counter   | 执行块级布隆裁剪前的块数。                                                                                                 |                                                                                                                                                         |
| databend_fuse_blocks_range_pruning_after                        | Counter   | 执行块级范围裁剪后的块数。                                                                                                  |                                                                                                                                                         |
| databend_fuse_blocks_range_pruning_before                       | Counter   | 执行块级范围裁剪前的块数。                                                                                                 |                                                                                                                                                         |
| databend_fuse_bytes_block_bloom_pruning_after                   | Counter   | 执行块级布隆裁剪后的数据大小（字节）。                                                                                                |                                                                                                                                                         |
| databend_fuse_bytes_block_bloom_pruning_before                  | Counter   | 执行块级布隆裁剪前的数据大小（字节）。                                                                                               |                                                                                                                                                         |
| databend_fuse_bytes_segment_range_pruning_after                 | Counter   | 执行段级范围裁剪后的数据大小（字节）。                                                                                              |                                                                                                                                                         |
| databend_fuse_bytes_segment_range_pruning_before                | Counter   | 执行段级范围裁剪前的数据大小（字节）。                                                                                             |                                                                                                                                                         |
| databend_fuse_commit_aborts                                     | Counter   | 因错误导致提交中止的次数。                                                                                                                |                                                                                                                                                         |
| databend_fuse_commit_copied_files                               | Counter   | 提交操作期间复制的文件总数。                                                                                                       |                                                                                                                                                         |
| databend_fuse_commit_milliseconds                               | Counter   | 提交变更所用的总时间。                                                                                                                       |                                                                                                                                                         |
| databend_fuse_commit_mutation_modified_segment_exists_in_latest | Counter   | 统计最新提交变更中是否存在已修改的段。                                                                                     |                                                                                                                                                         |
| databend_fuse_commit_mutation_success                           | Counter   | 成功提交的变更数量。                                                                                                                    |                                                                                                                                                         |
| databend_fuse_commit_mutation_unresolvable_conflict             | Counter   | 发生无法解决的提交冲突的次数。                                                                                                      |                                                                                                                                                         |
| databend_fuse_compact_block_build_lazy_part_milliseconds        | Histogram | 压缩期间构建惰性部分所用时间的分布。                                                                                     |                                                                                                                                                         |
| databend_fuse_compact_block_build_task_milliseconds             | Histogram | 构建压缩块所用时间的分布。                                                                                                   |                                                                                                                                                         |
| databend_fuse_compact_block_read_bytes                          | Counter   | 压缩期间读取的块的累积大小（字节）。                                                                                                  |                                                                                                                                                         |
| databend_fuse_compact_block_read_milliseconds                   | Histogram | 压缩期间读取块所用时间的直方图。                                                                                                    |                                                                                                                                                         |
| databend_fuse_compact_block_read_nums                           | Counter   | 压缩期间读取的块数。                                                                                                          |                                                                                                                                                         |
| databend_fuse_pruning_milliseconds                              | Histogram | 裁剪段所用的时间。                                                                                                                              |                                                                                                                                                         |
| databend_fuse_remote_io_deserialize_milliseconds                | Histogram | 将原始数据解压缩并反序列化为 DataBlock 所用的时间。                                                                                      |                                                                                                                                                         |
| databend_fuse_remote_io_read_bytes                              | Counter   | 从对象存储读取的累积字节数。                                                                                                         |                                                                                                                                                         |
| databend_fuse_remote_io_read_bytes_after_merged                 | Counter   | 合并后从对象存储读取的累积字节数。                                                                                           |                                                                                                                                                         |
| databend_fuse_remote_io_read_milliseconds                       | Histogram | 从 S3 读取所用时间的直方图。                                                                                                                     |                                                                                                                                                         |
| databend_fuse_remote_io_read_parts                              | Counter   | 从对象存储读取的分区表数据块的累积计数。                                                                                  |                                                                                                                                                         |
| databend_fuse_remote_io_seeks                                   | Counter   | 从对象存储读取期间独立 IO 操作的累积计数。                                                                              |                                                                                                                                                         |
| databend_fuse_remote_io_seeks_after_merged                      | Counter   | 从对象存储读取期间 IO 合并的累积计数。                                                                                              |                                                                                                                                                         |
| databend_fuse_segments_range_pruning_after                      | Counter   | 执行段级范围裁剪后的段数。                                                                                              |                                                                                                                                                         |
| databend_fuse_segments_range_pruning_before                     | Counter   | 执行段级范围裁剪前的段数。                                                                                             |                                                                                                                                                         |
| databend_merge_into_accumulate_milliseconds                     | Histogram | 合并操作的总体时间分布。                                                                                                              |                                                                                                                                                         |
| databend_merge_into_append_blocks_counter                       | Counter   | merge into 操作中写入的总块数。                                                                                                                |                                                                                                                                                         |
| databend_merge_into_append_blocks_rows_counter                  | Counter   | merge into 操作中写入的总行数。                                                                                                                  |                                                                                                                                                         |
| databend_merge_into_apply_milliseconds                          | Histogram | merge into 操作的时间分布。                                                                                                                 |                                                                                                                                                         |
| databend_merge_into_matched_operation_milliseconds              | Histogram | 合并操作中匹配操作的时间分布。                                                                                                |                                                                                                                                                         |
| databend_merge_into_matched_rows                                | Counter   | 合并操作中匹配的总行数。                                                                                                            |                                                                                                                                                         |
| databend_merge_into_not_matched_operation_milliseconds          | Histogram | merge into 操作中 'not matched' 部分的时间分布。                                                                                           |                                                                                                                                                         |
| databend_merge_into_replace_blocks_counter                      | Counter   | 合并操作生成的替换块数。                                                                                                  |                                                                                                                                                         |
| databend_merge_into_replace_blocks_rows_counter                 | Counter   | 合并操作替换的行数。                                                                                                                 |                                                                                                                                                         |
| databend_merge_into_split_milliseconds                          | Histogram | 拆分合并操作所用的时间。                                                                                                                   |                                                                                                                                                         |
| databend_merge_into_unmatched_rows                              | Counter   | merge into 操作中未匹配的总行数。                                                                                                                |                                                                                                                                                         |
| databend_meta_grpc_client_request_duration_ms                   | Histogram | 向 meta leader 发出的不同类型请求（Upsert, Txn, StreamList, StreamMGet, GetClientInfo）的请求持续时间分布。              | endpoint, request                                                                                                                                       |
| databend_meta_grpc_client_request_inflight                      | Gauge     | 当前连接到 meta 的查询数。                                                                                                            |                                                                                                                                                         |
| databend_meta_grpc_client_request_success                       | Counter   | 向 meta 发出的成功请求数。                                                                                                                   | endpoint, request                                                                                                                                       |
| databend_opendal_bytes                                          | Counter   | OpenDAL 端点读取和写入的总字节数。                                                                                              | scheme (操作使用的方案，如 "s3"), op (操作类型，如 "read" 或 "write")                                             |
| databend_opendal_bytes_histogram                                | Histogram | 按操作划分的响应时间和计数分布。                                                                                                      | scheme (操作使用的方案，如 "s3"), op (操作类型，如 "write")                                                       |
| databend_opendal_errors                                         | Counter   | OpenDAL 操作中遇到的错误数量及其类型。                                                                                          | scheme (操作使用的方案，如 "s3"), op (操作类型，如 "read"), err (遇到的错误类型，如 "NotFound") |
| databend_opendal_request_duration_seconds                       | Histogram | 向对象存储发出的 OpenDAL 请求的持续时间。                                                                                                              | scheme (操作使用的方案，如 "s3"), op (操作类型，如 "read")                                                        |
| databend_opendal_requests                                       | Counter   | 使用 OpenDAL 发出的各种类型请求的数量。                                                                                                      | scheme (请求使用的方案，如 "s3"), op (操作类型，如 "batch", "list", "presign", "read", "write", "delete", "stat")      |
| databend_process_cpu_seconds_total                              | Counter   | 用户和系统使用的总 CPU 时间（秒）。                                                                                                           |                                                                                                                                                         |
| databend_process_max_fds                                        | Gauge     | 最大打开文件描述符数。                                                                                                                     |                                                                                                                                                         |
| databend_process_open_fds                                       | Gauge     | 打开的文件描述符数。                                                                                                                             |                                                                                                                                                         |
| databend_process_resident_memory_bytes                          | Gauge     | 常驻内存大小（字节）。                                                                                                                               |                                                                                                                                                         |
| databend_process_start_time_seconds                             | Gauge     | 自 Unix 纪元以来的进程启动时间（秒）。                                                                                                       |                                                                                                                                                         |
| databend_process_threads                                        | Gauge     | 正在使用的操作系统线程数。                                                                                                                                 |                                                                                                                                                         |
| databend_process_virtual_memory_bytes                           | Gauge     | 虚拟内存大小（字节）。                                                                                                                                |                                                                                                                                                         |
| databend_query_duration_ms                                      | Histogram | 跟踪由不同处理程序发起的不同类型查询的执行时间分布。                                                     | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_error                                            | Counter   | 查询错误总数。                                                                                                                                | handler="HTTPQuery", kind="Other", tenant="wubx", cluster="w189"                                                                                        |
| databend_query_failed                                           | Counter   | 失败请求总数。                                                                                                                             |                                                                                                                                                         |
| databend_query_http_requests_count                              | Counter   | 按方法、API 端点和状态码分类的 HTTP 请求数。                                                                               | method, api, status                                                                                                                                     |
| databend_query_http_response_duration_seconds                   | Histogram | 按 HTTP 方法和 API 端点分类的查询响应时间分布。                                                                               | method, api, le, sum, count                                                                                                                             |
| databend_query_http_response_errors_count                       | Counter   | 请求错误的计数和类型。                                                                                                                          | code, err                                                                                                                                               |
| databend_query_result_bytes                                     | Counter   | 每个查询返回的数据总字节数。                                                                                                    | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_result_rows                                      | Counter   | 每个查询返回的数据行总数。                                                                                                            | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_bytes                                       | Counter   | 查询扫描的数据总大小（字节）。                                                                                                              | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_io_bytes                                    | Counter   | 查询期间扫描和传输的数据总大小（字节）。                                                                                         | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_io_bytes_cost_ms                            | Histogram | 查询期间 IO 扫描时间的分布。                                                                                                                 | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_partitions                                  | Counter   | 查询扫描的分区（块）总数。                                                                                                      | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_rows                                        | Counter   | 查询扫描的数据行总数。                                                                                                                | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_start                                            | Counter   | 跟踪由不同处理程序发起的查询执行次数。将查询分为 SELECT、UPDATE、INSERT 等多种类型。 | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_success                                          | Counter   | 按类型划分的成功查询数。                                                                                                                        | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_total_partitions                                 | Counter   | 查询涉及的分区（块）总数。                                                                                                   | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_bytes                                      | Counter   | 查询写入的累积字节数。                                                                                                               | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_io_bytes                                   | Counter   | 查询写入和传输的数据总大小。                                                                                                       | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_io_bytes_cost_ms                           | Histogram | 查询写入 IO 字节的时间成本。                                                                                                                   | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_rows                                       | Counter   | 查询写入的累积行数。                                                                                                                | handler, kind, tenant, cluster                                                                                                                          |
| databend_session_close_numbers                                  | Counter   | 会话关闭次数。                                                                                                                                  |                                                                                                                                                         |
| databend_session_connect_numbers                                | Counter   | 记录自系统启动以来与节点建立的连接总数。                                                               |                                                                                                                                                         |
| databend_session_connections                                    | Gauge     | 测量当前与节点的活跃连接数。                                                                                              |                                                                                                                                                         |
| databend_session_queue_acquire_duration_ms                      | Histogram | 等待队列获取时间的分布。                                                                                                              |                                                                                                                                                         |
| databend_session_queued_queries                                 | Gauge     | 当前在查询队列中的 SQL 查询数。                                                                                                          |                                                                                                                                                         |
| databend_session_running_acquired_queries                       | Gauge     | 正在运行的会话中已获取的查询数。                                                                                                   |                                                                                                                                                         |