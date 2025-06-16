---
title: system_history.log_history
---

存储从各个节点收集的原始日志条目。该表是后续日志转换的主要来源。

所有其他日志表都派生自此表，区别在于其他日志表会进行一些转换，使数据更加结构化。

## 字段

| 字段         | 类型      | 描述                                      |
|--------------|-----------|--------------------------------------------------|
| timestamp    | TIMESTAMP | 记录日志条目的时间戳    |
| path         | VARCHAR   | 日志的源文件路径和行号      |
| target       | VARCHAR   | 日志的目标模块或组件            |
| log_level    | VARCHAR   | 日志级别（例如，`INFO`、`ERROR`）                    |
| cluster_id   | VARCHAR   | 集群的标识符                        |
| node_id      | VARCHAR   | 节点的标识符                           |
| warehouse_id | VARCHAR   | 计算集群（warehouse）的标识符                      |
| query_id     | VARCHAR   | 与日志关联的查询（query） ID                 |
| message      | VARCHAR   | 日志消息内容                              |
| fields       | VARIANT   | 附加字段（作为 JSON 对象）             |
| batch_number | BIGINT    | 内部使用，无特殊含义                 |

注意：`message` 字段存储纯文本日志，而 `fields` 字段存储 JSON 格式的日志。

例如，某条日志条目的 `fields` 字段可能如下所示：
```
fields: {"node_id":"8R5ZMF8q0HHE6x9H7U1gr4","query_id":"72d2319a-b6d6-4b1d-8694-670137a40d87","session_id":"189fd3e2-e6ac-48c3-97ef-73094c141312","sql":"select * from system_history.log_history"}
```

另一条日志条目的 `message` 字段可能如下所示：
```
message: [HTTP-QUERY] Preparing to plan SQL query
```

## 示例

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