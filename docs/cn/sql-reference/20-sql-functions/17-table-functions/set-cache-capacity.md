---
title: SYSTEM$SET_CACHE_CAPACITY
---

在运行时设置指定缓存的最大容量。修改立即生效，但**不会持久化** — 重启后缓存容量将恢复为配置文件中的设定值。

另请参阅：[system.caches](../../00-sql-reference/31-system-tables/system-caches.md)

## 语法

```sql
CALL system$set_cache_capacity('<cache_name>', <new_capacity>)
```

| 参数         | 说明                                                                                                                              |
|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| cache_name   | 缓存名称（参见 [system.caches](../../00-sql-reference/31-system-tables/system-caches.md) 中的缓存列表） |
| new_capacity | 新的容量值。单位（个数或字节）取决于缓存类型。                                                                                    |

## 注意事项

- 若新容量**大于**当前值，已有缓存条目不会丢失。
- 若新容量**小于**当前值，可能触发 LRU 策略逐出部分缓存条目。
- 修改**不会持久化**，重启后恢复为配置文件中的值。
- `disk_cache_column_data` 不支持通过此命令调整。

## 示例

将布隆过滤器元数据缓存设置为 5000 个条目：

```sql
CALL system$set_cache_capacity('memory_cache_bloom_index_file_meta_data', 5000);

┌────────────────────────┬────────┐
│ node                   │ result │
├────────────────────────┼────────┤
│ Gwo2DYOLZ9zAdYbGTWY9y6 │ Ok     │
└────────────────────────┴────────┘
```

关闭 partition pruning 缓存以便测试：

```sql
CALL system$set_cache_capacity('memory_cache_prune_partitions', 0);
```
