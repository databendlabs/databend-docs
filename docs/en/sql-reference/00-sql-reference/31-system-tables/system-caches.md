---
title: system.caches
---

An overview of various caches managed in Databend, including usage and hit rate statistics.

## Columns

| Column       | Description                                                                                 |
|--------------|---------------------------------------------------------------------------------------------|
| node         | The node name                                                                               |
| name         | Cache name (same as the first parameter in `system$set_cache_capacity`)                     |
| capacity     | Maximum capacity (count or bytes depending on `unit`)                                       |
| utilization  | Cache utilization ratio. If close to 1.0 and misses are increasing, the cache may be too small |
| hit_rate     | Hit rate (`hit / access`)                                                                   |
| miss_rate    | Miss rate (`miss / access`)                                                                 |
| num_items    | Number of cached entries                                                                    |
| size         | Size of cached entries (count or bytes depending on `unit`)                                 |
| unit         | Unit of `size` and `capacity`: `count` or `bytes`                                          |
| access       | Total number of cache accesses                                                              |
| hit          | Number of cache hits                                                                        |
| miss         | Number of cache misses                                                                      |

## Example

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

## Cache List

| Cache Name                                  | Cached Object                                      | Unit  | Notes |
|---------------------------------------------|----------------------------------------------------|-------|-------|
| memory_cache_table_snapshot                 | Table snapshot                                     | count | Enabled by default; default capacity is usually sufficient |
| memory_cache_compact_segment_info           | Compressed table segment metadata                  | bytes | |
| memory_cache_bloom_index_file_meta_data     | Bloom filter metadata                              | count | Each table can cache up to as many entries as it has blocks. Memory usage is small. Monitor hit rate for point-lookup workloads. |
| memory_cache_bloom_index_filter             | Bloom filter data                                  | bytes | One entry per column per block. Memory usage is small. Monitor hit rate for point-lookup workloads. |
| memory_cache_segment_block_metas            | Deserialized table segment metadata                | count | Addresses slow pruning when segment-level filtering is insufficient. One entry per segment. Disabled by default (memory-intensive); enable on memory-rich nodes. |
| memory_cache_block_meta                     | Table block metadata                               | count | Currently used only by `REPLACE INTO`; can be ignored for now |
| memory_cache_prune_partitions               | Partition pruning cache                            | count | Enabled by default. Caches pruning results for deterministic queries. Set capacity to 0 to bypass for pruning testing. |
| memory_cache_table_data                     | Fully deserialized table data                      | bytes | High memory usage — estimate actual memory as capacity × 8. Monitor hit rate; disable if hit rate is low. |
| memory_cache_parquet_meta_data              | Parquet file metadata                              | count | Used by Hive tables and other sources |
| memory_cache_inverted_index_file            | Inverted index data                                | bytes | |
| memory_cache_inverted_index_file_meta_data  | Inverted index metadata                            | bytes | |
| memory_cache_table_statistics               | Table statistics                                   | count | |
| disk_cache_table_data                       | On-disk table data cache                           | bytes | Cannot be adjusted via `system$set_cache_capacity` |
| disk_cache_table_bloom_index_filter_size    | On-disk Bloom filter data                          | bytes | Stored at the disk cache location |
| disk_cache_table_bloom_index_meta_size      | On-disk Bloom filter metadata                      | bytes | Stored at the disk cache location |
