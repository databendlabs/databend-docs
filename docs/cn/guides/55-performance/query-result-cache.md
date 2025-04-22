```md
---
title: 查询结果缓存
---

查询结果缓存是 Databend 中的一项性能优化功能，它可以存储先前查询的结果，从而允许直接从缓存中提供重复查询，而无需重新计算。 这样可以减少查询延迟并提高整体系统效率，尤其是在重复的分析工作负载中。

## 启用查询结果缓存

查询结果缓存默认处于禁用状态，需要在每个会话中手动启用：

:::note
缓存的查询结果在过期（达到其 TTL 后）、单个查询结果的缓存大小超过配置的限制或会话结束时会自动释放。 为了有效地管理缓存空间，请根据您的使用模式调整 TTL 和查询结果缓存大小设置。
:::

```sql
-- 启用查询结果缓存
SET enable_query_result_cache = 1;
```

## 配置查询结果缓存

您可以通过配置以下设置来控制哪些查询结果被缓存以及如何缓存它们：

| 设置                                 | 默认值 | 描述                                                                                                                              |
|-----------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------|
| `enable_query_result_cache`             | 0       | 启用查询结果缓存以提高相同查询的性能。                                                                                             |
| `query_result_cache_allow_inconsistent` | 0       | 确定即使底层数据可能已更改，Databend 是否可以返回缓存的查询结果。                                                                   |
| `query_result_cache_max_bytes`          | 1048576 | 指定单个缓存查询结果的最大大小（以字节为单位）。                                                                                             |
| `query_result_cache_min_execute_secs`   | 1       | 查询必须至少运行这么多秒，其结果才有资格被缓存。                                                                                             |
| `query_result_cache_ttl_secs`           | 300     | 设置缓存结果的 TTL（以秒为单位）。 TTL 过期后，缓存的结果将被视为陈旧，不会被重用。                                                                 |

## 使用示例

此示例演示如何启用结果缓存，运行 TPC-H Q1 查询，并从缓存中检索结果。

1. 启用查询结果缓存并将其配置为缓存所有查询，即使是那些执行速度很快的查询：

```bash
eric@(eric-xsmall)/tpch_100> SET enable_query_result_cache = 1;

SET enable_query_result_cache = 1

0 row read in 0.000 sec. Processed 0 row, 0 B (NaN rows/s, 0 B/s)

eric@(eric-xsmall)/tpch_100> SET query_result_cache_min_execute_secs = 0;

SET query_result_cache_min_execute_secs = 0

0 row read in 0.000 sec. Processed 0 row, 0 B (NaN rows/s, 0 B/s)
```

2. 首次运行 TPC-H Q1 查询。 请注意，它需要 **21.492** 秒才能完成，因为结果尚未被缓存。

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

3. 检查系统表 [system.query_cache](/sql/sql-reference/system-tables/system-query-cache) 以确认查询结果已被缓存。

```bash
eric@(eric-xsmall)/tpch_100> select * from system.query_cache;

SELECT * FROM system.query_cache
```

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                                                                                                                                                                                                                                                     sql                                                                                                                                                                                                                                                                                                                                    │               query_id               │ result_size │ num_rows │                          partitions_sha                          │                                                         location                                                        │ active_result_scan │
│                                                                                                                                                                                                                                                                                                                                   String                                                                                                                                                                                                                                                                                                                                   │                String                │    UInt64   │  UInt64  │                              String                              │                                                          String                                                         │       Boolean      │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────┼─────────────┼──────────┼──────────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┼────────────────────┤
│ SELECT l_returnflag, l_linestatus, sum(l_quantity) AS sum_qty, sum(l_extendedprice) AS sum_base_price, sum(l_extendedprice * (1 - l_discount)) AS sum_disc_price, sum(l_extendedprice * (1 - l_discount) * (1 + l_tax)) AS sum_charge, sum(l_quantity) / if(count(l_quantity) = 0, 1, count(l_quantity)) AS avg_qty, sum(l_extendedprice) / if(count(l_extendedprice) = 0, 1, count(l_extendedprice)) AS avg_price, sum(l_discount) / if(count(l_discount) = 0, 1, count(l_discount)) AS avg_disc, COUNT(*) AS count_order FROM lineitem WHERE l_shipdate <= add_days(to_date('1998-12-01'), - 90) GROUP BY l_returnflag, l_linestatus ORDER BY l_returnflag, l_linestatus │ 022e140b-e2d3-4c3f-8642-f715c98855e2 │         605 │        4 │ 7e626f39b6cd41ea9ba6d3cc5d079d749ea4be81faa264e4b9321292b54fcc72 │ _result_cache/b9da8ce26c2b1dc08d0cfd36590e54b5a7808c0596b3566a67576d30442df881/b8053f471acc4f8ebaa9064975581e2e.parquet │ false              │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
1 row read in 0.003 sec. Processed 1 row, 934 B (333.33 rows/s, 304.04 KiB/s)
```

4. 再次运行 TPC-H Q1 查询。请注意，它仅需 **0.164** 秒即可完成，因为结果是从缓存中检索的。

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
```

```
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

您还可以使用 [RESULT_SCAN](/sql/sql-functions/table-functions/result-scan) 表函数检索缓存的结果。例如：

```sql
SELECT * FROM RESULT_SCAN(LAST_QUERY_ID());
```