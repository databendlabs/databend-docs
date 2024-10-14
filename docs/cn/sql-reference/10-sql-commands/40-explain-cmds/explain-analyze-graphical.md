---
title: EXPLAIN ANALYZE GRAPHICAL
---

`EXPLAIN ANALYZE GRAPHICAL` 用于打开一个浏览器页面，以显示查询执行计划以及实际运行时的性能统计数据。

这对于分析查询性能和识别查询中的瓶颈非常有用。

 **注意：** 此功能仅在 BendSQL 中可用。
 
## 语法

```sql
EXPLAIN ANALYZE GRAPHICAL <statement>
```

## 示例

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

// 将打开一个浏览器页面以显示查询执行计划和性能统计数据。
```