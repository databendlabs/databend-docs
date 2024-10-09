---
title: EXPLAIN ANALYZE GRAPHICAL
---

`EXPLAIN ANALYZE GRAPHICAL` used to open a browser page to display a query execution plan along with actual run-time performance statistics.

This is useful for analyzing query performance and identifying bottlenecks in a query.

 **Note:** This feature is available only in `bensql`.
 
## Syntax

```sql
EXPLAIN ANALYZE GRAPHICAL <statement>
```

## Examples

TPC-H Q21:
```sql
EXPLAIN ANALYZE GRAPHICAL SELECT s_name,
    ->        Count(*) AS numwait
    -> FROM   supplier,
    ->        lineitem l1,
    ->        orders,
    ->        nation
    -> WHERE  s_suppkey = l1.l_suppkey
    ->        AND o_orderkey = l1.l_orderkey
    ->        AND o_orderstatus = 'F'
    ->        AND l1.l_receiptdate > l1.l_commitdate
    ->        AND EXISTS (SELECT *
    ->                    FROM   lineitem l2
    ->                    WHERE  l2.l_orderkey = l1.l_orderkey
    ->                           AND l2.l_suppkey <> l1.l_suppkey)
    ->        AND NOT EXISTS (SELECT *
    ->                        FROM   lineitem l3
    ->                        WHERE  l3.l_orderkey = l1.l_orderkey
    ->                               AND l3.l_suppkey <> l1.l_suppkey
    ->                               AND l3.l_receiptdate > l3.l_commitdate)
    ->        AND s_nationkey = n_nationkey
    ->        AND n_name = 'EGYPT'
    -> GROUP  BY s_name
    -> ORDER  BY numwait DESC,
    ->           s_name
    -> LIMIT  100;

// will open a browser page to display the query execution plan and performance statistics.
```
