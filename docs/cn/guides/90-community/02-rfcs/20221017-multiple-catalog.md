---
title: 多目录支持
description: Databend的多目录支持
---

- RFC PR: [datafuselabs/databend#8255](https://github.com/datafuselabs/databend/pull/8255)
- 跟踪问题: [datafuselabs/databend#8300](https://github.com/datafuselabs/databend/issues/8300)

## 概要

允许用户为databend维护多个目录。

## 动机

Databend在三个层次上组织数据：

```txt
catalog -> database -> table
```

- `catalog`：databend的最大层级，包含所有数据库和表，由[`Catalog`](https://github.com/datafuselabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/catalog.rs#L80)提供
- `database`：表的容器，由[`Database`](https://github.com/datafuselabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/database.rs#L44)提供
- `table`：databend中最小的单位，由[`Table`](https://github.com/datafuselabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/table.rs#L44)提供

默认情况下，所有数据库和表都将存储在`default`目录中（由`metasrv`提供）。

Databend现在支持多个目录，但只是以静态方式。

要访问`hive`目录，用户需要以以下方式在`databend-query.toml`中配置`hive`：

```toml
[catalog]
meta_store_address = "127.0.0.1:9083"
protocol = "binary"
```

用户无法在运行时添加/修改/删除目录。

通过允许用户为databend维护多个目录，我们可以更快地集成更多目录，如`iceberg`。

## 指南级解释

在此RFC实施后，用户可以创建新目录，如：

```sql
CREATE CATALOG my_hive
  TYPE=HIVE
  CONNECTION = (URL='<hive-meta-store>' THRIFT_PROTOCOL=BINARY);
SELECT * FROM my_hive.DB.table;
```

此外，用户可以修改或删除目录：

```sql
DROP CATALOG my_hive;
```

用户可以添加更多目录，如：

```sql
CREATE CATALOG my_iceberg
  TYPE=ICEBERG
  CONNECTION = (URL='s3://my_bucket/path/to/iceberg');
SELECT * FROM my_iceberg.DB.table;
```

有了这个功能，用户现在可以从不同目录中联合数据：

```sql
select
    my_iceberg.DB.purchase_records.Client_ID,
    my_iceberg.DB.purchase_records.Item,
    my_iceberg.DB.purchase_records.QTY
from my_hive.DB.vip_info
inner join my_iceberg.DB.purchase_records
    on my_hive.DB.vip_info.Client_ID = my_iceberg.DB.purchase_records.Client_ID;
```

## 参考级解释

Databend现在已经有了多目录的框架。对我们唯一的变化是将与目录相关的信息存储在metasrv中。

为了能够在没有`metasrv`的情况下开始查询，我们还将支持像这样在配置中配置目录：

```toml
[catalogs.my_hive]
meta_store_address = "127.0.0.1:9083"
protocol = "binary"

[catalogs.my_iceberg]
URL = "s3://bucket"
```

静态目录将始终从配置中加载，并且不能被修改或删除。

## 缺点

无。

## 理由和替代方案

无。

## 先例

### Presto

[Presto](https://prestodb.io/) 是一个开源的SQL查询引擎，它快速、可靠且在大规模下高效。它没有持久化状态，所以所有的连接器都将被配置。

以iceberg为例：

```ini
connector.name=iceberg
hive.metastore.uri=hostname:port
iceberg.catalog.type=hive
```

使用时：

```sql
USE iceberg.tpch;
CREATE TABLE IF NOT EXISTS ctas_nation AS (SELECT * FROM nation);
DESCRIBE ctas_nation;
```

## 未解决的问题

无。

## 未来可能性

### Iceberg目录

在RFC [Iceberg外部表](https://github.com/datafuselabs/databend/pull/8215)中讨论

### Delta Sharing目录

在[与delta sharing集成的跟踪问题](https://github.com/datafuselabs/databend/issues/7830)中讨论