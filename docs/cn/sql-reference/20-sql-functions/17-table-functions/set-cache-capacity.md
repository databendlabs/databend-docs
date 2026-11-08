---
title: SYSTEM$SET_CACHE_CAPACITY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

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
- 在统一磁盘缓存之前的版本中，`disk_cache_column_data` 不支持通过此命令调整。新控制方式见下文。

<h2 id="disk-cache-controls">磁盘缓存控制</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

以下控制方式要求已启用[统一磁盘缓存](/guides/self-hosted/references/node-config/query-config#unified-disk-cache)。两种内存后端均可使用。命令在 Warehouse 的 Query 节点上执行。运行时修改不会在重启后保留。

| 目标 | 容量参数 | 效果 |
|------|----------|------|
| `disk_pool:meta`、`disk_pool:index`、`disk_pool:data` | 字节数、`'50%'` 等整数百分比字符串或 `'default'` | 设置池上限。百分比以 `cache.disk.max_bytes` 为基数。`'default'` 恢复配置的启动份额。`0` 清空并禁用该池。 |
| `disk:memory_cache_bloom_index_filter` 等支持磁盘缓存的类型 | `0`、正整数或 `'default'` | `0` 禁用该类型的磁盘缓存。正整数或 `'default'` 启用该类型。正值不代表单独的类型字节上限。 |

所有池的上限总和不得超过 `cache.disk.max_bytes`。如需将一个池增大到可用预算之外，请先减小另一个池。其他池占用过多预算时，恢复 `'default'` 也可能失败。

命令目标应使用 `disk_pool:data`，而不是汇总行名称 `__disk_pool:data`。磁盘类型目标是在 `memory_cache_*` 类型名前加 `disk:`。例如，`disk:memory_cache_column_data` 控制原始列字节，对应统计行 `disk_cache_column_data`，不控制 `memory_cache_table_data` 中的解码列。

```sql
CALL system$set_cache_capacity('disk_pool:data', '50%');
CALL system$set_cache_capacity('disk_pool:data', 'default');
CALL system$set_cache_capacity('disk:memory_cache_bloom_index_filter', 0);
CALL system$set_cache_capacity('disk:memory_cache_bloom_index_filter', 'default');
```

前两条命令适用于默认的 10:20:70 池分配。磁盘类型开关不改变对应内存缓存。重新启用一个类型不会启用容量为零的池。禁用磁盘类型或池会移除其缓存条目。可通过 [system.caches](../../00-sql-reference/31-system-tables/system-caches.md#disk-cache-statistics) 监控池和类型行。

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
