---
title: Query Result Cache
---

The Query Result Cache is a performance optimization feature in Databend that stores the results of previous queries, allowing repeated queries to be served directly from cache instead of being recomputed. This reduces query latency and improves overall system efficiency, especially for repeated analytical workloads.

## Enabling Query Result Cache

The Query Result Cache is disabled by default and needs to be turned on manually in each session:

:::note
Cached query results are automatically released when they expire (once their TTL is reached), when the cache size for an individual query result exceeds the configured limit, or when the session ends. To manage cache space effectively, adjust your TTL and query result cache size settings according to your usage patterns.
:::

```sql
-- Enable the query result cache
SET enable_query_result_cache = 1;
```

## Configuring Query Result Cache

You can control which query results are cached and how they are cached by configuring the following settings:

| Setting                                 | Default | Description                                                                                                                   |
|-----------------------------------------|---------|-------------------------------------------------------------------------------------------------------------------------------|
| `enable_query_result_cache`             | 0       | Enables query result caching to improve performance for identical queries.                                                    |
| `query_result_cache_allow_inconsistent` | 0       | Determines whether Databend can return cached query results even if the underlying data may have changed.                     |
| `query_result_cache_max_bytes`          | 1048576 | Specifies the maximum size in bytes for a single cached query result.                                                         |
| `query_result_cache_min_execute_secs`   | 1       | A query must run for at least this many seconds before its result is eligible for caching.                                    |
| `query_result_cache_ttl_secs`           | 300     | Sets the TTL in seconds for cached results. After the TTL expires, the cached result is considered stale and won’t be reused. |

## Usage Examples

This example shows how to enable the result cache, run the TPC-H Q1 query, and retrieve the result from cache. 

1. Enable the query result cache and configure it to cache all queries, even those that execute quickly:

```bash
eric@(eric-xsmall)/tpch_100> SET enable_query_result_cache = 1;

SET enable_query_result_cache = 1

0 row read in 0.000 sec. Processed 0 row, 0 B (NaN rows/s, 0 B/s)

eric@(eric-xsmall)/tpch_100> SET query_result_cache_min_execute_secs = 0;

SET query_result_cache_min_execute_secs = 0

0 row read in 0.000 sec. Processed 0 row, 0 B (NaN rows/s, 0 B/s)
```

2. Run the TPC-H Q1 query for the first time. Note that it takes **21.492** seconds to complete, as the result has not been cached yet.

```bash
eric@(eric-xsmall)/tpch_100> select
    l_returnflag,
    l_linestatus,
    sum(l_quantity) as sum_qty,
    sum(l_extendedprice) as sum_base_price,
    sum(l_extendedprice * (1 - l_discount)) as sum_disc_price,
    sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) as sum_charge,
    avg(l_quantity) as avg_qty,
    avg(l_extendedprice) as avg_price,
    avg(l_discount) as avg_disc,
    count(*) as count_order
from
    lineitem
where
        l_shipdate <= add_days(to_date('1998-12-01'), -90)
group by
    l_returnflag,
    l_linestatus
order by
    l_returnflag,
    l_linestatus;

SELECT
    l_returnflag,
    l_linestatus,
    sum(l_quantity) AS sum_qty,
    sum(l_extendedprice) AS sum_base_price,
    sum((l_extendedprice * (1 - l_discount))) AS sum_disc_price,
    sum(((l_extendedprice * (1 - l_discount)) * (1 + l_tax))) AS sum_charge,
    avg(l_quantity) AS avg_qty,
    avg(l_extendedprice) AS avg_price,
    avg(l_discount) AS avg_disc,
    COUNT(*) AS count_order
FROM
    lineitem
WHERE
    (l_shipdate <= add_days(to_date('1998-12-01'), (- 90)))
GROUP BY
    l_returnflag, l_linestatus
ORDER BY
    l_returnflag, l_linestatus
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ l_returnflag │ l_linestatus │          sum_qty         │      sum_base_price      │      sum_disc_price      │        sum_charge        │          avg_qty         │         avg_price        │         avg_disc         │ count_order │
│    String    │    String    │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 4)) │ Nullable(Decimal(38, 6)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │    UInt64   │
├──────────────┼──────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼─────────────┤
│ A            │ F            │ 3775127758.00            │ 5660776097194.45         │ 5377736398183.9374       │ 5592847429515.927026     │ 25.49937042              │ 38236.11698430           │ 0.05000224               │   148047881 │
│ N            │ F            │ 98553062.00              │ 147771098385.98          │ 140384965965.0348        │ 145999793032.775829      │ 25.50155696              │ 38237.19938880           │ 0.04998528               │     3864590 │
│ N            │ O            │ 7436302976.00            │ 11150725681373.59        │ 10593195308234.8523      │ 11016932248183.655467    │ 25.50000940              │ 38237.22764636           │ 0.04999792               │   291619617 │
│ R            │ F            │ 3775724970.00            │ 5661603032745.34         │ 5378513563915.4097       │ 5593662252666.916161     │ 25.50006628              │ 38236.69725845           │ 0.05000130               │   148067261 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
4 rows read in 21.492 sec. Processed 600.04 million rows, 52.53 GiB (27.92 million rows/s, 2.44 GiB/s)
```

