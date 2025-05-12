---
title: SET CLUSTER KEY
sidebar_position: 1
---

在创建表时设置 cluster key。

Cluster key 旨在通过将数据物理地聚集在一起来提高查询性能。例如，当你将一列设置为表的 cluster key 时，表数据将按你设置的列进行物理排序。如果你的大多数查询都按该列进行过滤，这将最大限度地提高查询性能。

> **注意：** 对于 String 类型的列，集群统计信息仅使用前 8 个字节。你可以使用子字符串来提供足够的基数。

另请参阅：

* [ALTER CLUSTER KEY](./dml-alter-cluster-key.md) 
* [DROP CLUSTER KEY](./dml-drop-cluster-key.md)

## 语法

```sql
CREATE TABLE <name> ... CLUSTER BY ( <expr1> [ , <expr2> ... ] )
```

## 示例

此命令创建一个按列聚类的表：

```sql
CREATE TABLE t1(a int, b int) CLUSTER BY(b,a);

CREATE TABLE t2(a int, b string) CLUSTER BY(SUBSTRING(b, 5, 6));
```