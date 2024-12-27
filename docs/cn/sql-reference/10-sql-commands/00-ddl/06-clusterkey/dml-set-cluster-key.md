---
title: 设置集群键
sidebar_position: 1
---

在创建表时设置集群键。

集群键旨在通过物理上将数据聚集在一起来提高查询性能。例如，当您将某一列设置为表的集群键时，表数据将按照您设置的列进行物理排序。如果您的查询大多通过该列进行过滤，这将最大化查询性能。

> **注意:** 对于字符串列，集群统计仅使用前8个字节。您可以使用子字符串来提供足够的基数。

另请参阅：

* [修改集群键](./dml-alter-cluster-key.md) 
* [删除集群键](./dml-drop-cluster-key.md)

## 语法

```sql
CREATE TABLE <表名> ... CLUSTER BY ( <表达式1> [ , <表达式2> ... ] )
```

## 示例

以下命令创建了一个按列聚类的表：

```sql
CREATE TABLE t1(a int, b int) CLUSTER BY(b,a);

CREATE TABLE t2(a int, b string) CLUSTER BY(SUBSTRING(b, 5, 6));
```