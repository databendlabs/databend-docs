---
title: KILL
---

import FunctionDescription from '@site/src/components/FunctionDescription';

强制终止当前正在运行的查询。

参见：[SHOW PROCESSLIST](07-show-processlist.md)

## 语法

```sql
KILL QUERY|CONNECTION <session_id>
```

## 取消自己的查询

<FunctionDescription description="Introduced or updated: Unreleased"/>

`KILL QUERY` 接受查询 ID 或会话 ID。例如，使用 `KILL QUERY '<query_id>'` 可从其他会话取消一条语句。`KILL CONNECTION` 要求提供会话 ID 或本地 MySQL 连接 ID，并会关闭连接。仅匹配查询 ID 的目标不能用于关闭连接。

无需 `SUPER`，即可跨会话和 warehouse 节点取消自己的查询。目标必须具有相同的租户和完整用户身份，包括用户名和 hostname。取消同一租户中其他用户的查询需要全局 `SUPER`，该权限也可以通过角色授予。`SUPER` 不允许取消其他租户的查询。

`CONNECTION_ID()` 和 `system.processes.id` 中的内部会话 ID 使用 `p-<UUID>` 格式。数字 ID 仍表示本地 MySQL 连接 ID。HTTP 登录 ID 和客户端会话 ID 保持不变。目标不存在或属于其他租户时，返回 `UnknownSession`。无权操作同一租户内的目标时，返回 `PermissionDenied`。

滚动升级期间，旧节点无法通过查询 ID 查找要取消的查询。操作旧节点时，请使用实际会话 ID，并遵循该节点的权限规则。非 `SUPER` 用户的取消请求不会回退到限制较少的旧协议。请完成所有节点的升级，再依赖整个 warehouse 范围内的新隔离规则。

## 示例

以下输出展示旧版本使用的会话 ID 格式。

```sql
SHOW PROCESSLIST;
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+
| id                                   | type  | host            | user | state | database | extra_info                                                                           | memory_usage | dal_metrics_read_bytes | dal_metrics_write_bytes | scan_progress_read_rows | scan_progress_read_bytes |
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+
| e04dd121-88f4-4290-85be-2b45c6e3b011 | MySQL | 127.0.0.1:65291 | root | Query | default  | SELECT sum(number) from numbers_mt(10000000000) group by number%3, number%4,number%5 |            0 |                      0 |                       0 |              2391200000 |              19129600000 |
| 179c99d5-1894-4d4c-a89e-4b293d404c88 | MySQL | 127.0.0.1:64597 | root | Query | default  | show processlist                                                                     |            0 |                      0 |                       0 |                       0 |                        0 |
+--------------------------------------+-------+-----------------+------+-------+----------+--------------------------------------------------------------------------------------+--------------+------------------------+-------------------------+-------------------------+--------------------------+

KILL QUERY 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```