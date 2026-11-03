---
title: SYSTEM$SET_CACHE_CAPACITY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.960"/>

在运行时调整计算集群各 Query 节点的缓存容量。结果包含各节点的状态。修改不会持久化。重启后，Databend 根据配置和后端默认值重新建立容量限制。

缓存名称请参阅 [system.caches](../../00-sql-reference/31-system-tables/system-caches.md)。可选共享后端的说明请参阅 [Query Config](/guides/self-hosted/references/node-config/query-config#shared-memory-cache)。

## 语法

```sql
CALL system$set_cache_capacity('<cache_name>', <new_capacity>);
CALL system$set_cache_capacity('<cache_name>', 'default');
```

| 参数 | 说明 |
|-----------|-------------|
| cache_name | `memory_cache_*` 名称。共享后端还接受 `pool:meta`、`pool:index`、`pool:data` 或 `all`。 |
| new_capacity | 非负整数。旧版后端使用该缓存的 `count` 或 `bytes` 单位。共享后端使用字节。`0` 禁用缓存或池。 |

## 后端规则

- 默认仍使用旧版后端。它对各缓存采用 LRU 逐出策略，不接受池目标、`all` 或 `'default'`。
- 从 v1.2.960 开始，共享后端使用 S3-FIFO 池。单缓存的字节限制仍受池预算约束；它不会为该缓存预留内存。
- 在共享后端中，`'default'` 将缓存恢复为 `cache.kind_max_bytes` 或内置默认值规定的启动限制。它不会重置池，不支持 `all` 或 `pool:*`。
- 大多数共享缓存启动时已启用，且没有独立的单缓存限制。原始 `memory_cache_column_data` 默认关闭，除非配置另行启用。因此，它的 `'default'` 可能会再次将其关闭。
- `all` 只接受 `0`，会将三个共享池的容量设为零，但不会禁用已配置的磁盘层。需要恢复时，请分别为各池设置数值容量。
- 命令目标应使用 `pool:meta`，而不是系统表中的汇总名称 `__pool:meta`。
- 不能通过此命令调整任何 `disk_cache_*` 层的容量。
- 降低限制可能逐出条目。活动查询持有的内存不一定立即释放。

### 倒排索引负载目标

从 v1.2.953 开始，传统目标 `memory_cache_inverted_index_payload` 接受页缓存和 `memory_cache_inverted_index_full_payload` 的组合预算。值 `B` 将 `floor(B / 4)` 字节分配给完整组件缓存，其余部分分配给页缓存。它不会将页缓存行的容量设为 `B`。将此目标设为 `0` 会禁用两个传统负载内存缓存。

在共享后端中，同一目标仅改变页缓存类型。若要改变 `memory_cache_inverted_index_full_payload` 的限制，请单独调整它。两者仍受 `index` 池约束。这些运行时变更不改变磁盘层容量，也不会在重启后保留。

## 示例

在旧版后端中，将 Bloom 索引元数据缓存设为 5000 个条目：

```sql
CALL system$set_cache_capacity('memory_cache_bloom_index_file_meta_data', 5000);
```

在任一后端中禁用分区裁剪内存缓存：

```sql
CALL system$set_cache_capacity('memory_cache_prune_partitions', 0);
```

以下命令要求使用共享后端：

```sql
-- Limit decoded column arrays to 256 MiB within their data pool.
CALL system$set_cache_capacity('memory_cache_table_data', 268435456);

-- Restore this cache's startup limit, not necessarily an unlimited state.
CALL system$set_cache_capacity('memory_cache_table_data', 'default');

-- Change the entire index pool to 1 GiB.
CALL system$set_cache_capacity('pool:index', 1073741824);

-- Disable all shared memory pools, leaving disk tiers unchanged.
CALL system$set_cache_capacity('all', 0);
```
