---
title: KILL
---

取消指定服务端会话中正在运行的查询，或终止该会话。

参见：[SHOW PROCESSLIST](07-show-processlist.md)

## 语法

```sql
KILL QUERY '<process_id>'
KILL CONNECTION '<process_id>'
```

- `KILL QUERY` 取消当前查询，不关闭会话。
- `KILL CONNECTION` 终止会话，并取消该会话的当前查询。

### Process ID

`process_id` 是 `SHOW PROCESSLIST` 或 `system.processes` 返回的 `id` 列，用于标识服务端内部会话。

不要将 query ID、操作系统进程 ID（PID）或 HTTP client session ID 用作 `process_id`。

该 ID 的生命周期取决于连接协议：

| 协议 | `system.processes.id` 的生命周期 |
|------|---------------------------------|
| MySQL | 同一连接执行多条查询时，ID 保持不变。 |
| HTTP Query | 每次提交新查询都会创建新的服务端内部会话和 ID，即使沿用同一个 HTTP client session。 |

## 权限与范围

- SQL `KILL` 需要全局 `SUPER` 权限，即使取消的是自己的查询。
- 可以从另一个会话或连接发起 `KILL`，目标会话不必属于当前用户。
- 命令会在当前 warehouse 内查找目标，包括同一 warehouse 中其他 cluster 的节点。它不会搜索其他 warehouse。请连接到目标查询所在的 warehouse。
- 目标会话必须仍然存在。如果服务端找不到目标，会返回 `Not found session id`。

## 示例

### 从进程列表取消查询

查找目标进程：

```sql
SHOW PROCESSLIST;
```

复制其 `id` 值，然后取消查询：

```sql
KILL QUERY 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```

如需终止会话，改用：

```sql
KILL CONNECTION 'e04dd121-88f4-4290-85be-2b45c6e3b011';
```

### 通过 Query ID 查找 Process ID

从连接到同一 warehouse 的另一个连接中，查找正在运行的查询：

```sql
SELECT id, current_query_id, user
FROM system.processes
WHERE current_query_id = '<query_id>';
```

在取消命令中使用返回的 `id`，而不是 `current_query_id`：

```sql
KILL QUERY '<id_from_system_processes>';
```

如果查询已结束或其内部会话已关闭，查找可能不会返回任何记录。查找与取消命令是两个独立操作。
