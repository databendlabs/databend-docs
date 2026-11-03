---
title: system.caches
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.960"/>

Shows enabled caches on each query node, with capacity, usage, and lookup statistics. Disabled memory caches and pools are not listed. A disk tier can remain visible when its memory cache is disabled.

## Columns

| Column | Description |
|--------|-------------|
| node | Query node name. A warehouse can return one row per node for the same cache. |
| name | Cache name, or a shared pool summary such as `__pool:meta`. |
| num_items | Entries currently in the cache. |
| size | Charged resident bytes. This can include evicted values still held by queries. For disk tiers, this is the stored byte size. |
| capacity | Capacity in the specified `unit`. `18446744073709551615` means no separate per-cache limit; the shared pool still bounds it. |
| unit | Capacity unit: `count` or `bytes`. Shared memory caches and pools use `bytes`. |
| access | Cache accesses. Pool summary rows report `0`. |
| hit | Cache hits. Pool summary rows report `0`. |
| miss | Cache misses. Pool summary rows report `0`. |

The legacy backend remains the default. It uses each cache's existing count or byte capacity. Since v1.2.960, the opt-in shared backend groups memory caches into three pools. See [Query Config](/guides/self-hosted/references/node-config/query-config#shared-memory-cache) for startup requirements and configuration.

## Memory Cache Names

The pool column shows the grouping in the shared backend. Read `unit` from the table for the active backend instead of assuming that a metadata cache always uses entry counts.

| Cache name | Shared pool | Cached object |
|------------|-------------|---------------|
| memory_cache_table_snapshot | meta | Table snapshots |
| memory_cache_table_statistics | meta | Table statistics |
| memory_cache_compact_segment_info | meta | Compressed segment metadata |
| memory_cache_column_oriented_segment_info | meta | Column-oriented segment metadata |
| memory_cache_segment_block_metas | meta | Decoded segment block metadata |
| memory_cache_segment_statistics | meta | Segment statistics |
| memory_cache_bloom_index_file_meta_data | meta | Bloom index metadata |
| memory_cache_inverted_index_meta_data | meta | Inverted index metadata |
| memory_cache_vector_index_file_meta_data | meta | Vector index metadata |
| memory_cache_spatial_index_file_meta_data | meta | Spatial index metadata |
| memory_cache_virtual_column_file_meta_data | meta | Virtual column metadata |
| memory_cache_parquet_meta_data | meta | Parquet file metadata |
| memory_cache_iceberg_table | meta | Iceberg table metadata |
| memory_cache_prune_partitions | meta | Partition pruning results |
| memory_cache_bloom_index_filter | index | Bloom filter data |
| memory_cache_vector_index_file | index | Decoded HNSW indexes, including retained search workspaces |
| memory_cache_vector_index_refine | index | Vector refinement data |
| memory_cache_inverted_index_lookup | index | Inverted index lookups |
| memory_cache_inverted_index_payload | index | Inverted index payloads |
| memory_cache_inverted_index_full_payload | index | Full inverted index payloads |
| memory_cache_spatial_index_file | index | Spatial index data |
| memory_cache_column_data | data | Raw column data; off by default in the shared backend |
| memory_cache_table_data | data | Decoded column arrays |

`memory_cache_block_meta` was removed. Use the names returned by the current server. Configured disk tiers have separate `disk_cache_*` rows, such as `disk_cache_column_data`. They cannot be resized with [SYSTEM$SET_CACHE_CAPACITY](../../20-sql-functions/17-table-functions/set-cache-capacity.md).

Since v1.2.953, the vector-index cache retains shared decoded objects. Its `size` includes decoded index memory and retained search workspaces, not just serialized-file bytes. Query-held indexes can remain charged after eviction. See [Legacy Vector Index Cache](/guides/self-hosted/references/node-config/query-config#legacy-vector-index-cache) for ratio/byte precedence and the separate shared-backend controls. These figures do not measure total query memory or process RSS.

## Shared Pool Rows

The shared backend adds `__pool:meta`, `__pool:index`, and `__pool:data` when their capacities are nonzero. These rows summarize the same memory as their member caches. Do not add pool usage to member-cache usage. A pool's lookup counters are zero; use the member rows for hit rates.

A cache without its own byte limit reports capacity `18446744073709551615`, not the pool capacity. Do not treat this sentinel as allocatable memory or add it to capacity totals. Charged resident bytes can stay nonzero after eviction while a query still holds a value. Cache limits are not a guarantee that a query cannot run out of memory.

## Examples

```sql
SELECT node, name, num_items, size, capacity, unit, access, hit, miss
FROM system.caches;
```

Inspect shared pool budgets separately:

```sql
SELECT node, name, size, capacity
FROM system.caches
WHERE name IN ('__pool:meta', '__pool:index', '__pool:data');
```

For bytes still held inside the cache rather than all charged resident bytes, use the `cache_in_cache_bytes` and `cache_pool_in_cache_bytes` metrics. The corresponding resident metrics are `cache_resident_bytes` and `cache_pool_resident_bytes`.
