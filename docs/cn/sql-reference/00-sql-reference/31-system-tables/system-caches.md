---
title: system.caches
---

Databend 中各类缓存的概览，包含使用量和命中率统计信息。

## 列说明

| 列名      | 说明                                                                      |
|-----------|---------------------------------------------------------------------------|
| node      | 节点名称                                                                  |
| name      | 缓存名称（与 `system$set_cache_capacity` 第一个参数相同）                 |
| num_items | 已缓存的条目数量                                                          |
| size      | 已缓存条目的大小（根据 `unit` 为个数或字节数）                            |
| capacity  | 容量上限（根据 `unit` 为个数或字节数）                                    |
| unit      | `size` 和 `capacity` 的单位：`count`（个数）或 `bytes`（字节）           |
| access    | 缓存访问总次数                                                            |
| hit       | 命中次数                                                                  |
| miss      | 未命中次数                                                                |

## 缓存列表

| 缓存名称                                     | 缓存对象                                           | 单位  | 备注 |
|----------------------------------------------|----------------------------------------------------|-------|------|
| memory_cache_table_snapshot                  | Table snapshot                                     | count | 默认开启，默认容量通常够用 |
| memory_cache_table_statistics                | 表统计信息                                         | count | |
| memory_cache_compact_segment_info            | 压缩形式的 Table Segment 元数据                    | bytes | |
| memory_cache_segment_statistics              | Segment 级别统计信息                               | bytes | |
| memory_cache_column_oriented_segment_info    | 列式 Segment 元数据                                | bytes | |
| disk_cache_column_data                       | 磁盘列数据缓存                                     | bytes | 不能通过 `system$set_cache_capacity` 调整 |
| memory_cache_bloom_index_filter              | 布隆过滤器数据                                     | bytes | 每个 block 中每列对应一个条目，内存占用不大。有点查场景时建议关注命中率，尽量全部缓存。 |
| memory_cache_bloom_index_file_meta_data      | 布隆过滤器元数据                                   | count | 每张表最多可缓存与 block 数量相同的条目，内存占用不大。有点查场景时建议关注命中率，尽量全部缓存。 |
| memory_cache_inverted_index_file_meta_data   | 倒排索引元数据                                     | count | |
| memory_cache_inverted_index_file             | 倒排索引数据                                       | bytes | |
| memory_cache_vector_index_file_meta_data     | 向量索引元数据                                     | count | |
| memory_cache_vector_index_file               | 向量索引数据                                       | bytes | |
| memory_cache_spatial_index_file_meta_data    | 空间索引元数据                                     | count | |
| memory_cache_spatial_index_file              | 空间索引数据                                       | bytes | |
| memory_cache_virtual_column_file_meta_data   | 虚拟列文件元数据                                   | count | |
| memory_cache_prune_partitions                | Partition pruning 缓存                             | count | 默认开启。对满足条件的确定性查询缓存 pruning 结果。如需测试 pruning 效果可将容量设为 0 以绕过缓存。 |
| memory_cache_parquet_meta_data               | Parquet 文件元数据                                 | count | Hive 表及其他数据源使用 |
| memory_cache_iceberg_table                   | Iceberg 表元数据                                   | count | |

## 示例

```sql
SELECT * FROM system.caches;
```

查看所有缓存的使用率和命中率：

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
