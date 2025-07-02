---
title: system_history.query_history
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.764"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='QUERY HISTORY'/>

**完整的 SQL 执行审计跟踪** - 记录在 Databend 中执行的所有 SQL 查询（Query）的全面详细信息。每个查询（Query）会生成两条记录（开始和结束），从而提供以下方面的完整可见性：

- **性能分析**：查询（Query）持续时间、资源使用情况和优化机会
- **安全审计**：谁在何时何地执行了哪些查询（Query）
- **合规性跟踪**：满足监管要求的完整审计跟踪
- **使用情况监控**：数据库活动模式和用户行为分析

## 字段

| 字段 | 类型 | 描述 |
|---------------------------|------------------|-----------------------------------------------------------------------------------------------|
| log_type | TINYINT | 查询状态。 |
| log_type_name | VARCHAR | 查询状态的名称。 |
| handler_type | VARCHAR | 用于查询的协议或处理程序（例如 `HTTPQuery`、`MySQL`）。 |
| tenant_id | VARCHAR | 租户标识符。 |
| cluster_id | VARCHAR | 集群标识符。 |
| node_id | VARCHAR | 节点标识符。 |
| sql_user | VARCHAR | 执行查询的用户。 |
| sql_user_quota | VARCHAR | 用户的配额信息。 |
| sql_user_privileges | VARCHAR | 用户的权限。 |
| query_id | VARCHAR | 查询的唯一标识符。 |
| query_kind | VARCHAR | 查询的类型（例如 `Query`、`Insert`、`CopyIntoTable` 等）。 |
| query_text | VARCHAR | 查询的 SQL 文本。 |
| query_hash | VARCHAR | 查询文本的哈希值。 |
| query_parameterized_hash | VARCHAR | 查询的哈希值（忽略具体参数值）。 |
| event_date | DATE | 事件发生的日期。 |
| event_time | TIMESTAMP | 事件发生的时间戳。 |
| query_start_time | TIMESTAMP | 查询开始的时间戳。 |
| query_duration_ms | BIGINT | 查询的持续时间（毫秒）。 |
| query_queued_duration_ms | BIGINT | 查询在队列中花费的时间（毫秒）。 |
| current_database | VARCHAR | 执行查询时正在使用的数据库。 |
| written_rows | BIGINT UNSIGNED | 查询写入的行数。 |
| written_bytes | BIGINT UNSIGNED | 查询写入的字节数。 |
| join_spilled_rows | BIGINT UNSIGNED | 连接操作期间溢出的行数。 |
| join_spilled_bytes | BIGINT UNSIGNED | 连接操作期间溢出的字节数。 |
| agg_spilled_rows | BIGINT UNSIGNED | 聚合操作期间溢出的行数。 |
| agg_spilled_bytes | BIGINT UNSIGNED | 聚合操作期间溢出的字节数。 |
| group_by_spilled_rows | BIGINT UNSIGNED | 分组操作期间溢出的行数。 |
| group_by_spilled_bytes | BIGINT UNSIGNED | 分组操作期间溢出的字节数。 |
| written_io_bytes | BIGINT UNSIGNED | 写入 IO 的字节数。 |
| written_io_bytes_cost_ms | BIGINT UNSIGNED | 写入的 IO 成本（毫秒）。 |
| scan_rows | BIGINT UNSIGNED | 查询扫描的行数。 |
| scan_bytes | BIGINT UNSIGNED | 查询扫描的字节数。 |
| scan_io_bytes | BIGINT UNSIGNED | 扫描期间读取的 IO 字节数。 |
| scan_io_bytes_cost_ms | BIGINT UNSIGNED | 扫描的 IO 成本（毫秒）。 |
| scan_partitions | BIGINT UNSIGNED | 扫描的分区数。 |
| total_partitions | BIGINT UNSIGNED | 涉及的总分区数。 |
| result_rows | BIGINT UNSIGNED | 查询结果中的行数。 |
| result_bytes | BIGINT UNSIGNED | 查询结果中的字节数。 |
| bytes_from_remote_disk | BIGINT UNSIGNED | 从远程磁盘读取的字节数。 |
| bytes_from_local_disk | BIGINT UNSIGNED | 从本地磁盘读取的字节数。 |
| bytes_from_memory | BIGINT UNSIGNED | 从内存中读取的字节数。 |
| client_address | VARCHAR | 发出查询的客户端地址。 |
| user_agent | VARCHAR | 客户端的用户代理字符串。 |
| exception_code | INT | 查询失败时的异常代码。 |
| exception_text | VARCHAR | 查询失败时的异常消息。 |
| server_version | VARCHAR | 处理查询的服务器版本。 |
| query_tag | VARCHAR | 与查询关联的标签。 |
| has_profile | BOOLEAN | 查询是否有关联的执行配置文件。 |
| peek_memory_usage | VARIANT | 查询执行期间的峰值内存使用情况（以 JSON 对象表示）。 |
| session_id | VARCHAR | 与查询关联的会话标识符。 |


## 示例

使用 `query_id` 查询特定查询的历史记录

```sql
SELECT * FROM system_history.query_history WHERE query_id = '4e1f50a9-bce2-45cc-86e4-c7a36b9b8d43';

*************************** 1. row ***************************
                log_type: 2
           log_type_name: Finish
            handler_type: HTTPQuery
               tenant_id: test_tenant
              cluster_id: test_cluster
                 node_id: jxSgvulZFAq1sDckR1bu85
                sql_user: root
          sql_user_quota: NULL
     sql_user_privileges: NULL
                query_id: 4e1f50a9-bce2-45cc-86e4-c7a36b9b8d43
              query_kind: Query
              query_text: SELECT * FROM t
              query_hash: cd36a2072e7f9deaa746db7480200944
query_parameterized_hash: cd36a2072e7f9deaa746db7480200944
              event_date: 2025-06-12
              event_time: 2025-06-12 03:31:35.135987
        query_start_time: 2025-06-12 03:31:35.041725
       query_duration_ms: 94
query_queued_duration_ms: 0
        current_database: default
            written_rows: 0
           written_bytes: 0
       join_spilled_rows: 0
      join_spilled_bytes: 0
        agg_spilled_rows: 0
       agg_spilled_bytes: 0
   group_by_spilled_rows: 0
  group_by_spilled_bytes: 0
        written_io_bytes: 0
written_io_bytes_cost_ms: 0
               scan_rows: 1
              scan_bytes: 20
           scan_io_bytes: 605
   scan_io_bytes_cost_ms: 0
         scan_partitions: 1
        total_partitions: 1
             result_rows: 1
            result_bytes: 20
  bytes_from_remote_disk: 74
   bytes_from_local_disk: 0
       bytes_from_memory: 0
          client_address: 127.0.0.1
              user_agent: bendsql/0.26.2-unknown
          exception_code: 0
          exception_text: 
          server_version: v1.2.753-nightly-c3d5fabb79(rust-1.88.0-nightly-2025-06-12T01:48:36.733925000Z)
               query_tag: 
             has_profile: NULL
       peek_memory_usage: {"jxSgvulZFAq1sDckR1bu85":223840}
              session_id: e3c54c32-f3c0-4ea9-bdd2-65701aa3f2a6
```