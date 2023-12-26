---
title: 元服务 HTTP API
sidebar_label: 元服务 HTTP API
description: 
  元服务 HTTP API
---

为了捕获和跟踪对您的分析有用的各种元数据统计信息，Databend 提供了许多 HTTP API。

:::note
除非另有说明，这些 HTTP API 默认使用端口 `28101`。要更改默认端口，请在配置文件 `databend-meta.toml` 中编辑 `admin_api_address` 的值。
:::

## 集群节点 API

返回集群中的所有元节点。

### 请求端点

`http://<address>:<port>/v1/cluster/nodes`

### 响应示例

```
[
  {
    name: "1",
    endpoint: { addr: "localhost", port: 28103 },
    grpc_api_addr: "0.0.0.0:9191",
  },
  {
    name: "2",
    endpoint: { addr: "localhost", port: 28104 },
    grpc_api_addr: "0.0.0.0:9192",
  },
];
```

## 集群状态 API

返回集群中每个元节点的状态信息。

### 请求端点

`http://<address>:<port>/v1/cluster/status`

### 响应示例

```json
{
  "id": 1,
  "endpoint": "localhost:28103",
  "db_size": 18899209,
  "state": "Follower",
  "is_leader": false,
  "current_term": 67,
  "last_log_index": 53067,
  "last_applied": { "term": 67, "index": 53067 },
  "leader": {
    "name": "2",
    "endpoint": { "addr": "localhost", "port": 28104 },
    "grpc_api_addr": "0.0.0.0:9192"
  },
  "voters": [
    {
      "name": "1",
      "endpoint": { "addr": "localhost", "port": 28103 },
      "grpc_api_addr": "0.0.0.0:9191"
    },
    {
      "name": "2",
      "endpoint": { "addr": "localhost", "port": 28104 },
      "grpc_api_addr": "0.0.0.0:9192"
    }
  ],
  "non_voters": [],
  "last_seq": 60665
}
```

## 元指标 API

显示 Databend 捕获和跟踪的关于元服务性能的一系列指标。有关元服务指标的更多信息，请参见 [Databend 元指标](../../70-monitor/10-metasrv-metrics.md)。

### 请求端点

`http://<address>:<port>/v1/metrics`

### 响应示例

```
# TYPE metasrv_meta_network_recv_bytes counter
metasrv_meta_network_recv_bytes 307163

# TYPE metasrv_server_leader_changes counter
metasrv_server_leader_changes 1

# TYPE metasrv_meta_network_req_success counter
metasrv_meta_network_req_success 3282

# TYPE metasrv_meta_network_sent_bytes counter
metasrv_meta_network_sent_bytes 1328402

# TYPE metasrv_server_node_is_health gauge
metasrv_server_node_is_health 1

# TYPE metasrv_server_is_leader gauge
metasrv_server_is_leader 1

# TYPE metasrv_server_proposals_applied gauge
metasrv_server_proposals_applied 810

# TYPE metasrv_server_last_seq gauge
metasrv_server_last_seq 753

# TYPE metasrv_server_current_term gauge
metasrv_server_current_term 1

# TYPE metasrv_meta_network_req_inflights gauge
metasrv_meta_network_req_inflights 0

# TYPE metasrv_server_proposals_pending gauge
metasrv_server_proposals_pending 0

# TYPE metasrv_server_last_log_index gauge
metasrv_server_last_log_index 810

# TYPE metasrv_server_current_leader_id gauge
metasrv_server_current_leader_id 1

# TYPE metasrv_meta_network_rpc_delay_seconds summary
metasrv_meta_network_rpc_delay_seconds{quantile="0"} 0.000227375
metasrv_meta_network_rpc_delay_seconds{quantile="0.5"} 0.0002439615242199244
metasrv_meta_network_rpc_delay_seconds{quantile="0.9"} 0.0002439615242199244
metasrv_meta_network_rpc_delay_seconds{quantile="0.95"} 0.0002439615242199244
metasrv_meta_network_rpc_delay_seconds{quantile="0.99"} 0.0002439615242199244
metasrv_meta_network_rpc_delay_seconds{quantile="0.999"} 0.0002439615242199244
metasrv_meta_network_rpc_delay_seconds{quantile="1"} 0.000563541
metasrv_meta_network_rpc_delay_seconds_sum 1.3146486719999995
metasrv_meta_network_rpc_delay_seconds_count 3283
```

## 快照触发 API

仅用于调试。强制 raft 创建并同步快照到所有节点。

### 请求端点

`http://<address>:<port>/v1/ctrl/trigger_snapshot`

### 响应示例

无。

## CPU 和内存分析 API

使您能够使用 [FlameGraph](https://github.com/brendangregg/FlameGraph) 可视化 CPU 和内存的性能数据。有关更多信息，请参见 [如何对 Databend 进行性能分析](../../00-overview/02-community/04-contributor/07-how-to-profiling.md)。