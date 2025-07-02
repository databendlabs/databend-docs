---
title: system_history.log_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.764"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='LOG HISTORY'/>

**系统操作审计追踪**——来自所有 Databend 节点和组件的原始日志存储库。运维智能的基础：

- **系统监控**：跟踪系统健康状况、性能和资源使用情况
- **故障排查**：通过详细的错误日志和系统事件进行问题调试
- **运维分析**：分析系统行为模式和趋势
- **根本原因分析**：调查系统故障和性能瓶颈

> **注意：** 此表包含原始日志数据，这些数据会提供给其他专门的历史记录表。其他表则提供了此数据的结构化、查询专用视图。

## 字段

| 字段         | 类型      | 描述                                      |
|--------------|-----------|------------------------------------------|
| timestamp    | TIMESTAMP | 记录日志条目的时间戳                     |
| path         | VARCHAR   | 日志的源文件路径和行号                   |
| target       | VARCHAR   | 日志的目标模块或组件                     |
| log_level    | VARCHAR   | 日志级别（例如 `INFO`、`ERROR`）         |
| cluster_id   | VARCHAR   | 集群的标识符                             |
| node_id      | VARCHAR   | 节点的标识符                             |
| warehouse_id | VARCHAR   | 计算集群（Warehouse）的标识符            |
| query_id     | VARCHAR   | 与日志关联的查询 ID                      |
| message      | VARCHAR   | 日志消息内容                             |
| fields       | VARIANT   | 附加字段（以 JSON 对象形式）             |
| batch_number | BIGINT    | 内部使用，无特殊含义                     |

注意：`message` 字段存储纯文本日志，而 `fields` 字段存储 JSON 格式的日志。

例如，某个日志条目的 `fields` 字段可能如下所示：
```
fields: {"node_id":"8R5ZMF8q0HHE6x9H7U1gr4","query_id":"72d2319a-b6d6-4b1d-8694-670137a40d87","session_id":"189fd3e2-e6ac-48c3-97ef-73094c141312","sql":"select * from system_history.log_history"}
```

另一个日志条目的 `message` 字段可能如下所示：
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