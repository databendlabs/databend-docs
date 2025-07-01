---
title: system.caches
---

Databend 中管理的各种缓存（Cache）概述。

下表展示了各个缓存的名称、项目数量及大小：
```sql
SELECT * FROM system.caches;
+--------------------------------+-----------+------+
| name                           | num_items | size |
+--------------------------------+-----------+------+
| table_snapshot_cache           |         2 |    2 |
| table_snapshot_statistic_cache |         0 |    0 |
| segment_info_cache             |        64 |   64 |
| bloom_index_filter_cache       |         0 |    0 |
| bloom_index_meta_cache         |         0 |    0 |
| prune_partitions_cache         |         2 |    2 |
| file_meta_data_cache           |         0 |    0 |
+--------------------------------+-----------+------+
```