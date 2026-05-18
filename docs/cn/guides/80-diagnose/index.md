---
title: 故障排查
---

# 故障排查

通过 `system_history` 表诊断慢查询、错误、资源使用和登录问题。使用 `profile_history` 进行算子级执行分析（CPU 时间、I/O、溢出、输出行数）。所有表按租户隔离。

## 表

### system_history.query_history

完整的 SQL 执行审计记录。每个查询会生成 start/finish 状态的条目。

| 字段 | 类型 | 说明 |
|------|------|------|
| log_type | TINYINT | 查询状态：1=Start, 2=Finish, 3=Error, 4=Aborted, 5=Closed |
| log_type_name | VARCHAR | 状态名称："Start", "Finish", "Error", "Aborted", "Closed" |
| handler_type | VARCHAR | 使用的协议（如 `HTTPQuery`, `MySQL`） |
| tenant_id | VARCHAR | 租户标识 |
| cluster_id | VARCHAR | 集群标识 |
| node_id | VARCHAR | 节点标识 |
| sql_user | VARCHAR | 执行查询的用户 |
| sql_user_quota | VARCHAR | 用户配额信息 |
| sql_user_privileges | VARCHAR | 用户权限 |
| query_id | VARCHAR | 唯一查询标识 |
| query_kind | VARCHAR | 查询类型（如 `Query`, `Insert`, `CopyIntoTable`） |
| query_text | VARCHAR | SQL 文本 |
| query_hash | VARCHAR | 查询文本的哈希 |
| query_parameterized_hash | VARCHAR | 忽略字面值的哈希 |
| event_date | DATE | 事件日期 |
| event_time | TIMESTAMP | 事件时间戳 |
| query_start_time | TIMESTAMP | 查询开始时间 |
| query_duration_ms | BIGINT | 总耗时（毫秒，含排队+执行） |
| query_queued_duration_ms | BIGINT | 排队耗时（毫秒） |
| current_database | VARCHAR | 当前数据库 |
| written_rows | BIGINT UNSIGNED | 写入行数 |
| written_bytes | BIGINT UNSIGNED | 写入字节数 |
| join_spilled_rows | BIGINT UNSIGNED | Join 溢出行数 |
| join_spilled_bytes | BIGINT UNSIGNED | Join 溢出字节数 |
| agg_spilled_rows | BIGINT UNSIGNED | 聚合溢出行数 |
| agg_spilled_bytes | BIGINT UNSIGNED | 聚合溢出字节数 |
| group_by_spilled_rows | BIGINT UNSIGNED | Group By 溢出行数 |
| group_by_spilled_bytes | BIGINT UNSIGNED | Group By 溢出字节数 |
| written_io_bytes | BIGINT UNSIGNED | IO 写入字节数 |
| written_io_bytes_cost_ms | BIGINT UNSIGNED | IO 写入耗时（毫秒） |
| scan_rows | BIGINT UNSIGNED | 扫描行数 |
| scan_bytes | BIGINT UNSIGNED | 扫描字节数 |
| scan_io_bytes | BIGINT UNSIGNED | 扫描 IO 字节数 |
| scan_io_bytes_cost_ms | BIGINT UNSIGNED | 扫描 IO 耗时（毫秒） |
| scan_partitions | BIGINT UNSIGNED | 扫描分区数 |
| total_partitions | BIGINT UNSIGNED | 总分区数 |
| result_rows | BIGINT UNSIGNED | 结果行数 |
| result_bytes | BIGINT UNSIGNED | 结果字节数 |
| bytes_from_remote_disk | BIGINT UNSIGNED | 从远程磁盘读取的字节数 |
| bytes_from_local_disk | BIGINT UNSIGNED | 从本地磁盘读取的字节数 |
| bytes_from_memory | BIGINT UNSIGNED | 从内存读取的字节数 |
| client_address | VARCHAR | 客户端地址 |
| user_agent | VARCHAR | 客户端 User Agent |
| exception_code | INT | 异常代码（0 = 成功） |
| exception_text | VARCHAR | 异常信息 |
| server_version | VARCHAR | 服务器版本 |
| query_tag | VARCHAR | 查询标签 |
| has_profile | BOOLEAN | 是否有执行 profile |
| peek_memory_usage | VARIANT | 峰值内存使用（JSON） |
| session_id | VARCHAR | 会话标识 |

