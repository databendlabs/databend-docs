---
title: Monitor
---
import IndexOverviewList from '@site/src/components/IndexOverviewList';
import FunctionDescription from '@site/src/components/FunctionDescription';

<IndexOverviewList />

<h2 id="node-local-cache-statistics">Node-Local Cache Statistics</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

For self-hosted monitoring, use `GET /v1/caches` on each Query node's internal Admin API. This request does not run SQL, create a session, or contact other nodes. Keep the Admin API on a trusted internal network. Do not expose it as a public query endpoint.

Run this request on the Query host. Replace the address with your configured `admin_api_address` if needed. See [Query Configuration](/guides/self-hosted/references/node-config/query-config).

```bash
curl http://127.0.0.1:8080/v1/caches
```

The response is a JSON array. It includes disabled caches and pool summaries. Collect each node separately; the endpoint does not discover or aggregate warehouse nodes.

| Fields | Meaning |
|--------|---------|
| `node`, `name`, `pool`, `is_pool` | Node identity, row name, containing pool (or `null`), and whether the row is a pool summary. |
| `enabled`, `num_items` | Whether the cache or pool is enabled, and its entry count. |
| `capacity`, `unit` | Limit in `count` or `bytes`. A `null` capacity means the cache is bounded by its pool, not unlimited. |
| `size`, `in_cache_size` | Charged bytes and resident cached bytes. Charged bytes can include evicted values still held by readers. |
| `access`, `hit`, `miss` | Cumulative counters, not rates. Compare samples to measure activity over an interval. |

Pool rows and their cache rows overlap. Do not sum both when you calculate memory usage or cache activity. For SQL-based inspection, see [system.caches](/sql/sql-reference/system-tables/system-caches).