---
title: Databend 指标
sidebar_label: Databend 指标
description: 元数据和查询服务指标
---

指标对于监控系统的性能和健康状况至关重要。Databend 收集并存储两种类型的指标，元数据指标和查询指标，格式为 [Prometheus](http://prometheus.io/docs/instrumenting/exposition_formats/)。元数据指标用于实时监控和调试 Metasrv 组件，而查询指标用于监控 Databend-query 组件的性能。

您可以通过以下 URL 使用网络浏览器访问指标：

- 元数据指标：`http://<admin_api_address>/v1/metrics`。默认为 `0.0.0.0:28101/v1/metrics`。
- 查询指标：`http://<metric_api_address>/metrics`。默认为 `0.0.0.0:7070/metrics`。

:::tip
另外，您可以使用第三方工具来可视化指标。有关支持的工具和集成教程，请参阅 **监控** > **使用第三方工具**。当采用 Prometheus & Grafana 解决方案时，您可以使用我们提供的仪表板模板创建仪表板，可在[此处](https://github.com/datafuselabs/helm-charts/tree/main/dashboards)获取。更多详情，请查看 [Prometheus & Grafana](tools/prometheus-and-grafana.md) 指南。
:::

## 元数据指标

以下是 Databend 捕获的元数据指标列表。

### 服务器

这些指标描述了 `metasrv` 的状态。所有这些指标都以 `metasrv_server_` 为前缀。

| 名称              | 描述                                    | 类型    |
| ----------------- | --------------------------------------- | ------- |
| current_leader_id | 集群的当前领导者 id，0 表示没有领导者。 | Gauge   |
| is_leader         | 此节点是否为当前领导者。                | Gauge   |
| node_is_health    | 此节点是否健康。                        | Gauge   |
| leader_changes    | 见到的领导者变更次数。                  | Counter |
| applying_snapshot | 状态机是否正在应用快照。                | Gauge   |
| proposals_applied | 应用的共识提案总数。                    | Gauge   |
| last_log_index    | 最后日志条目的索引。                    | Gauge   |
| current_term      | 当前任期。                              | Gauge   |
| proposals_pending | 挂起的提案总数。                        | Gauge   |
| proposals_failed  | 失败的提案总数。                        | Counter |
| watchers          | 活跃观察者的总数。                      | Gauge   |

`current_leader_id` 表示集群的当前领导者 id，0 表示没有领导者。如果一个集群没有领导者，它就不可用。

`is_leader` 表示这个 `metasrv` 当前是否是集群的领导者，而 `leader_changes` 显示自启动以来领导者变更的总次数。如果领导者变更太频繁，它将影响 `metasrv` 的性能，也表明集群不稳定。

只有当节点状态为 `Follower` 或 `Leader` 时，`node_is_health` 才为 1，否则为 0。

`proposals_applied` 记录了应用的写请求总数。

`last_log_index` 记录了已追加到此 Raft 节点日志的最后日志索引，`current_term` 记录了 Raft 节点的当前任期。

`proposals_pending` 表示当前有多少提案排队等待提交。挂起的提案增加表明客户端负载高或成员无法提交提案。

`proposals_failed` 显示了失败的写请求总数，它通常与两个问题有关：与领导者选举相关的临时失败或由于集群失去法定人数导致的较长停机时间。

`watchers` 显示了当前的活跃观察者总数。

### Raft 网络

这些指标描述了 `metasrv` 中 raft 节点的网络状态。所有这些指标都以 `metasrv_raft_network_` 为前缀。

| 名称                    | 描述                       | 标签                          | 类型      |
| ----------------------- | -------------------------- | ----------------------------- | --------- |
| active_peers            | 当前与对等方的活跃连接数。 | id(节点 id),address(对等地址) | Gauge     |
| fail_connect_to_peer    | 与对等方连接失败的总次数。 | id(节点 id),address(对等地址) | Counter   |
| sent_bytes              | 发送给对等方的字节总数。   | to(节点 id)                   | Counter   |
| recv_bytes              | 从对等方接收的字节总数。   | from(远程地址)                | Counter   |
| sent_failures           | 发送给对等方失败的总次数。 | to(节点 id)                   | Counter   |
| snapshot_send_success   | 成功发送快照的总次数。     | to(节点 id)                   | Counter   |
| snapshot_send_failures  | 快照发送失败的总次数。     | to(节点 id)                   | Counter   |
| snapshot_send_inflights | 飞行中快照发送的总次数。   | to(节点 id)                   | Gauge     |
| snapshot_sent_seconds   | 快照发送的总延迟分布。     | to(节点 id)                   | Histogram |
| snapshot_recv_success   | 成功接收快照的总次数。     | from(远程地址)                | Counter   |
| snapshot_recv_failures  | 快照接收失败的总次数。     | from(远程地址)                | Counter   |
| snapshot_recv_inflights | 飞行中快照接收的总次数。   | from(远程地址)                | Gauge     |
| snapshot_recv_seconds   | 快照接收的总延迟分布。     | from(远程地址)                | Histogram |

`active_peers` 表示集群成员之间的活跃连接数，`fail_connect_to_peer` 表示连接到对等节点失败的次数。每个都有标签：id（节点 id）和 address（对等节点地址）。

`sent_bytes` 和 `recv_bytes` 记录发送给对等节点和从对等节点接收的字节数，`sent_failures` 记录发送给对等节点失败的次数。

`snapshot_send_success` 和 `snapshot_send_failures` 表示发送快照成功和失败的次数。`snapshot_send_inflights` 表示正在发送的快照数，每次发送快照时，此字段将增加一，发送快照完成后，此字段将减少一。

`snapshot_sent_seconds` 表示发送快照的总延迟分布。

`snapshot_recv_success` 和 `snapshot_recv_failures` 表示接收快照成功和失败的次数。`snapshot_recv_inflights` 表示正在接收的快照数，每次接收快照时，此字段将增加一，接收快照完成后，此字段将减少一。

`snapshot_recv_seconds` 表示接收快照的总延迟分布。

### Raft 存储

这些指标描述了 `metasrv` 中 raft 节点的存储状态。所有这些指标都以 `metasrv_raft_storage_` 为前缀。

| 名称                    | 描述                        | 标签           | 类型   |
| ----------------------- | --------------------------- | -------------- | ------ |
| raft_store_write_failed | raft 存储写入失败的总次数。 | func(函数名称) | 计数器 |
| raft_store_read_failed  | raft 存储读取失败的总次数。 | func(函数名称) | 计数器 |

`raft_store_write_failed` 和 `raft_store_read_failed` 表示 raft 存储写入和读取失败的总次数。

### Meta 网络

这些指标描述了 `metasrv` 中元服务的网络状态。所有这些指标都以 `metasrv_meta_network_` 为前缀。

| 名称              | 描述                                     | 类型   |
| ----------------- | ---------------------------------------- | ------ |
| sent_bytes        | 发送给 meta grpc 客户端的总字节数。      | 计数器 |
| recv_bytes        | 从 meta grpc 客户端接收的总字节数。      | 计数器 |
| inflights         | 正在进行的 meta grpc 请求的总数。        | 仪表   |
| req_success       | 来自 meta grpc 客户端的成功请求总数。    | 计数器 |
| req_failed        | 来自 meta grpc 客户端的失败请求总数。    | 计数器 |
| rpc_delay_seconds | 以秒为单位的 meta-service API 延迟分布。 | 直方图 |

## 查询指标

以下是 Databend 捕获的查询指标列表。

| 名称                                 | 类型    | 描述                                         | 标签                                                                |
| ------------------------------------ | ------- | -------------------------------------------- | ------------------------------------------------------------------- |
| cluster_discovered_node_gauge        | gauge   | 当前集群中发现的节点数量。                   | tenant_id, cluster_id, flight_address 和 local_id(集群内部唯一标识) |
| interpreter_usedtime                 | summary | SQL 解释器使用时间。                         |                                                                     |
| meta_grpc_client_request_duration_ms | summary | 请求远程元数据服务所用的时间。               | endpoint, request                                                   |
| meta_grpc_client_request_inflight    | gauge   | 当前正在进行的远程元数据服务请求。           |                                                                     |
| meta_grpc_client_request_success     | counter | 成功请求远程元数据服务的总次数。             |                                                                     |
| mysql_process_request_duration       | summary | MySQL 交互式处理请求所用时间。               |                                                                     |
| opendal_bytes_total                  | counter | opendal 处理的总数据大小（以字节为单位）。   | operation, service                                                  |
| opendal_errors_total                 | counter | opendal 操作的总错误计数。                   | operation, service                                                  |
| opendal_failures_total               | counter | opendal 操作的总失败计数。                   | operation, service                                                  |
| opendal_requests_duration_seconds    | summary | opendal 请求远程存储后端所用的时间。         | operation, service                                                  |
| opendal_requests_total               | counter | opendal 操作的总计数。                       | operation, service                                                  |
| query_duration_ms                    | summary | 每个单独查询所用的时间。                     | tenant, cluster, handler, kind                                      |
| query_result_bytes                   | counter | 查询结果返回的总数据大小（以字节为单位）。   | tenant, cluster, handler, kind                                      |
| query_result_rows                    | counter | 查询结果返回的总数据行数。                   | tenant, cluster, handler, kind                                      |
| query_scan_bytes                     | counter | 查询扫描的总数据大小（以字节为单位）。       | tenant, cluster, handler, kind                                      |
| query_scan_io_bytes                  | counter | 查询扫描传输的总数据大小（以字节为单位）。   | tenant, cluster, handler, kind                                      |
| query_scan_partitions                | counter | 查询扫描的总分区数。                         | tenant, cluster, handler, kind                                      |
| query_scan_rows                      | counter | 查询扫描的总数据行数。                       | tenant, cluster, handler, kind                                      |
| query_start                          | counter | 查询开始的总次数。                           | tenant, cluster, handler, kind                                      |
| query_success                        | counter | 查询成功的总次数。                           | tenant, cluster, handler, kind                                      |
| query_total_partitions               | counter | 查询的总分区数。                             | tenant, cluster, handler, kind                                      |
| query_write_bytes                    | counter | 查询写入的总数据大小（以字节为单位）。       | tenant, cluster, handler, kind                                      |
| query_write_io_bytes                 | counter | 查询写入和传输的总数据大小（以字节为单位）。 | tenant, cluster, handler, kind                                      |
| query_write_rows                     | counter | 查询写入的总数据行数。                       | tenant, cluster, handler, kind                                      |
| session_close_numbers                | counter | 自服务器启动以来已断开连接的会话数。         | tenant, cluster_name                                                |
| session_connect_numbers              | counter | 自服务器启动以来已建立连接的会话数。         | tenant, cluster_name                                                |
