---
title: system.caches
---

import FunctionDescription from '@site/src/components/FunctionDescription';

An overview of various caches managed in Databend, including usage and hit rate statistics.

## Columns

| Column    | Description                                                              |
|-----------|--------------------------------------------------------------------------|
| node      | The node name                                                            |
| name      | Cache name (see the disk target mapping below)  |
| num_items | Number of cached entries                                                 |
| size      | Size of cached entries (count or bytes depending on `unit`)              |
| capacity  | Maximum capacity (count or bytes depending on `unit`)                    |
| unit      | Unit of `size` and `capacity`: `count` or `bytes`                       |
| access    | Total number of cache accesses                                           |
| hit       | Number of cache hits                                                     |
| miss      | Number of cache misses                                                   |

## Cache List

| Cache Name                                   | Cached Object                                      | Unit  | Notes |
|----------------------------------------------|----------------------------------------------------|-------|-------|
| memory_cache_table_snapshot                  | Table snapshot                                     | count | Enabled by default; default capacity is usually sufficient |
| memory_cache_table_statistics                | Table statistics                                   | count | |
| memory_cache_compact_segment_info            | Compressed table segment metadata                  | bytes | |
| memory_cache_segment_statistics              | Segment-level statistics                           | bytes | |
| memory_cache_column_oriented_segment_info    | Column-oriented segment metadata                   | bytes | |
| disk_cache_column_data                       | On-disk column data cache                          | bytes | Before the unified disk cache: not adjustable. See disk controls below. |
| memory_cache_bloom_index_filter              | Bloom filter data                                  | bytes | One entry per column per block. Memory usage is small. Monitor hit rate for point-lookup workloads. |
| memory_cache_bloom_index_file_meta_data      | Bloom filter metadata                              | count | Each table can cache up to as many entries as it has blocks. Memory usage is small. Monitor hit rate for point-lookup workloads. |
| memory_cache_inverted_index_file_meta_data   | Inverted index metadata                            | count | |
| memory_cache_inverted_index_file             | Inverted index data                                | bytes | |
| memory_cache_vector_index_file_meta_data     | Vector index metadata                              | count | |
| memory_cache_vector_index_file               | Vector index data                                  | bytes | |
| memory_cache_spatial_index_file_meta_data    | Spatial index metadata                             | count | |
| memory_cache_spatial_index_file              | Spatial index data                                 | bytes | |
| memory_cache_virtual_column_file_meta_data   | Virtual column file metadata                       | count | |
| memory_cache_prune_partitions                | Partition pruning cache                            | count | Enabled by default. Caches pruning results for deterministic queries. Set capacity to 0 to bypass for pruning testing. |
| memory_cache_parquet_meta_data               | Parquet file metadata                              | count | Used by Parquet-based sources |
| memory_cache_iceberg_table                   | Iceberg table metadata                             | count | |

<h2 id="disk-cache-statistics">Disk Cache Statistics</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

With the [unified disk cache](/guides/self-hosted/references/node-config/query-config#unified-disk-cache) enabled, `disk_cache_*` rows show each kind's raw bytes on disk. They do not represent decoded memory values. Each kind's `capacity` is `NULL` because its disk pool sets the limit. Use `size` in bytes to inspect usage.

The `__disk_pool:meta`, `__disk_pool:index`, and `__disk_pool:data` rows show pool usage and byte capacities. Pool rows summarize their kinds. Do not add pool usage to kind usage: that counts the same disk bytes twice. Keep each node's budget separate.

```sql
SELECT node, name, num_items, size, capacity, access, hit
FROM system.caches
WHERE name LIKE 'disk_cache_%' OR name LIKE '__disk_pool:%';
```

For pool utilization, divide `size` by a nonzero pool `capacity`. The general utilization example below cannot produce a ratio for a `NULL` per-kind capacity.

[Runtime controls](/sql/sql-functions/table-functions/set-cache-capacity#disk-cache-controls) use `disk_pool:data`, not `__disk_pool:data`. A disk-kind switch uses its `memory_cache_*` kind name prefixed with `disk:`. For example, the `disk_cache_column_data` row corresponds to `disk:memory_cache_column_data`.

## Example

```sql
SELECT * FROM system.caches;
```

Check utilization and hit rate for all caches:

```sql
SELECT
    node,
    name,
    capacity,
    if(unit = 'count', (num_items + 1) / (capacity + 1),
       unit = 'bytes', (size + 1) / (capacity + 1), -1) AS utilization,
    if(access = 0, 0, hit / access)  AS hit_rate,
    if(access = 0, 0, miss / access) AS miss_rate,
    num_items,
    size,
    unit,
    access,
    hit,
    miss
FROM system.caches;
```
