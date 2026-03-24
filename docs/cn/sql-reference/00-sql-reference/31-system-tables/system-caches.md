---
title: system.caches
---

Databend 中各类缓存的概览，包含使用量和命中率统计信息。

## 列说明

| 列名         | 说明                                                                                         |
|--------------|----------------------------------------------------------------------------------------------|
| node         | 节点名称                                                                                     |
| name         | 缓存名称（与 `system$set_cache_capacity` 第一个参数相同）                                    |
| capacity     | 容量上限（根据 `unit` 为个数或字节数）                                                       |
| utilization  | 缓存使用率。若接近 1.0 且 miss 持续增加，说明缓存容量可能不足                                |
| hit_rate     | 命中率（`hit / access`）                                                                     |
| miss_rate    | 未命中率（`miss / access`）                                                                  |
| num_items    | 已缓存的条目数量                                                                             |
| size         | 已缓存条目的大小（根据 `unit` 为个数或字节数）                                               |
| unit         | `size` 和 `capacity` 的单位：`count`（个数）或 `bytes`（字节）                              |
| access       | 缓存访问总次数                                                                               |
| hit          | 命中次数                                                                                     |
| miss         | 未命中次数                                                                                   |

## 示例

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

## 缓存列表

| 缓存名称                                    | 缓存对象                                           | 单位  | 备注 |
|---------------------------------------------|----------------------------------------------------|-------|------|
| memory_cache_table_snapshot                 | Table snapshot                                     | count | 默认开启，默认容量通常够用 |
| memory_cache_compact_segment_info           | 压缩形式的 Table Segment 元数据                    | bytes | |
| memory_cache_bloom_index_file_meta_data     | 布隆过滤器元数据                                   | count | 每张表最多可缓存与 block 数量相同的条目，内存占用不大。有点查场景时建议关注命中率，尽量全部缓存。 |
| memory_cache_bloom_index_filter             | 布隆过滤器数据                                     | bytes | 每个 block 中每列对应一个条目，内存占用不大。有点查场景时建议关注命中率，尽量全部缓存。 |
| memory_cache_segment_block_metas            | 解压和反序列化后的 Table Segment 元数据            | count | 针对 segment 级别过滤无效、需整体加载导致 pruning 阶段过慢的问题。每个 segment 占一个条目。默认关闭（较占内存），内存充裕时建议开启。 |
| memory_cache_block_meta                     | Table block 元数据                                 | count | 目前仅 `REPLACE INTO` 使用，暂可忽略 |
| memory_cache_prune_partitions               | Partition pruning 缓存                             | count | 默认开启。对满足条件的确定性查询缓存 pruning 结果。如需测试 pruning 效果可将容量设为 0 以绕过缓存。 |
| memory_cache_table_data                     | 完全反序列化后的 table data                        | bytes | 内存开销较大，实际内存用量约为容量设定值 × 8。开启后请观察命中率，命中率低时可关闭。 |
| memory_cache_parquet_meta_data              | Parquet 文件元数据                                 | count | Hive 表及其他数据源使用 |
| memory_cache_inverted_index_file            | 倒排索引数据                                       | bytes | |
| memory_cache_inverted_index_file_meta_data  | 倒排索引元数据                                     | bytes | |
| memory_cache_table_statistics               | 表统计信息                                         | count | |
| disk_cache_table_data                       | 磁盘缓存 Table Data                                | bytes | 不能通过 `system$set_cache_capacity` 调整 |
| disk_cache_table_bloom_index_filter_size    | 磁盘缓存布隆过滤器数据                             | bytes | 存储在 disk cache 配置路径下 |
| disk_cache_table_bloom_index_meta_size      | 磁盘缓存布隆过滤器元数据                           | bytes | 存储在 disk cache 配置路径下 |
