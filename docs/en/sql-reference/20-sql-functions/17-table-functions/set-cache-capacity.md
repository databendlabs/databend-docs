---
title: SYSTEM$SET_CACHE_CAPACITY
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.960"/>

Changes cache capacity at runtime across the warehouse's query nodes. The result contains each node's status. Changes are not persisted. After a restart, Databend rebuilds capacities from its configuration and backend defaults.

See [system.caches](../../00-sql-reference/31-system-tables/system-caches.md) for cache names and [Query Config](/guides/self-hosted/references/node-config/query-config#shared-memory-cache) for the optional shared backend.

## Syntax

```sql
CALL system$set_cache_capacity('<cache_name>', <new_capacity>)
```

The shared backend also supports restoring a cache's startup limit:

```sql
CALL system$set_cache_capacity('<cache_name>', 'default');
```

| Parameter | Description |
|-----------|-------------|
| cache_name | A `memory_cache_*` name. With the shared backend, also accepts `pool:meta`, `pool:index`, `pool:data`, or `all`. |
| new_capacity | Nonnegative integer. The legacy backend uses the cache's `count` or `bytes` unit. The shared backend uses bytes. `0` disables the cache or pool. |

## Backend Rules

- The legacy backend remains the default. It rejects pool targets, `all`, and `'default'`.
- With the shared backend, a per-cache byte limit remains subject to the pool's budget. It does not reserve memory for that cache.
- With the shared backend, `'default'` restores a cache's startup limit from `cache.kind_max_bytes` or its built-in default. It does not reset a pool. It is not supported for `all` or `pool:*`.
- Most shared caches start enabled with no separate per-cache limit. Raw `memory_cache_column_data` starts disabled unless configured otherwise. Its `'default'` can therefore turn it off again.
- `all` accepts only `0`. It sets all three shared pool capacities to zero. It does not disable configured disk tiers. Restore each pool with a numeric capacity when needed.
- Use `pool:meta` as the command target, not the system-table summary name `__pool:meta`.
- No `disk_cache_*` tier can be resized with this command.
- Lowering a limit can evict entries. Memory held by active queries might not be released immediately.

### Inverted Index Payload Target

With the legacy backend, `memory_cache_inverted_index_payload` sets a combined budget for the page cache and `memory_cache_inverted_index_full_payload`. It does not set only the page cache's capacity. Setting this target to `0` disables both payload memory caches.

With the shared backend, this same target changes only the page-cache kind. Resize `memory_cache_inverted_index_full_payload` separately to change its limit. Both remain subject to the `index` pool. These runtime changes do not alter disk-tier capacities or persist after restart.

## Examples

With the legacy backend, set the Bloom index metadata cache to 5000 entries:

```sql
CALL system$set_cache_capacity('memory_cache_bloom_index_file_meta_data', 5000);

┌────────────────────────┬────────┐
│ node                   │ result │
├────────────────────────┼────────┤
│ Gwo2DYOLZ9zAdYbGTWY9y6 │ Ok     │
└────────────────────────┴────────┘
```

Disable the partition pruning memory cache with either backend:

```sql
CALL system$set_cache_capacity('memory_cache_prune_partitions', 0);
```

The following commands require the shared backend:

```sql
-- Limit decoded column arrays to 256 MiB within their data pool.
CALL system$set_cache_capacity('memory_cache_table_data', 268435456);

-- Restore this cache's startup limit, not necessarily an unlimited state.
CALL system$set_cache_capacity('memory_cache_table_data', 'default');

-- Change the entire index pool to 1 GiB.
CALL system$set_cache_capacity('pool:index', 1073741824);

-- Disable all shared memory pools, leaving disk tiers unchanged.
CALL system$set_cache_capacity('all', 0);
```
