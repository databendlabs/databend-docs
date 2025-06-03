---
title: system_history.log_history
---

Stores raw log entries ingested from various nodes. This table acts as the primary source for subsequent log transformations.

All the other log tables are derived from this table, the difference is that other log tables will do some transformations to make the data more structured.

```sql
DESCRIBE system_history.log_history
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
SELECT * FROM system_history.log_history  LIMIT 1;
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
