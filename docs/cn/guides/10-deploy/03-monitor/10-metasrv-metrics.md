---
title: Databend 指标
sidebar_label: Databend 指标
description: 
  元数据和查询服务指标
---

指标对于监控系统的性能和健康状况至关重要。Databend 收集并存储两种类型的指标，元数据指标和查询指标，格式为 [Prometheus](http://prometheus.io/docs/instrumenting/exposition_formats/)。元数据指标用于实时监控和调试 Metasrv 组件，而查询指标用于监控 Databend-query 组件的性能。

您可以通过以下 URL 使用 Web 浏览器访问指标：

- 元数据指标：`http://<admin_api_address>/v1/metrics`。默认值为 `0.0.0.0:28101/v1/metrics`。
- 查询指标：`http://<metric_api_address>/metrics`。默认值为 `0.0.0.0:7070/metrics`。

:::tip
或者，您可以使用第三方工具可视化指标。有关支持的工具和集成教程的信息，请参阅 **监控** > **使用第三方工具**。在使用 Prometheus & Grafana 解决方案时，您可以使用我们提供的仪表板模板创建仪表板，模板可在此处获取 [here](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)。更多详情，请查看 [Prometheus & Grafana](tools/prometheus-and-grafana.md) 指南。
:::

## 元数据指标

以下是 Databend 捕获的元数据指标列表。

### 服务器

这些指标描述了 `metasrv` 的状态。所有这些指标都以 `metasrv_server_` 为前缀。

| 名称              | 描述                                       | 类型    |
|-------------------|---------------------------------------------------|---------|
| current_leader_id | 当前集群的领导者 ID，0 表示没有领导者。  | Gauge   |
| is_leader         | 此节点是否为当前领导者。       | Gauge   |
| node_is_health    | 此节点是否健康。               | Gauge   |
| leader_changes    | 看到的领导者变更次数。                    | Counter |
| applying_snapshot | 状态机是否正在应用快照。 | Gauge   |
| proposals_applied | 已应用的共识提案总数。      | Gauge   |
| last_log_index    | 最后一个日志条目的索引。                     | Gauge   |
| current_term      | 当前任期。                                     | Gauge   |
| proposals_pending | 待处理的提案总数。                | Gauge   |
| proposals_failed  | 失败的提案总数。                 | Counter |
| watchers          | 当前活跃的观察者总数。                  | Gauge   |

`current_leader_id` 指示当前集群的领导者 ID，0 表示没有领导者。如果集群没有领导者，则不可用。

`is_leader` 指示此 `metasrv` 当前是否为集群的领导者，而 `leader_changes` 显示自启动以来的领导者变更总数。如果领导者变更过于频繁，将会影响 `metasrv` 的性能，同时也表明集群不稳定。

当且仅当节点状态为 `Follower` 或 `Leader` 时，`node_is_health` 为 1，否则为 0。

`proposals_applied` 记录已应用的写请求总数。

`last_log_index` 记录已追加到此 Raft 节点的日志的最后一个日志索引，`current_term` 记录 Raft 节点的当前任期。

`proposals_pending` 指示当前排队等待提交的提案数量。待处理提案的增加表明客户端负载较高或成员无法提交提案。

`proposals_failed` 显示失败的写请求总数，通常与两个问题相关：与领导者选举相关的临时故障或集群中失去法定人数导致的长时间停机。

`watchers` 显示当前活跃的观察者总数。

### Raft 网络

这些指标描述了 `metasrv` 中 Raft 节点的网络状态。所有这些指标都以 `metasrv_raft_network_` 为前缀。

| 名称                    | 描述                                       | 标签                            | 类型      |
|-------------------------|---------------------------------------------------|-----------------------------------|-----------|
| active_peers            | 当前与对等节点的活跃连接数。    | id(节点 ID),address(对等地址) | Gauge     |
| fail_connect_to_peer    | 与对等节点的失败连接总数。        | id(节点 ID),address(对等地址) | Counter   |
| sent_bytes              | 发送到对等节点的字节总数。              | to(节点 ID)                       | Counter   |
| recv_bytes              | 从对等节点接收的字节总数。        | from(远程地址)              | Counter   |
| sent_failures           | 发送到对等节点的失败总数。           | to(节点 ID)                       | Counter   |
| snapshot_send_success   | 成功发送快照的总数。        | to(节点 ID)                       | Counter   |
| snapshot_send_failures  | 发送快照失败的总数。           | to(节点 ID)                       | Counter   |
| snapshot_send_inflights | 正在发送的快照总数。          | to(节点 ID)                       | Gauge     |
| snapshot_sent_seconds   | 发送快照的总延迟分布。    | to(节点 ID)                       | Histogram |
| snapshot_recv_success   | 成功接收快照的总数。      | from(远程地址)              | Counter   |
| snapshot_recv_failures  | 接收快照失败的总数。        | from(远程地址)              | Counter   |
| snapshot_recv_inflights | 正在接收的快照总数。       | from(远程地址)              | Gauge     |
| snapshot_recv_seconds   | 接收快照的总延迟分布。 | from(远程地址)              | Histogram |

`active_peers` 指示集群成员之间的活跃连接数，`fail_connect_to_peer` 指示与对等节点的失败连接数。每个指标都有标签：id(节点 ID) 和 address(对等地址)。

`sent_bytes` 和 `recv_bytes` 记录发送到和对等节点接收的字节数，`sent_failures` 记录发送到对等节点的失败数。

`snapshot_send_success` 和 `snapshot_send_failures` 指示成功和失败的发送快照数。`snapshot_send_inflights` 指示正在发送的快照数，每次发送快照时，此字段将增加一，发送快照完成后，此字段将减少一。

`snapshot_sent_seconds` 指示发送快照的总延迟分布。

`snapshot_recv_success` 和 `snapshot_recv_failures` 指示成功和失败的接收快照数。`snapshot_recv_inflights` 指示正在接收的快照数，每次接收快照时，此字段将增加一，接收快照完成后，此字段将减少一。

`snapshot_recv_seconds` 指示接收快照的总延迟分布。

### Raft 存储

这些指标描述了 `metasrv` 中 Raft 节点的存储状态。所有这些指标都以 `metasrv_raft_storage_` 为前缀。

| 名称                    | 描述                                | 标签              | 类型    |
|-------------------------|--------------------------------------------|---------------------|---------|
| raft_store_write_failed | Raft 存储写入失败的总数。 | func(函数名称) | Counter |
| raft_store_read_failed  | Raft 存储读取失败的总数。  | func(函数名称) | Counter |

`raft_store_write_failed` 和 `raft_store_read_failed` 指示 Raft 存储写入和读取失败的总数。

### 元数据网络

这些指标描述了 `metasrv` 中元数据服务的网络状态。所有这些指标都以 `metasrv_meta_network_` 为前缀。

| 名称              | 描述                                            | 类型      |
|-------------------|--------------------------------------------------------|-----------|
| sent_bytes        | 发送到元数据 gRPC 客户端的字节总数。        | Counter   |
| recv_bytes        | 从元数据 gRPC 客户端接收的字节总数。      | Counter   |
| inflights         | 正在处理的元数据 gRPC 请求总数。           | Gauge     |
| req_success       | 元数据 gRPC 客户端成功请求的总数。 | Counter   |
| req_failed        | 元数据 gRPC 客户端失败请求的总数。    | Counter   |
| rpc_delay_seconds | 元数据服务 API 的延迟分布（秒）。    | Histogram |

## 查询指标

以下是 Databend 捕获的查询指标列表。

| 名称                                                            | 类型      | 描述                                                                                                                                                  | 标签                                                                                                                                                  |
|-----------------------------------------------------------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| databend_cache_access_count                                     | Counter   | 缓存访问次数。                                                                                                                                    | cache_name                                                                                                                                              |
| databend_cache_hit_count                                        | Counter   | 不同缓存类型的缓存命中次数。                                                                                                   | cache_name                                                                                                                                              |
| databend_cache_miss_count                                       | Counter   | 缓存未命中次数。                                                                                                                                      | cache_name                                                                                                                                              |
| databend_cache_miss_load_millisecond                            | Histogram | 缓存未命中加载时间的分布。                                                                                                                       | cache_name                                                                                                                                              |
| databend_cluster_discovered_node                                | Gauge     | 报告外部暴露的已发现节点的信息。                                                                                               | local_id, cluster_id, tenant_id, flight_address                                                                                                         |
| databend_compact_hook_compaction_ms                             | Histogram | 压缩操作所花费时间的直方图。                                                                                                        | operation                                                                                                                                               |
| databend_compact_hook_execution_ms                              | Histogram | 压缩钩子操作执行时间的分布。                                                                                                  | operation: MergeInto, Insert                                                                                                                            |
| databend_fuse_block_index_read_bytes                            | Counter   | 块索引读取的字节数。                                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_index_write_bytes_total                     | Counter   | 索引块写入的总字节数。                                                                                                              |                                                                                                                                                         |
| databend_fuse_block_index_write_milliseconds                    | Histogram | 写入索引块所花费时间的分布。                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_index_write_nums_total                      | Counter   | 写入的索引块总数。                                                                                                                        |                                                                                                                                                         |
| databend_fuse_block_write_bytes                                 | Counter   | 写入的总字节数。                                                                                                                               |                                                                                                                                                         |
| databend_fuse_block_write_millioseconds                         | Histogram | 写入块所花费时间的分布。                                                                                                                  |                                                                                                                                                         |
| databend_fuse_block_write_nums                                  | Counter   | 写入的块总数。                                                                                                                              |                                                                                                                                                         |
| databend_fuse_blocks_bloom_pruning_after                        | Counter   | 执行块级布隆剪枝后的块数。                                                                                                  |                                                                                                                                                         |
| databend_fuse_blocks_bloom_pruning_before                       | Counter   | 执行块级布隆剪枝前的块数。                                                                                                 |                                                                                                                                                         |
| databend_fuse_blocks_range_pruning_after                        | Counter   | 执行块级范围剪枝后的块数。                                                                                                  |                                                                                                                                                         |
| databend_fuse_blocks_range_pruning_before                       | Counter   | 执行块级范围剪枝前的块数。                                                                                                 |                                                                                                                                                         |
| databend_fuse_bytes_block_bloom_pruning_after                   | Counter   | 执行块级布隆剪枝后的数据大小（字节）。                                                                                                |                                                                                                                                                         |
| databend_fuse_bytes_block_bloom_pruning_before                  | Counter   | 执行块级布隆剪枝前的数据大小（字节）。                                                                                               |                                                                                                                                                         |
| databend_fuse_bytes_segment_range_pruning_after                 | Counter   | 执行段级范围剪枝后的数据大小（字节）。                                                                                              |                                                                                                                                                         |
| databend_fuse_bytes_segment_range_pruning_before                | Counter   | 执行段级范围剪枝前的数据大小（字节）。                                                                                             |                                                                                                                                                         |
| databend_fuse_commit_aborts                                     | Counter   | 由于错误导致提交中止的次数。                                                                                                                |                                                                                                                                                         |
| databend_fuse_commit_copied_files                               | Counter   | 提交操作期间复制的文件总数。                                                                                                       |                                                                                                                                                         |
| databend_fuse_commit_milliseconds                               | Counter   | 提交突变所花费的总时间。                                                                                                                       |                                                                                                                                                         |
| databend_fuse_commit_mutation_modified_segment_exists_in_latest | Counter   | 最新提交突变中存在修改段的数量。                                                                                     |                                                                                                                                                         |
| databend_fuse_commit_mutation_success                           | Counter   | 成功提交的突变次数。                                                                                                                    |                                                                                                                                                         |
| databend_fuse_commit_mutation_unresolvable_conflict             | Counter   | 发生不可解决提交冲突的次数。                                                                                                      |                                                                                                                                                         |
| databend_fuse_compact_block_build_lazy_part_milliseconds        | Histogram | 压缩期间构建惰性部分所花费时间的分布。                                                                                     |                                                                                                                                                         |
| databend_fuse_compact_block_build_task_milliseconds             | Histogram | 构建压缩块所花费时间的分布。                                                                                                   |                                                                                                                                                         |
| databend_fuse_compact_block_read_bytes                          | Counter   | 压缩期间读取块的累积大小（字节）。                                                                                                  |                                                                                                                                                         |
| databend_fuse_compact_block_read_milliseconds                   | Histogram | 压缩期间读取块所花费时间的直方图。                                                                                                    |                                                                                                                                                         |
| databend_fuse_compact_block_read_nums                           | Counter   | 压缩期间读取的块数。                                                                                                          |                                                                                                                                                         |
| databend_fuse_pruning_milliseconds                              | Histogram | 剪枝段所花费的时间。                                                                                                                              |                                                                                                                                                         |
| databend_fuse_remote_io_deserialize_milliseconds                | Histogram | 将原始数据解压缩和反序列化为DataBlocks所花费的时间。                                                                                      |                                                                                                                                                         |
| databend_fuse_remote_io_read_bytes                              | Counter   | 从对象存储读取的累积字节数。                                                                                                         |                                                                                                                                                         |
| databend_fuse_remote_io_read_bytes_after_merged                 | Counter   | 合并后从对象存储读取的累积字节数。                                                                                           |                                                                                                                                                         |
| databend_fuse_remote_io_read_milliseconds                       | Histogram | 从S3读取所花费时间的直方图。                                                                                                                     |                                                                                                                                                         |
| databend_fuse_remote_io_read_parts                              | Counter   | 从对象存储读取的分区表数据块的累积计数。                                                                                  |                                                                                                                                                         |
| databend_fuse_remote_io_seeks                                   | Counter   | 从对象存储读取期间独立IO操作的累积计数。                                                                              |                                                                                                                                                         |
| databend_fuse_remote_io_seeks_after_merged                      | Counter   | 从对象存储读取期间IO合并的累积计数。                                                                                              |                                                                                                                                                         |
| databend_fuse_segments_range_pruning_after                      | Counter   | 执行段级范围剪枝后的段数。                                                                                              |                                                                                                                                                         |
| databend_fuse_segments_range_pruning_before                     | Counter   | 执行段级范围剪枝前的段数。                                                                                             |                                                                                                                                                         |
| databend_merge_into_accumulate_milliseconds                     | Histogram | 合并操作的总体时间分布。                                                                                                              |                                                                                                                                                         |
| databend_merge_into_append_blocks_counter                       | Counter   | 合并操作中写入的块总数。                                                                                                                |                                                                                                                                                         |
| databend_merge_into_append_blocks_rows_counter                  | Counter   | 合并操作中写入的行总数。                                                                                                                  |                                                                                                                                                         |
| databend_merge_into_apply_milliseconds                          | Histogram | 合并操作的时间分布。                                                                                                                 |                                                                                                                                                         |
| databend_merge_into_matched_operation_milliseconds              | Histogram | 合并操作中匹配操作的时间分布。                                                                                                |                                                                                                                                                         |
| databend_merge_into_matched_rows                                | Counter   | 合并操作中匹配的行总数。                                                                                                            |                                                                                                                                                         |
| databend_merge_into_not_matched_operation_milliseconds          | Histogram | 合并操作中“未匹配”部分的时间分布。                                                                                           |                                                                                                                                                         |
| databend_merge_into_replace_blocks_counter                      | Counter   | 合并操作生成的替换块数。                                                                                                  |                                                                                                                                                         |
| databend_merge_into_replace_blocks_rows_counter                 | Counter   | 合并操作替换的行数。                                                                                                                 |                                                                                                                                                         |
| databend_merge_into_split_milliseconds                          | Histogram | 合并操作拆分所花费的时间。                                                                                                                   |                                                                                                                                                         |
| databend_merge_into_unmatched_rows                              | Counter   | 合并操作中未匹配的行总数。                                                                                                                |                                                                                                                                                         |
| databend_meta_grpc_client_request_duration_ms                   | Histogram | 向元领导者发出的不同类型请求（Upsert、Txn、StreamList、StreamMGet、GetClientInfo）的请求持续时间分布。              | endpoint, request                                                                                                                                       |
| databend_meta_grpc_client_request_inflight                      | Gauge     | 当前连接到元的查询数。                                                                                                            |                                                                                                                                                         |
| databend_meta_grpc_client_request_success                       | Counter   | 向元发出的成功请求数。                                                                                                                   | endpoint, request                                                                                                                                       |
| databend_opendal_bytes                                          | Counter   | OpenDAL端点读取和写入的总字节数。                                                                                              | scheme（操作使用的方案，例如“s3”），op（操作类型，例如“read”或“write”）                                             |
| databend_opendal_bytes_histogram                                | Histogram | 按操作划分的响应时间和计数的分布。                                                                                                      | scheme（操作使用的方案，例如“s3”），op（操作类型，例如“write”）                                                       |
| databend_opendal_errors                                         | Counter   | OpenDAL操作中遇到的错误及其类型的数量。                                                                                          | scheme（操作使用的方案，例如“s3”），op（操作类型，例如“read”），err（遇到的错误类型，例如“NotFound”） |
| databend_opendal_request_duration_seconds                       | Histogram | 向对象存储发出的OpenDAL请求的持续时间。                                                                                                              | scheme（操作使用的方案，例如“s3”），op（操作类型，例如“read”）                                                        |
| databend_opendal_requests                                       | Counter   | 使用OpenDAL发出的各种类型请求的数量。                                                                                                      | scheme（请求使用的方案，例如“s3”），op（操作类型，例如“batch”、“list”、“presign”、“read”、“write”、“delete”、“stat”）      |
| databend_process_cpu_seconds_total                              | Counter   | 用户和系统使用的总CPU时间（秒）。 | |
| databend_process_max_fds                                        | Gauge     | 最大打开文件描述符数。 | |
| databend_process_open_fds                                       | Gauge     | 打开的文件描述符数。 | |
| databend_process_resident_memory_bytes                          | Gauge     | 驻留内存大小（字节）。 | |
| databend_process_start_time_seconds                             | Gauge     | 进程自Unix纪元以来的启动时间（秒）。 | |
| databend_process_threads                                        | Gauge     | 使用的OS线程数。 | |
| databend_process_virtual_memory_bytes                           | Gauge     | 虚拟内存大小（字节）。 | |
| databend_query_duration_ms                                      | Histogram | 由各种处理程序发起的不同类型查询的执行时间分布。                                                     | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_error                                            | Counter   | 查询错误总数。                                                                                                                                | handler="HTTPQuery", kind="Other", tenant="wubx", cluster="w189"                                                                                        |
| databend_query_failed                                           | Counter   | 失败的请求总数。                                                                                                                             |                                                                                                                                                         |
| databend_query_http_requests_count                              | Counter   | 按方法、API端点和状态码分类的HTTP请求数。                                                                               | method, api, status                                                                                                                                     |
| databend_query_http_response_duration_seconds                   | Histogram | 按HTTP方法和API端点分类的查询响应时间分布。                                                                               | method, api, le, sum, count                                                                                                                             |
| databend_query_http_response_errors_count                       | Counter   | 请求错误的计数和类型。                                                                                                                          | code, err                                                                                                                                               |
| databend_query_result_bytes                                     | Counter   | 每个查询返回的数据总字节数。                                                                                                    | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_result_rows                                      | Counter   | 每个查询返回的数据行总数。                                                                                                            | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_bytes                                       | Counter   | 查询扫描的数据总字节数。                                                                                                              | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_io_bytes                                    | Counter   | 查询期间扫描和传输的数据总字节数。                                                                                         | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_io_bytes_cost_ms                            | Histogram | 查询期间IO扫描时间的分布。                                                                                                                 | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_partitions                                  | Counter   | 查询扫描的分区（块）总数。                                                                                                      | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_scan_rows                                        | Counter   | 查询扫描的数据行总数。                                                                                                                | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_start                                            | Counter   | 跟踪由不同处理程序发起的查询执行次数。它将查询分类为各种类型，如SELECT、UPDATE、INSERT等。 | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_success                                          | Counter   | 按类型分类的成功查询数。                                                                                                                        | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_total_partitions                                 | Counter   | 查询涉及的分区（块）总数。                                                                                                   | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_bytes                                      | Counter   | 查询写入的累积字节数。                                                                                                               | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_io_bytes                                   | Counter   | 查询写入和传输的数据总字节数。                                                                                                       | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_io_bytes_cost_ms                           | Histogram | 查询写入IO字节的时间成本。                                                                                                                   | handler, kind, tenant, cluster                                                                                                                          |
| databend_query_write_rows                                       | Counter   | 查询写入的累积行数。                                                                                                                | handler, kind, tenant, cluster                                                                                                                          |
| databend_session_close_numbers                                  | Counter   | 会话关闭次数。                                                                                                                                  |                                                                                                                                                         |
| databend_session_connect_numbers                                | Counter   | 记录自系统启动以来连接到节点的累积总数。                                                               |                                                                                                                                                         |
| databend_session_connections                                    | Gauge     | 测量当前连接到节点的活动连接数。                                                                                              |                                                                                                                                                         |
| databend_session_queue_acquire_duration_ms                      | Histogram | 等待队列获取时间的分布。                                                                                                              |                                                                                                                                                         |
| databend_session_queued_queries                                 | Gauge     | 当前查询队列中的SQL查询数。                                                                                                          |                                                                                                                                                         |
| databend_session_running_acquired_queries                       | Gauge     | 当前运行会话中获取的查询数。                                                                                                   |                                                                                                                                                         |