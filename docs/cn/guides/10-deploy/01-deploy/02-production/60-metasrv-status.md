---
title: Meta Service HTTP APIs
sidebar_label: Meta Service HTTP APIs
description: Meta Service HTTP APIs
---

为了捕获和跟踪各种对您的分析有用的元数据统计信息，Databend 提供了许多 HTTP API。

:::note
除非另有说明，否则这些 HTTP API 默认使用端口 `28002`。要更改默认端口，请编辑配置文件 `databend-meta.toml` 中的 `admin_api_address` 值。
:::

## Cluster Node API

返回集群中的所有 meta 节点。

### Request Endpoint

`http://<address>:<port>/v1/cluster/nodes`

### Response Example

```
[
  {
    name: "1",
    endpoint: { addr: "localhost", port: 28004 },
    grpc_api_addr: "0.0.0.0:9191",
  },
  {
    name: "2",
    endpoint: { addr: "localhost", port: 28104 },
    grpc_api_addr: "0.0.0.0:9192",
  },
];
```

## Cluster Status API

返回集群中每个 meta 节点的状态信息。

### Request Endpoint

`http://<address>:<port>/v1/cluster/status`

### Response Example

```json
{
  "id": 1,
  "endpoint": "localhost:28004",
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
      "endpoint": { "addr": "localhost", "port": 28004 },
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

### MetaCTL command

```shell
databend-metactl status
```

## Meta Metrics API

显示 Databend 捕获和跟踪的关于 meta service 性能的一系列指标。有关 meta service 指标的更多信息，请参见 [Databend Meta Metrics](../../03-monitor/10-metasrv-metrics.md)。

### Request Endpoint

`http://<address>:<port>/v1/metrics`

### Response Example

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

## Snapshot Trigger API

仅用于调试。强制 raft 创建快照并将其同步到所有节点。

### Request Endpoint

`http://<address>:<port>/v1/ctrl/trigger_snapshot`

### Response Example

None.
