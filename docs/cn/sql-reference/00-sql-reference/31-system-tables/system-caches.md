---
title: system.caches
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Databend 中各类缓存的概览，包含使用量和命中率统计信息。

## 列说明

| 列名      | 说明                                                                      |
|-----------|---------------------------------------------------------------------------|
| node      | 节点名称                                                                  |
| name      | 缓存名称（磁盘目标映射见下文）                 |
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
| disk_cache_column_data                       | 磁盘列数据缓存                                     | bytes | 统一磁盘缓存之前的版本不可调整。新控制方式见下文。 |
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
| memory_cache_parquet_meta_data               | Parquet 文件元数据                                 | count | 基于 Parquet 的数据源使用 |
| memory_cache_iceberg_table                   | Iceberg 表元数据                                   | count | |

<h2 id="disk-cache-statistics">磁盘缓存统计</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

启用[统一磁盘缓存](/guides/self-hosted/references/node-config/query-config#unified-disk-cache)后，`disk_cache_*` 行显示各类型存放在磁盘上的原始字节，不代表解码后的内存值。各类型的 `capacity` 为 `NULL`，因为容量由磁盘池限制。可使用以字节计量的 `size` 查看用量。

`__disk_pool:meta`、`__disk_pool:index` 和 `__disk_pool:data` 行显示池用量和字节容量。池行汇总其类型数据。不要将池用量与类型用量相加，否则会重复计算同一批磁盘字节。各节点的预算应分别统计。

```sql
SELECT node, name, num_items, size, capacity, access, hit
FROM system.caches
WHERE name LIKE 'disk_cache_%' OR name LIKE '__disk_pool:%';
```

池使用率可通过 `size` 除以非零的池 `capacity` 计算。下方通用使用率示例无法为 `capacity` 为 `NULL` 的类型行生成比例。

[运行时控制](/sql/sql-functions/table-functions/set-cache-capacity#disk-cache-controls)使用 `disk_pool:data`，而非 `__disk_pool:data`。磁盘类型开关是在 `memory_cache_*` 类型名前加 `disk:`。例如，`disk_cache_column_data` 行对应 `disk:memory_cache_column_data`。

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
