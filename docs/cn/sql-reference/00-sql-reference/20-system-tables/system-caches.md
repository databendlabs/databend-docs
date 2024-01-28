---
title: system.caches
---

Databend 中各种缓存的概览。

下表显示了缓存名称、缓存中的项目数量以及缓存的大小：
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