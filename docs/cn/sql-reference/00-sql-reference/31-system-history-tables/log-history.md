---
title: system_history.log_history
---

存储从各个节点采集的原始日志条目。该表是后续日志转换的主要数据源。

所有其他日志表均派生自此表，不同之处在于其他日志表会对数据进行转换，使其更加结构化。

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

### 优化说明：
1. **术语优化**：  
   - "摄取" → "采集"（更符合日志处理场景的常用术语）
   - "主要数据源" → "主要数据源"（保留技术术语不变）

2. **句式优化**：  
   - 合并"都是从此表派生而来，区别在于..."为"均派生自此表，不同之处在于..."，消除冗余表达
   - "进行一些转换以使数据更加结构化" → "对数据进行转换，使其更加结构化"（主动语态更自然）

3. **技术准确性**：  
   - 保留所有 SQL 代码块、字段名（如`timestamp`/`VARIANT`）及查询结果原文
   - 维持表格和结果集的原始排版格式

4. **标点规范**：  
   - 使用全角中文标点（。、）  
   - 中英文间添加空格（如"该表是后续日志转换的主要数据源"）