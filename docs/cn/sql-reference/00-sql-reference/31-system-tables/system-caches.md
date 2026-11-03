---
title: system.caches
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.960"/>

显示各 Query 节点上已启用的缓存，以及容量、使用量和查找统计。已禁用的内存缓存和池不会显示。即使内存缓存已禁用，其磁盘层仍可能显示。

## 列说明

| 列名 | 说明 |
|--------|-------------|
| node | Query 节点名称。同一缓存在计算集群中可能每个节点各返回一行。 |
| name | 缓存名称，或 `__pool:meta` 等共享池汇总名称。 |
| num_items | 当前仍在缓存中的条目数。 |
| size | 内存记账中的驻留字节数。可能包含已逐出但仍被查询持有的值。对于磁盘层，该值为已存储的字节数。 |
| capacity | 以 `unit` 为单位的容量。`18446744073709551615` 表示没有独立的单缓存限制；共享池仍会约束它。 |
| unit | 容量单位：`count` 或 `bytes`。共享内存缓存和池使用 `bytes`。 |
| access | 缓存访问次数。池汇总行返回 `0`。 |
| hit | 缓存命中次数。池汇总行返回 `0`。 |
| miss | 缓存未命中次数。池汇总行返回 `0`。 |

默认仍使用旧版后端，各缓存沿用原有的条目数或字节容量。从 v1.2.960 开始，可选的共享后端将内存缓存分为三个池。启动要求和配置方法请参阅 [Query Config](/guides/self-hosted/references/node-config/query-config#shared-memory-cache)。

## 内存缓存名称

池列表示共享后端中的分组。请读取系统表中的 `unit` 来确定当前后端的容量单位，不要假定元数据缓存始终按条目数计量。

| 缓存名称 | 共享池 | 缓存对象 |
|------------|-------------|---------------|
| memory_cache_table_snapshot | meta | 表快照 |
| memory_cache_table_statistics | meta | 表统计信息 |
| memory_cache_compact_segment_info | meta | 压缩段元数据 |
| memory_cache_column_oriented_segment_info | meta | 列式段元数据 |
| memory_cache_segment_block_metas | meta | 已解码的段 Block 元数据 |
| memory_cache_segment_statistics | meta | 段统计信息 |
| memory_cache_bloom_index_file_meta_data | meta | Bloom 索引元数据 |
| memory_cache_inverted_index_meta_data | meta | 倒排索引元数据 |
| memory_cache_vector_index_file_meta_data | meta | 向量索引元数据 |
| memory_cache_spatial_index_file_meta_data | meta | 空间索引元数据 |
| memory_cache_virtual_column_file_meta_data | meta | 虚拟列元数据 |
| memory_cache_parquet_meta_data | meta | Parquet 文件元数据 |
| memory_cache_iceberg_table | meta | Iceberg 表元数据 |
| memory_cache_prune_partitions | meta | 分区裁剪结果 |
| memory_cache_bloom_index_filter | index | Bloom Filter 数据 |
| memory_cache_vector_index_file | index | 已解码 HNSW 索引，包括保留的搜索工作区 |
| memory_cache_vector_index_refine | index | 向量精排数据 |
| memory_cache_inverted_index_lookup | index | 倒排索引查找数据 |
| memory_cache_inverted_index_payload | index | 倒排索引载荷 |
| memory_cache_inverted_index_full_payload | index | 完整倒排索引载荷 |
| memory_cache_spatial_index_file | index | 空间索引数据 |
| memory_cache_column_data | data | 原始列数据；共享后端默认关闭 |
| memory_cache_table_data | data | 已解码的列数组 |

`memory_cache_block_meta` 已移除。请使用当前服务器返回的名称。已配置的磁盘层有独立的 `disk_cache_*` 行，例如 `disk_cache_column_data`。不能通过 [SYSTEM$SET_CACHE_CAPACITY](../../20-sql-functions/17-table-functions/set-cache-capacity.md) 调整它们的容量。

从 v1.2.953 开始，向量索引缓存保留共享的已解码对象。其 `size` 包括解码后的索引内存和保留的搜索工作区，而不只是序列化文件字节。被查询持有的索引在淘汰后仍可能计入用量。有关比例/字节优先级及独立的共享后端控制，请参阅[传统向量索引缓存](/guides/self-hosted/references/node-config/query-config#legacy-vector-index-cache)。这些数值不表示查询总内存或进程 RSS。

## 共享池行

共享后端会在池容量非零时添加 `__pool:meta`、`__pool:index` 和 `__pool:data`。这些行汇总的内存与其成员缓存相同。不要将池使用量与成员缓存使用量相加。池的查找计数为零；请使用成员行计算命中率。

没有独立字节限制的缓存会报告容量 `18446744073709551615`，而不是池容量。不要将此哨兵值当作可分配内存，也不要将它计入容量总和。逐出后，若查询仍持有该值，内存记账中的驻留字节数可能仍非零。缓存限制不能保证查询不会发生内存不足。

## 示例

```sql
SELECT node, name, num_items, size, capacity, unit, access, hit, miss
FROM system.caches;
```

单独查看共享池预算：

```sql
SELECT node, name, size, capacity
FROM system.caches
WHERE name IN ('__pool:meta', '__pool:index', '__pool:data');
```

如需查看仍保留在缓存内的字节数，而不是全部已记账的驻留字节，请使用 `cache_in_cache_bytes` 和 `cache_pool_in_cache_bytes` 指标。对应的驻留指标为 `cache_resident_bytes` 和 `cache_pool_resident_bytes`。