3. Check the system table [system.query_cache](/sql/sql-reference/system-tables/system-query-cache) to confirm that the query result has been cached.

```bash
eric@(eric-xsmall)/tpch_100> select * from system.query_cache;

SELECT * FROM system.query_cache

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                                                                                                                                                                                                     sql                                                                                                                                                                                                                                                                                                                                    │               query_id               │ result_size │ num_rows │                          partitions_sha                          │                                                         location                                                        │ active_result_scan │
│                                                                                                                                                                                                                                                                                                                                   String                                                                                                                                                                                                                                                                                                                                   │                String                │    UInt64   │  UInt64  │                              String                              │                                                          String                                                         │       Boolean      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────┼──────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ SELECT l_returnflag, l_linestatus, sum(l_quantity) AS sum_qty, sum(l_extendedprice) AS sum_base_price, sum(l_extendedprice * (1 - l_discount)) AS sum_disc_price, sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) AS sum_charge, sum(l_quantity) / if(count(l_quantity) = 0, 1, count(l_quantity)) AS avg_qty, sum(l_extendedprice) / if(count(l_extendedprice) = 0, 1, count(l_extendedprice)) AS avg_price, sum(l_discount) / if(count(l_discount) = 0, 1, count(l_discount)) AS avg_disc, COUNT(*) AS count_order FROM lineitem WHERE l_shipdate <= add_days(to_date('1998-12-01'), - 90) GROUP BY l_returnflag, l_linestatus ORDER BY l_returnflag, l_linestatus │ 022e140b-e2d3-4c3f-8642-f715c98855e2 │         605 │        4 │ 7e626f39b6cd41ea9ba6d3cc5d079d749ea4be81faa264e4b9321292b54fcc72 │ _result_cache/b9da8ce26c2b1dc08d0cfd36590e54b5a7808c0596b3566a67576d30442df881/b8053f471acc4f8ebaa9064975581e2e.parquet │ false              │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
1 row read in 0.003 sec. Processed 1 row, 934 B (333.33 rows/s, 304.04 KiB/s)
```

4. Run the TPC-H Q1 query again. Note that it takes only **0.164** seconds to complete, as the result was retrieved from the cache.

```bash
eric@(eric-xsmall)/tpch_100> select
    l_returnflag,
    l_linestatus,
    sum(l_quantity) as sum_qty,
    sum(l_extendedprice) as sum_base_price,
    sum(l_extendedprice * (1 - l_discount)) as sum_disc_price,
    sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) as sum_charge,
    avg(l_quantity) as avg_qty,
    avg(l_extendedprice) as avg_price,
    avg(l_discount) as avg_disc,
    count(*) as count_order
from
    lineitem
where
        l_shipdate <= add_days(to_date('1998-12-01'), -90)
group by
    l_returnflag,
    l_linestatus
order by
    l_returnflag,
    l_linestatus;

SELECT
    l_returnflag,
    l_linestatus,
    sum(l_quantity) AS sum_qty,
    sum(l_extendedprice) AS sum_base_price,
    sum((l_extendedprice * (1 - l_discount))) AS sum_disc_price,
    sum(((l_extendedprice * (1 - l_discount)) * (1 + l_tax))) AS sum_charge,
    avg(l_quantity) AS avg_qty,
    avg(l_extendedprice) AS avg_price,
    avg(l_discount) AS avg_disc,
    COUNT(*) AS count_order
FROM
    lineitem
WHERE
    (l_shipdate <= add_days(to_date('1998-12-01'), (- 90)))
GROUP BY
    l_returnflag, l_linestatus
ORDER BY
    l_returnflag, l_linestatus

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ l_returnflag │ l_linestatus │          sum_qty         │      sum_base_price      │      sum_disc_price      │        sum_charge        │          avg_qty         │         avg_price        │         avg_disc         │ count_order │
│    String    │    String    │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 4)) │ Nullable(Decimal(38, 6)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │    UInt64   │
├──────────────┼──────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼─────────────┤
│ A            │ F            │ 3775127758.00            │ 5660776097194.45         │ 5377736398183.9374       │ 5592847429515.927026     │ 25.49937042              │ 38236.11698430           │ 0.05000224               │   148047881 │
│ N            │ F            │ 98553062.00              │ 147771098385.98          │ 140384965965.0348        │ 145999793032.775829      │ 25.50155696              │ 38237.19938880           │ 0.04998528               │     3864590 │
│ N            │ O            │ 7436302976.00            │ 11150725681373.59        │ 10593195308234.8523      │ 11016932248183.655467    │ 25.50000940              │ 38237.22764636           │ 0.04999792               │   291619617 │
│ R            │ F            │ 3775724970.00            │ 5661603032745.34         │ 5378513563915.4097       │ 5593662252666.916161     │ 25.50006628              │ 38236.69725845           │ 0.05000130               │   148067261 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
4 rows read in 0.164 sec. Processed 0 rows, 0 B (0 row/s, 0 B/s)
```

You can also retrieve the cached result using the [RESULT_SCAN](/sql/sql-functions/table-functions/result-scan) table function. For example:

```sql
SELECT * FROM RESULT_SCAN(LAST_QUERY_ID());
```