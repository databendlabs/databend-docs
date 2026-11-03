---
title: 分布式查询设置
sidebar_position: 8
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: control channel v1.2.954; exchange budgets v1.2.957"/>

分布式查询使用 Flight 连接发送设置请求，使用 Exchange 传输数据。这些设置控制不同路径，不是查询或节点总内存限制。

## 设置连接复用

从 v1.2.954 开始，`enable_flight_control_channel_reuse` 默认为 `1`，接受 `0` 或 `1`。启用后，设置请求复用每个对等节点的缓存 HTTP/2 Channel，而不是为每次请求新建连接。

复用适用于 `INIT_QUERY_ENV`、`INIT_QUERY_FRAGMENTS` 和 `START_PREPARED_QUERY`。它不改变数据平面 `do_exchange`、统计信息、调度前连通性检查、`KILL`、`SET PRIORITY`、`TRUNCATE`、系统操作或 Admin 查询转储。

近期没有成功请求的 Channel 在复用前会通过无副作用的 `PING` 验证。PING 失败或超时后，会丢弃 Channel 并新建连接。这不代表失败的设置请求总会重放。缓存请求失败时，其 Channel 会被移除。五分钟没有成功请求的 Channel 会在下次访问缓存时移除，而不是由五分钟后台定时器回收。

在当前会话中关闭复用，以比较设置行为：

```sql
SET enable_flight_control_channel_reuse = 0;
```

比较结束后移除会话覆盖：

```sql
UNSET enable_flight_control_channel_reuse;
```

## Exchange 缓冲预算

从 v1.2.957 开始，Hash Shuffle 发送端为每个 Hash Exchange 使用节点级共享缓冲预算。接收端将收到的小 Block 合并为较大的输出 Block。Broadcast 和 Hash Shuffle Exchange 使用基于字节的发送和接收配额。

| 设置 | 默认值 | 范围与行为 |
|---------|---------|--------------------|
| `hash_shuffle_send_buffer_bytes` | `268435456`（256 MiB） | 单节点上一个 Hash Exchange 的发送端缓冲。本地发送线程平分此预算。发送线程达到其份额时，刷新自己的所有分区。 |
| `exchange_frame_bytes` | `4194304`（4 MiB） | Broadcast/Hash Exchange 的网络批次有效负载目标。多个目的节点共享发送预算时，实际目标可能更小。 |
| `exchange_send_queue_bytes` | `67108864`（64 MiB） | 单节点上一个 Broadcast/Hash Exchange 的已排队和在途编码数据字节配额。 |
| `exchange_recv_queue_bytes` | `67108864`（64 MiB） | 单节点上一个 Broadcast/Hash Exchange 的接收配额，由发送连接平分。每个连接的最低配额为 1 MiB。 |
| `hash_shuffle_rows_threshold` | `8192` | Hash Shuffle 接收端输出 Block 的目标行数。`0` 关闭行数阈值。 |
| `hash_shuffle_bytes_threshold` | `4194304`（4 MiB） | Hash Shuffle 接收端输出 Block 的目标字节数。`0` 关闭字节阈值。 |

两个阈值设置在 v1.2.957 之前已存在。其作用从发送端分区阈值变为接收端合并目标，现在不再控制发送端缓冲。

四个新增字节预算设置必须为正数。`exchange_frame_bytes`、`exchange_send_queue_bytes` 和 `exchange_recv_queue_bytes` 不能超过 `4294967295`（`u32::MAX`）。不能用 `0` 关闭缓冲。

这些设置控制背压和批处理，不是严格的进程内存上限：

- 多个 Exchange 或并发查询有各自独立的预算。
- 发送连接较多时，每连接最低配额可能使接收总额度超过配置值。
- 单个过大的编码项可单独发送，并超过 Frame 目标。封装也有额外开销。过大编码项和输入 Block 处理可能超过对应名义字节预算。
- 接收端合并、输入 Block、编码和其他查询算子也会使用内存。

例如，以下会话覆盖选择文档中的默认预算：

```sql
SET hash_shuffle_send_buffer_bytes = 268435456;
SET exchange_frame_bytes = 4194304;
SET exchange_send_queue_bytes = 67108864;
SET exchange_recv_queue_bytes = 67108864;
```

增大预算可能使用更多内存。减小预算可能产生更小批次或更多等待。修改前请评估工作负载。不能仅凭这些设置推断吞吐提升或免于 OOM。

移除会话覆盖，重新使用配置的默认值：

```sql
UNSET hash_shuffle_send_buffer_bytes;
UNSET exchange_frame_bytes;
UNSET exchange_send_queue_bytes;
UNSET exchange_recv_queue_bytes;
```
