---
title: SET CLUSTER KEY
sidebar_position: 1
---

在创建表时设置集群键。

集群键旨在通过物理上将数据聚集在一起来提高查询性能。例如，当您将某一列设置为表的集群键时，表数据将按您设置的列进行物理排序。如果您的多数查询都按该列进行过滤，这将最大化查询性能。

> **注意：** 对于字符串列，集群统计仅使用前8个字节。您可以使用子字符串来提供足够的基数。

另请参阅：

* [ALTER CLUSTER KEY](./dml-alter-cluster-key.md) 
* [DROP CLUSTER KEY](./dml-drop-cluster-key.md)

## 语法

```sql
CREATE TABLE <name> ... CLUSTER BY ( <expr1> [ , <expr2> ... ] )
```

## 示例

此命令创建按列聚簇的表：

```sql
CREATE TABLE t1(a int, b int) CLUSTER BY(b,a);

CREATE TABLE t2(a int, b string) CLUSTER BY(SUBSTRING(b, 5, 6));
```