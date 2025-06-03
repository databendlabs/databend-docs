---
title: system_history.log_history
---

存储来自各节点的原始日志条目。此表是后续日志转换的主要数据源。

所有其他日志表均派生自此表，不同之处在于其他日志表会对数据进行转换以提高结构化程度。

```sql
DESCRIBE system_history.log_history;

╭──────────────────────────────────────────────────────╮
│     Field    │    Type   │  Null  │ Default │  Extra │
│    String    │   String  │ String │  String │ String │
├──────────────┼───────────┼────────┼─────────┼────────┤
│ timestamp    │ TIMESTAMP │ YES    │ NULL    │        │
│ path         │ VARCHAR   │ YES    │ NULL    │        │
│ target       │ VARCHAR   │ YES    │ NULL    │        │
│ log_level    │ VARCHAR   │ YES    │ NULL    │        │
│ cluster_id   │ VARCHAR   │ YES    │ NULL    │        │
│ node_id      │ VARCHAR   │ YES    │ NULL    │        │
│ warehouse_id │ VARCHAR   │ YES    │ NULL    │        │
│ query_id     │ VARCHAR   │ YES    │ NULL    │        │
│ message      │ VARCHAR   │ YES    │ NULL    │        │
│ fields       │ VARIANT   │ YES    │ NULL    │        │
│ batch_number │ BIGINT    │ YES    │ NULL    │        │
╰──────────────────────────────────────────────────────╯
```

```sql
SELECT * FROM system_history.log_history LIMIT 1;

*************************** 1. row ***************************
   timestamp: 2025-06-03 01:29:49.335455
        path: databend_common_meta_client::channel_manager: channel_manager.rs:86
      target: databend_common_meta_client::channel_manager
   log_level: INFO
  cluster_id: test_cluster
     node_id: CkdmtwYXLRMhJIvVzl6i11
warehouse_id: NULL
    query_id: NULL
     message: MetaChannelManager done building RealClient to 127.0.0.1:9191, start handshake
      fields: {}
batch_number: 41
```