---
title: Distributed Query Settings
sidebar_position: 8
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: control channel v1.2.954; exchange budgets v1.2.957"/>

Distributed queries use Flight connections for setup requests and Exchanges for data transfer. These settings control different paths. They do not set a total query or node memory limit.

## Setup Connection Reuse

Since v1.2.954, `enable_flight_control_channel_reuse` defaults to `1`. It accepts `0` or `1`. Enabled setup requests reuse a cached HTTP/2 channel per peer instead of opening a connection for each request.

Reuse applies to `INIT_QUERY_ENV`, `INIT_QUERY_FRAGMENTS`, and `START_PREPARED_QUERY`. It does not change data-plane `do_exchange`, statistics, the pre-scheduling connectivity check, `KILL`, `SET PRIORITY`, `TRUNCATE`, system actions, or admin query dumps.

A channel without a recent successful request is verified with a side-effect-free `PING` before reuse. A failed or timed-out ping discards it and opens a new connection. This does not mean that a failed setup request is always replayed. A failed cached request evicts its channel. Channels with no successful request for five minutes are removed on the next cache access, not by a five-minute background timer.

To compare setup behavior without reuse in the current session:

```sql
SET enable_flight_control_channel_reuse = 0;
```

Remove the session override after the comparison:

```sql
UNSET enable_flight_control_channel_reuse;
```

## Exchange Buffer Budgets

Since v1.2.957, hash-shuffle sender buffering uses a shared per-node budget for each hash Exchange. Receiver coalescing produces larger output blocks from smaller received blocks. Broadcast and hash-shuffle Exchanges use byte-based send and receive quotas.

| Setting | Default | Scope and behavior |
|---------|---------|--------------------|
| `hash_shuffle_send_buffer_bytes` | `268435456` (256 MiB) | Sender buffering for one hash Exchange on one node. Local sender threads divide this budget. A sender flushes all its partitions when it reaches its share. |
| `exchange_frame_bytes` | `4194304` (4 MiB) | Network batch payload target for broadcast/hash Exchanges. The effective target can be smaller when the send budget is shared by many destinations. |
| `exchange_send_queue_bytes` | `67108864` (64 MiB) | Byte quota for queued and in-flight encoded data of one broadcast/hash Exchange on a node. |
| `exchange_recv_queue_bytes` | `67108864` (64 MiB) | Receive quota for one broadcast/hash Exchange on a node, divided among sending connections. Each connection has a minimum quota of 1 MiB. |
| `hash_shuffle_rows_threshold` | `8192` | Target rows in hash-shuffle receiver output blocks. `0` disables the row threshold. |
| `hash_shuffle_bytes_threshold` | `4194304` (4 MiB) | Target bytes in hash-shuffle receiver output blocks. `0` disables the byte threshold. |

The two threshold settings existed before v1.2.957. Their role changed from sender partition thresholds to receiver coalescing targets. They do not control sender buffering now.

The four new byte-budget settings must be positive. `exchange_frame_bytes`, `exchange_send_queue_bytes`, and `exchange_recv_queue_bytes` cannot exceed `4294967295` (`u32::MAX`). Setting them to `0` is not a way to disable buffering.

These are backpressure and batching controls, not strict process-memory caps:

- Multiple Exchanges or concurrent queries have separate budgets.
- Receiver minimum quotas can make the total receive allowance exceed the configured value when there are many sending connections.
- A single oversized encoded item can be sent alone, beyond the frame target. Framing adds overhead. Oversized items and input-block processing can exceed the corresponding nominal byte budgets.
- Receiver coalescing, input blocks, encoding, and other query operators also use memory.

For example, these session overrides select the documented default budgets:

```sql
SET hash_shuffle_send_buffer_bytes = 268435456;
SET exchange_frame_bytes = 4194304;
SET exchange_send_queue_bytes = 67108864;
SET exchange_recv_queue_bytes = 67108864;
```

Increasing a budget can use more memory. Reducing it can produce smaller batches or more waiting. Evaluate the workload before changing it. Do not infer a throughput improvement or protection from OOM from these settings alone.

Remove the session overrides to use the configured defaults:

```sql
UNSET hash_shuffle_send_buffer_bytes;
UNSET exchange_frame_bytes;
UNSET exchange_send_queue_bytes;
UNSET exchange_recv_queue_bytes;
```
