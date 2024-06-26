---
title: Databend 指标
sidebar_label: Databend 指标
description: 
  元数据与查询服务指标
---

指标对于监控系统的性能和健康状况至关重要。Databend 收集并存储两种类型的指标：元数据指标和查询指标，格式遵循 [Prometheus](http://prometheus.io/docs/instrumenting/exposition_formats/)。元数据指标用于实时监控和调试 Metasrv 组件，而查询指标则用于监控 Databend-query 组件的性能。

您可以通过以下 URL 使用网络浏览器访问这些指标：

- 元数据指标：`http://<admin_api_address>/v1/metrics`。默认值为 `0.0.0.0:28101/v1/metrics`。
- 查询指标：`http://<metric_api_address>/metrics`。默认值为 `0.0.0.0:7070/metrics`。

:::tip
或者，您可以使用第三方工具来可视化这些指标。有关支持的工具和集成教程，请参阅 **监控** > **使用第三方工具**。当采用 Prometheus & Grafana 解决方案时，您可以使用我们提供的仪表板模板创建仪表板，模板地址为 [此处](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)。更多详情，请查看 [Prometheus & Grafana](tools/prometheus-and-grafana.md) 指南。
:::

## 元数据指标

以下是 Databend 捕获的元数据指标列表。

### 服务器

这些指标描述了 `metasrv` 的状态。所有这些指标都以前缀 `metasrv_server_` 开头。

| 名称              | 描述                                       | 类型    |
|-------------------|---------------------------------------------------|---------|
| current_leader_id | 集群当前的领导者 ID，0 表示没有领导者。          | Gauge   |
| is_leader         | 此节点是否为当前领导者。                         | Gauge   |
| node_is_health    | 此节点是否健康。                               | Gauge   |
| leader_changes    | 观察到的领导者变更次数。                         | Counter |
| applying_snapshot | 状态机是否正在应用快照。                       | Gauge   |
| proposals_applied | 已应用的共识提案总数。                         | Gauge   |
| last_log_index    | 最后一条日志条目的索引。                       | Gauge   |
| current_term      | 当前任期。                                     | Gauge   |
| proposals_pending | 当前待提交的提案总数。                         | Gauge   |
| proposals_failed  | 失败的提案总数。                               | Counter |
| watchers          | 当前活跃的观察者总数。                         | Gauge   |

`current_leader_id` 表示集群当前的领导者 ID，0 表示没有领导者。如果集群没有领导者，则不可用。

`is_leader` 表示此 `metasrv` 当前是否为集群的领导者，而 `leader_changes` 显示自启动以来的领导者变更总数。如果领导者变更过于频繁，将影响 `metasrv` 的性能，也表明集群不稳定。

仅当节点状态为 `Follower` 或 `Leader` 时，`node_is_health` 为 1，否则为 0。

`proposals_applied` 记录已应用的写请求总数。

`last_log_index` 记录已追加到此 Raft 节点日志的最后一条日志索引，`current_term` 记录 Raft 节点的当前任期。

`proposals_pending` 表示当前待提交的提案数量。待提交提案数量的增加表明客户端负载较高或成员无法提交提案。

`proposals_failed` 显示失败的写请求总数，通常与两个问题相关：与领导者选举相关的临时故障或由于集群中失去法定人数导致的长时间停机。

`watchers` 显示当前活跃的观察者总数。

### Raft 网络

这些指标描述了 `metasrv` 中 Raft 节点的网络状态。所有这些指标都以前缀 `metasrv_raft_network_` 开头。

| 名称                    | 描述                                       | 标签                            | 类型      |
|-------------------------|---------------------------------------------------|-----------------------------------|-----------|
| active_peers            | 当前与对等节点活跃连接的数量。                  | id(节点 ID), address(对等地址)   | Gauge     |
| fail_connect_to_peer    | 与对等节点连接失败的总数。                      | id(节点 ID), address(对等地址)   | Counter   |
| sent_bytes              | 向对等节点发送的字节总数。                      | to(节点 ID)                      | Counter   |
| recv_bytes              | 从对等节点接收的字节总数。                      | from(远程地址)                   | Counter   |
| sent_failures           | 向对等节点发送失败的次数。                      | to(节点 ID)                      | Counter   |
| snapshot_send_success   | 成功发送的快照总数。                          | to(节点 ID)                      | Counter   |
| snapshot_send_failures  | 发送快照失败的次数。                          | to(节点 ID)                      | Counter   |
| snapshot_send_inflights | 正在发送的快照总数。                          | to(节点 ID)                      | Gauge     |
| snapshot_sent_seconds   | 快照发送的延迟分布（秒）。                    | to(节点 ID)                      | Histogram |
| snapshot_recv_success   | 成功接收的快照总数。                          | from(远程地址)                   | Counter   |
| snapshot_recv_failures  | 接收快照失败的次数。                          | from(远程地址)                   | Counter   |
| snapshot_recv_inflights | 正在接收的快照总数。                          | from(远程地址)                   | Gauge     |
| snapshot_recv_seconds   | 快照接收的延迟分布（秒）。                    | from(远程地址)                   | Histogram |

`active_peers` 表示集群成员之间活跃连接的数量，`fail_connect_to_peer` 表示与对等节点连接失败的次数。每个指标都有标签：id(节点 ID) 和 address(对等地址)。

`sent_bytes` 和 `recv_bytes` 记录向和对等节点发送和接收的字节数，而 `sent_failures` 记录向对等节点发送失败的次数。

`snapshot_send_success` 和 `snapshot_send_failures` 表示成功和失败发送的快照数量。`snapshot_send_inflights` 表示正在发送的快照数量，每次发送快照时，此字段将增加一，发送快照完成后，此字段将减少一。

`snapshot_sent_seconds` 表示快照发送的延迟分布（秒）。

`snapshot_recv_success` 和 `snapshot_recv_failures` 表示成功和失败接收的快照数量。`snapshot_recv_inflights` 表示正在接收的快照数量，每次接收快照时，此字段将增加一，接收快照完成后，此字段将减少一。

`snapshot_recv_seconds` 表示快照接收的延迟分布（秒）。

### Raft 存储

这些指标描述了 `metasrv` 中 Raft 节点的存储状态。所有这些指标都以前缀 `metasrv_raft_storage_` 开头。

| 名称                    | 描述                                       | 标签              | 类型    |
|-------------------------|--------------------------------------------|---------------------|---------|
| raft_store_write_failed | Raft 存储写入失败的总数。                  | func(函数名)       | Counter |
| raft_store_read_failed  | Raft 存储读取失败的总数。                   | func(函数名)       | Counter |

`raft_store_write_failed` 和 `raft_store_read_failed` 表示 Raft 存储写入和读取失败的总数。

### 元数据网络

这些指标描述了 `metasrv` 中元数据服务的网络状态。所有这些指标都以前缀 `metasrv_meta_network_` 开头。

| 名称              | 描述                                       | 类型      |
|-------------------|--------------------------------------------|-----------|
| sent_bytes        | 向元数据 gRPC 客户端发送的字节总数。         | Counter   |
| recv_bytes        | 从元数据 gRPC 客户端接收的字节总数。         | Counter   |
| inflights         | 正在进行的元数据 gRPC 请求总数。             | Gauge     |
| req_success       | 元数据 gRPC 客户端成功请求的总数。           | Counter   |
| req_failed        | 元数据 gRPC 客户端失败请求的总数。           | Counter   |
| rpc_delay_seconds | 元数据服务 API 的延迟分布（秒）。           | Histogram |

## 查询指标

以下是 Databend 捕获的查询指标列表。

| 名称                                                                 | 类型      | 描述                                                                                                                                                     | 标签                                                                                     |
|----------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| databend_cache_access_count                                         | 计数器    | 缓存访问次数。                                                                                                                                           | cache_name                                                                                |
| databend_cache_hit_count                                            | 计数器    | 不同类型缓存的命中次数。                                                                                                                                 | cache_name                                                                                |
| databend_cache_miss_count                                           | 计数器    | 缓存未命中次数。                                                                                                                                         | cache_name                                                                                |
| databend_cache_miss_load_millisecond                                | 直方图    | 缓存未命中加载时间的分布。                                                                                                                               | cache_name                                                                                |
| databend_cluster_discovered_node                                    | 测量表    | 报告外部暴露的已发现节点的信息。                                                                                                                         | local_id, cluster_id, tenant_id, flight_address                                           |
| databend_compact_hook_compaction_ms                                 | 直方图    | 压缩操作所花费时间的直方图。                                                                                                                             | operation                                                                                 |
| databend_compact_hook_execution_ms                                  | 直方图    | 压缩钩子操作执行时间的分布。                                                                                                                             | operation: MergeInto, Insert                                                              |
| databend_fuse_block_index_read_bytes                                | 计数器    | 块索引读取的字节数。                                                                                                                                     |                                                                                          |
| databend_fuse_block_index_write_bytes_total                         | 计数器    | 索引块写入的总字节数。                                                                                                                                   |                                                                                          |
| databend_fuse_block_index_write_milliseconds                        | 直方图    | 写入索引块所花费时间的分布。                                                                                                                             |                                                                                          |
| databend_fuse_block_index_write_nums_total                          | 计数器    | 写入的索引块总数。                                                                                                                                       |                                                                                          |
| databend_fuse_block_write_bytes                                     | 计数器    | 写入的总字节数。                                                                                                                                         |                                                                                          |
| databend_fuse_block_write_millioseconds                             | 直方图    | 写入块所花费时间的分布。                                                                                                                                 |                                                                                          |
| databend_fuse_block_write_nums                                      | 计数器    | 写入的块总数。                                                                                                                                           |                                                                                          |
| databend_fuse_blocks_bloom_pruning_after                            | 计数器    | 执行块级布隆剪枝后的块数。                                                                                                                               |                                                                                          |
| databend_fuse_blocks_bloom_pruning_before                           | 计数器    | 执行块级布隆剪枝前的块数。                                                                                                                               |                                                                                          |
| databend_fuse_blocks_range_pruning_after                            | 计数器    | 执行块级范围剪枝后的块数。                                                                                                                               |                                                                                          |
| databend_fuse_blocks_range_pruning_before                           | 计数器    | 执行块级范围剪枝前的块数。                                                                                                                               |                                                                                          |
| databend_fuse_bytes_block_bloom_pruning_after                       | 计数器    | 执行块级布隆剪枝后的数据大小（字节）。                                                                                                                   |                                                                                          |
| databend_fuse_bytes_block_bloom_pruning_before                      | 计数器    | 执行块级布隆剪枝前的数据大小（字节）。                                                                                                                   |                                                                                          |
| databend_fuse_bytes_segment_range_pruning_after                     | 计数器    | 执行段级范围剪枝后的数据大小（字节）。                                                                                                                   |                                                                                          |
| databend_fuse_bytes_segment_range_pruning_before                    | 计数器    | 执行段级范围剪枝前的数据大小（字节）。                                                                                                                   |                                                                                          |
| databend_fuse_commit_aborts                                         | 计数器    | 由于错误导致提交中止的次数。                                                                                                                             |                                                                                          |
| databend_fuse_commit_copied_files                                   | 计数器    | 提交操作期间复制的文件总数。                                                                                                                             |                                                                                          |
| databend_fuse_commit_milliseconds                                   | 计数器    | 提交突变所花费的总时间。                                                                                                                                 |                                                                                          |
| databend_fuse_commit_mutation_modified_segment_exists_in_latest     | 计数器    | 最新提交突变中存在修改段的计数。                                                                                                                         |                                                                                          |
| databend_fuse_commit_mutation_success                               | 计数器    | 成功提交的突变数。                                                                                                                                       |                                                                                          |
| databend_fuse_commit_mutation_unresolvable_conflict                 | 计数器    | 发生无法解决的提交冲突的次数。                                                                                                                           |                                                                                          |
| databend_fuse_compact_block_build_lazy_part_milliseconds            | 直方图    | 压缩期间构建惰性部分所花费时间的分布。                                                                                                                   |                                                                                          |
| databend_fuse_compact_block_build_task_milliseconds                 | 直方图    | 构建压缩块所花费时间的分布。                                                                                                                             |                                                                                          |
| databend_fuse_compact_block_read_bytes                              | 计数器    | 压缩期间读取块的累积大小（字节）。                                                                                                                       |                                                                                          |
| databend_fuse_compact_block_read_milliseconds                       | 直方图    | 压缩期间读取块所花费时间的直方图。                                                                                                                       |                                                                                          |
| databend_fuse_compact_block_read_nums                               | 计数器    | 压缩期间读取的块数。                                                                                                                                     |                                                                                          |
| databend_fuse_pruning_milliseconds                                  | 直方图    | 剪枝段所花费的时间。                                                                                                                                     |                                                                                          |
| databend_fuse_remote_io_deserialize_milliseconds                    | 直方图    | 将原始数据解压缩和反序列化为DataBlocks所花费的时间。                                                                                                     |                                                                                          |
| databend_fuse_remote_io_read_bytes                                  | 计数器    | 从对象存储读取的总字节数。                                                                                                                               |                                                                                          |
| databend_fuse_remote_io_read_bytes_after_merged                     | 计数器    | 合并后从对象存储读取的总字节数。                                                                                                                         |                                                                                          |
| databend_fuse_remote_io_read_milliseconds                           | 直方图    | 从S3读取所花费时间的直方图。                                                                                                                             |                                                                                          |
| databend_fuse_remote_io_read_parts                                  | 计数器    | 从对象存储读取的分区表数据块的累积计数。                                                                                                                 |                                                                                          |
| databend_fuse_remote_io_seeks                                       | 计数器    | 读取对象存储期间独立IO操作的累积计数。                                                                                                                   |                                                                                          |
| databend_fuse_remote_io_seeks_after_merged                          | 计数器    | 读取对象存储期间IO合并的累积计数。                                                                                                                       |                                                                                          |
| databend_fuse_segments_range_pruning_after                          | 计数器    | 执行段级范围剪枝后的段数。                                                                                                                               |                                                                                          |
| databend_fuse_segments_range_pruning_before                         | 计数器    | 执行段级范围剪枝前的段数。                                                                                                                               |                                                                                          |
| databend_merge_into_accumulate_milliseconds                         | 直方图    | 合并操作总体时间分布。                                                                                                                                   |                                                                                          |
| databend_merge_into_append_blocks_counter                           | 计数器    | 合并写入的块总数。                                                                                                                                       |                                                                                          |
| databend_merge_into_append_blocks_rows_counter                      | 计数器    | 合并写入的行总数。                                                                                                                                       |                                                                                          |
| databend_merge_into_apply_milliseconds                              | 直方图    | 合并写入操作的时间分布。                                                                                                                                 |                                                                                          |
| databend_merge_into_matched_operation_milliseconds                  | 直方图    | 合并操作中匹配操作的时间分布。                                                                                                                           |                                                                                          |
| databend_merge_into_matched_rows                                    | 计数器    | 合并操作中匹配的行总数。                                                                                                                                 |                                                                                          |
| databend_merge_into_not_matched_operation_milliseconds              | 直方图    | 合并写入操作中“未匹配”部分的时间分布。                                                                                                                   |                                                                                          |
| databend_merge_into_replace_blocks_counter                          | 计数器    | 合并操作生成的替换块数。                                                                                                                                 |                                                                                          |
| databend_merge_into_replace_blocks_rows_counter                     | 计数器    | 合并操作替换的行数。                                                                                                                                     |                                                                                          |
| databend_merge_into_split_milliseconds                              | 直方图    | 分割合并操作所花费的时间。                                                                                                                               |                                                                                          |
| databend_merge_into_unmatched_rows                                  | 计数器    | 合并写入中未匹配的行总数。                                                                                                                               |                                                                                          |
| databend_meta_grpc_client_request_duration_ms                       | 直方图    | 向元领导者发出的不同类型请求（Upsert, Txn, StreamList, StreamMGet, GetClientInfo）的请求持续时间分布。 | endpoint, request                                                                         |
| databend_meta_grpc_client_request_inflight                          | 测量表    | 当前连接到元的查询数量。                                                                                                                                 |                                                                                          |
| databend_meta_grpc_client_request_success                           | 计数器    | 向元发出的成功请求数。                                                                                                                                   | endpoint, request                                                                         |
| databend_opendal_bytes                                              | 计数器    | OpenDAL端点读写操作的总字节数。                                                                                                                          | scheme (操作使用的方案，如"s3"), op (操作类型，如"read"或"write")                         |
| databend_opendal_bytes_histogram                                    | 直方图    | 按操作分布的响应时间和计数。                                                                                                                             | scheme (操作使用的方案，如"s3"), op (操作类型，如"write")                                |
| databend_opendal_errors                                             | 计数器    | OpenDAL操作中遇到的错误及其类型。                                                                                                                        | scheme (操作使用的方案，如"s3"), op (操作类型，如"read"), err (遇到的错误类型，如"NotFound") |
| databend_opendal_request_duration_seconds                          | 直方图    | 向对象存储发出的OpenDAL请求的持续时间。                                                                                                                  | scheme (操作使用的方案，如"s3"), op (操作类型，如"read")                                |
| databend_opendal_requests                                           | 计数器    | 使用OpenDAL发出的各种类型请求的数量。                                                                                                                    | scheme (请求使用的方案，如"s3"), op (操作类型，如"batch", "list", "presign", "read", "write", "delete", "stat") |
| databend_query_duration_ms                                          | 直方图    | 由各种处理程序发起的不同类型查询的执行时间分布。                                                                                                         | handler, kind, tenant, cluster                                                            |
| databend_query_error                                                | 计数器    | 查询错误的总数。                                                                                                                                         | handler="HTTPQuery", kind="Other", tenant="wubx", cluster="w189"                           |
| databend_query_failed                                               | 计数器    | 失败请求的总数。                                                                                                                                         |                                                                                          |
| databend_query_http_requests_count                                  | 计数器    | 按方法、API端点和状态码分类的HTTP请求数。                                                                                                                | method, api, status                                                                       |
| databend_query_http_response_duration_seconds                       | 直方图    | 按HTTP方法和API端点分类的查询响应时间分布。                                                                                                              | method, api, le, sum, count                                                               |
| databend_query_http_response_errors_count                           | 计数器    | 请求错误的计数和类型。                                                                                                                                   | code, err                                                                                 |
| databend_query_result_bytes                                         | 计数器    | 每个查询返回的数据总字节数。                                                                                                                             | handler, kind, tenant, cluster                                                            |
| databend_query_result_rows                                          | 计数器    | 每个查询返回的数据行总数。                                                                                                                               | handler, kind, tenant, cluster                                                            |
| databend_query_scan_bytes                                           | 计数器    | 查询扫描的数据总大小（字节）。                                                                                                                           | handler, kind, tenant, cluster                                                            |
| databend_query_scan_io_bytes                                       | 计数器    | 查询期间扫描和传输的数据总大小（字节）。                                                                                                                 | handler, kind, tenant, cluster                                                            |
| databend_query_scan_io_bytes_cost_ms                                | 直方图    | 查询期间IO扫描时间的分布。                                                                                                                              | handler, kind, tenant, cluster                                                            |
| databend_query_scan_partitions                                      | 计数器    | 查询扫描的分区（块）总数。                                                                                                                               | handler, kind, tenant, cluster                                                            |
| databend_query_scan_rows                                            | 计数器    | 查询扫描的数据行总数。                                                                                                                                   | handler, kind, tenant, cluster                                                            |
| databend_query_start                                                | 计数器    | 由不同处理程序发起的查询执行次数。它将查询分为各种类型，如SELECT、UPDATE、INSERT等。                                                                   | handler, kind, tenant, cluster                                                            |
| databend_query_success                                              | 计数器    | 按类型分类的成功查询数。                                                                                                                                 | handler, kind, tenant, cluster                                                            |
| databend_query_total_partitions                                     | 计数器    | 查询涉及的分区（块）总数。                                                                                                                               | handler, kind, tenant, cluster                                                            |
| databend_query_write_bytes                                          | 计数器    | 查询写入的累积字节数。                                                                                                                                   | handler, kind, tenant, cluster                                                            |
| databend_query_write_io_bytes                                      | 计数器    | 查询写入和传输的数据总大小。                                                                                                                             | handler, kind, tenant, cluster                                                            |
| databend_query_write_io_bytes_cost_ms                               | 直方图    | 查询写入IO字节的时间成本。                                                                                                                               | handler, kind, tenant, cluster                                                            |
| databend_query_write_rows                                           | 计数器    | 查询写入的累积行数。                                                                                                                                     | handler, kind, tenant, cluster                                                            |
| databend_session_close_numbers                                      | 计数器    | 会话关闭的次数。                                                                                                                                         |                                                                                          |
| databend_session_connect_numbers                                    | 计数器    | 自系统启动以来连接到节点的累计总数。                                                                                                                     |                                                                                          |
| databend_session_connections                                        | 测量表    | 当前连接到节点的活动连接数。                                                                                                                             |                                                                                          |
| databend_session_queue_acquire_duration_ms                          | 直方图    | 等待队列获取时间的分布。                                                                                                                                 |                                                                                          |
| databend_session_queued_queries                                     | 测量表    | 当前在查询队列中的SQL查询数。                                                                                                                            |                                                                                          |
| databend_session_running_acquired_queries                           | 测量表    | 当前运行会话中已获取的查询数。                                                                                                                           |                                                                                          |