### system_history.profile_history

每个查询的详细执行 profile。使用 `jq()` 提取算子级统计信息。

| 字段 | 类型 | 说明 |
|------|------|------|
| timestamp | TIMESTAMP | profile 记录时间 |
| query_id | VARCHAR | 查询 ID |
| profiles | VARIANT | 算子 JSON 数组，每个包含 `id`, `name`, `statistics[]` |
| statistics_desc | VARIANT | 统计信息格式描述（JSON） |

Statistics 数组索引：`[0]`=OutputRows, `[1]`=OutputBytes, `[2]`=InputRows, `[3]`=InputBytes, `[4]`=CpuTime(ns)。

### system_history.log_history

所有 Databend 节点和组件的原始日志。

| 字段 | 类型 | 说明 |
|------|------|------|
| timestamp | TIMESTAMP | 日志时间戳 |
| path | VARCHAR | 源文件路径和行号 |
| target | VARCHAR | 目标模块或组件 |
| log_level | VARCHAR | 日志级别（`INFO`, `ERROR`, `WARN` 等） |
| cluster_id | VARCHAR | 集群标识 |
| node_id | VARCHAR | 节点标识 |
| warehouse_id | VARCHAR | Warehouse 标识 |
| query_id | VARCHAR | 关联的查询 ID |
| message | VARCHAR | 日志消息（纯文本） |
| fields | VARIANT | 附加字段（JSON） |
| batch_number | BIGINT | 内部使用 |

### system_history.access_history

数据血缘和访问控制审计。跟踪所有被访问或修改的对象。

| 字段 | 类型 | 说明 |
|------|------|------|
| query_id | VARCHAR | 查询 ID |
| query_start | TIMESTAMP | 查询开始时间 |
| user_name | VARCHAR | 执行查询的用户 |
| base_objects_accessed | VARIANT | 被访问的对象（JSON 数组） |
| direct_objects_accessed | VARIANT | 预留字段 |
| objects_modified | VARIANT | DML 修改的对象（JSON 数组） |
| object_modified_by_ddl | VARIANT | DDL 修改的对象（JSON 数组） |

JSON 对象字段：`object_domain`（Database/Table/Stage）、`object_name`、`columns[]`、`stage_type`、`operation_type`（Create/Alter/Drop/Undrop）、`properties`。

### system_history.login_history

所有登录尝试的认证审计记录。

| 字段 | 类型 | 说明 |
|------|------|------|
| event_time | TIMESTAMP | 登录事件时间 |
| handler | VARCHAR | 协议（如 `HTTP`, `MySQL`） |
| event_type | VARCHAR | `LoginSuccess` 或 `LoginFailed` |
| connection_uri | VARCHAR | 连接 URI |
| auth_type | VARCHAR | 认证方式（如 Password） |
| user_name | VARCHAR | 尝试登录的用户 |
| client_ip | VARCHAR | 客户端 IP |
| user_agent | VARCHAR | 客户端 User Agent |
| session_id | VARCHAR | 会话 ID |
| node_id | VARCHAR | 节点 ID |
| error_message | VARCHAR | 失败时的错误信息 |

## 常用示例

查找最近一小时的慢查询（>5秒）：
```sql
SELECT query_id, sql_user, query_duration_ms, query_text
FROM system_history.query_history
WHERE query_duration_ms > 5000
  AND event_time > now() - INTERVAL 1 HOUR
  AND log_type = 2
ORDER BY query_duration_ms DESC
LIMIT 20;
```

查找失败的查询：
```sql
SELECT query_id, sql_user, exception_code, exception_text, query_text
FROM system_history.query_history
WHERE exception_code != 0
  AND event_time > now() - INTERVAL 1 HOUR
ORDER BY event_time DESC;
```

检查登录失败：
```sql
SELECT event_time, user_name, client_ip, error_message
FROM system_history.login_history
WHERE event_type = 'LoginFailed'
  AND event_time > now() - INTERVAL 24 HOUR
ORDER BY event_time DESC;
```
