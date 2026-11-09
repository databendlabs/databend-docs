---
title: SYSTEM$SET_CACHE_CAPACITY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Sets the maximum capacity for a named cache at runtime. Changes take effect immediately but are **not persisted** — the cache reverts to the value in the configuration file after a restart.

See also: [system.caches](../../00-sql-reference/31-system-tables/system-caches.md)

## Syntax

```sql
CALL system$set_cache_capacity('<cache_name>', <new_capacity>)
```

| Parameter    | Description                                                                                                                          |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| cache_name   | The name of the cache (see the cache list in [system.caches](../../00-sql-reference/31-system-tables/system-caches.md)) |
| new_capacity | New capacity value. Unit (count or bytes) depends on the cache type.                                                                 |

## Notes

- If the new capacity is **larger** than the current value, existing cache entries are retained.
- If the new capacity is **smaller**, entries may be evicted according to the LRU policy.
- Changes are **not persisted**. After a restart, the capacity reverts to the configuration file value.
- In releases before the unified disk cache, `disk_cache_column_data` cannot be adjusted with this command. For the new controls, see below.

<h2 id="disk-cache-controls">Disk Cache Controls</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

These controls require the [unified disk cache](/guides/self-hosted/references/node-config/query-config#unified-disk-cache) to be enabled. They work with either memory backend. The command applies across the warehouse's query nodes. Runtime changes do not persist after restart.

| Target | Capacity argument | Effect |
|--------|-------------------|--------|
| `disk_pool:meta`, `disk_pool:index`, `disk_pool:data` | Byte count, an integer percentage string such as `'50%'`, or `'default'` | Sets a pool limit. Percentages refer to `cache.disk.max_bytes`. `'default'` restores the pool's configured startup share. `0` empties and disables the pool. |
| `disk:memory_cache_bloom_index_filter` and other disk-enabled kinds | `0`, a positive integer, or `'default'` | `0` disables the kind's disk cache. A positive integer or `'default'` enables it. A positive value does not set a per-kind byte limit. |

The sum of pool limits cannot exceed `cache.disk.max_bytes`. Reduce another pool before increasing a pool beyond the available budget. Restoring `'default'` can also fail if the other pools leave too little budget.

Use `disk_pool:data` as the command target, not the summary row name `__disk_pool:data`. For a disk-kind target, prefix its `memory_cache_*` kind name with `disk:`. For example, `disk:memory_cache_column_data` controls raw column bytes, reported as `disk_cache_column_data`. It does not control decoded columns in `memory_cache_table_data`.

```sql
CALL system$set_cache_capacity('disk_pool:data', '50%');
CALL system$set_cache_capacity('disk_pool:data', 'default');
CALL system$set_cache_capacity('disk:memory_cache_bloom_index_filter', 0);
CALL system$set_cache_capacity('disk:memory_cache_bloom_index_filter', 'default');
```

The first two commands fit the default 10:20:70 pool allocation. A disk-kind switch does not change its memory cache. Re-enabling a kind does not enable a pool whose capacity is zero. Disabling a disk kind or pool removes its cached entries. Monitor pool and kind rows in [system.caches](../../00-sql-reference/31-system-tables/system-caches.md#disk-cache-statistics).

## Examples

Set the bloom index metadata cache to 5000 entries:

```sql
CALL system$set_cache_capacity('memory_cache_bloom_index_file_meta_data', 5000);

┌────────────────────────┬────────┐
│ node                   │ result │
├────────────────────────┼────────┤
│ Gwo2DYOLZ9zAdYbGTWY9y6 │ Ok     │
└────────────────────────┴────────┘
```

Disable partition pruning cache for testing:

```sql
CALL system$set_cache_capacity('memory_cache_prune_partitions', 0);
```
