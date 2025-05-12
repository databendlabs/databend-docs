---
title: EXPLAIN FRAGMENTS
---

显示 SQL 语句的分布式执行计划。

此命令将 SQL 语句的执行计划转换为 plan fragments，您可以在其中查看从 Databend 检索所需数据的过程。

## 语法

```sql
EXPLAIN FRAGMENTS <statement>
```

## 示例

```sql
EXPLAIN FRAGMENTS select COUNT() from numbers(10) GROUP BY number % 3;

+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| explain                                                                                                                                                                     |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Fragment 0:                                                                                                                                                                 |
|   DataExchange: Shuffle                                                                                                                                                     |
|   AggregatorPartial: groupBy=[[(number % 3)]], aggr=[[COUNT()]]                                                                                                             |
|     Expression: (number % 3):UInt8 (Before GroupBy)                                                                                                                         |
|       ReadDataSource: scan schema: [number:UInt64], statistics: [read_rows: 10, read_bytes: 80, partitions_scanned: 1, partitions_total: 1], push_downs: [projections: [0]] |
|                                                                                                                                                                             |
| Fragment 2:                                                                                                                                                                 |
|   DataExchange: Merge                                                                                                                                                       |
|   Projection: COUNT():UInt64                                                                                                                                                |
|     AggregatorFinal: groupBy=[[(number % 3)]], aggr=[[COUNT()]]                                                                                                             |
|       Remote[receive fragment: 0]                                                                                                                                           |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
11 rows in set (0.02 sec)
```