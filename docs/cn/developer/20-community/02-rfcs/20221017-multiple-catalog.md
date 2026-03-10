---
title: 多目录
description: databend 的多目录支持
---

- RFC PR: [datafuselabs/databend#8255](https://github.com/databendlabs/databend/pull/8255)
- Tracking Issue: [datafuselabs/databend#8300](https://github.com/databendlabs/databend/issues/8300)

## 概要

允许用户为 databend 维护多个目录。

## 动机

Databend 在三个层级组织数据：

```txt
catalog -> database -> table
```

- `catalog`: databend 的最大层级，包含所有数据库和表，由 [`Catalog`](https://github.com/databendlabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/catalog.rs#L80) 提供。
- `database`: 表的容器，由 [`Database`](https://github.com/databendlabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/database.rs#L44) 提供。
- `table`: databend 中的最小单元，由 [`Table`](https://github.com/databendlabs/databend/blob/556aedc00e5e8a95a7551d0ec21b8e6fa7573e0a/src/query/catalog/src/table.rs#L44) 提供。

默认情况下，所有数据库和表都将存储在 `default` 目录中（由 `metasrv` 提供支持）。

Databend 现在支持多个目录，但仅以静态方式支持。

要允许访问 `hive` 目录，用户需要在 `databend-query.toml` 中以这种方式配置 `hive`：

```toml
[catalog]
meta_store_address = "127.0.0.1:9083"
protocol = "binary"
```

用户无法在运行时添加/更改/删除目录。

通过允许用户为 databend 维护多个目录，我们可以更快地集成更多目录，例如 `iceberg`。

## 指导性解释

在此 RFC 实现后，用户可以创建新的目录，例如：

```sql
CREATE CATALOG my_hive
  TYPE=HIVE
  CONNECTION = (URL='<hive-meta-store>' THRIFT_PROTOCOL=BINARY);
SELECT * FROM my_hive.DB.table;
```

此外，用户可以更改或删除目录：

```sql
DROP CATALOG my_hive;
```

用户可以添加更多目录，例如：

```sql
CREATE CATALOG my_iceberg
  TYPE=ICEBERG
  CONNECTION = (URL='s3://my_bucket/path/to/iceberg');
SELECT * FROM my_iceberg.DB.table;
```

借助此功能，用户现在可以连接来自不同目录的数据：

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

Databend 现在具有用于多个目录的框架。我们唯一的改变是将目录相关信息存储在 metasrv 中。

为了可以在没有 `metasrv` 的情况下启动查询，我们还将支持在配置中配置目录，例如：

```toml
[catalogs.my_hive]
meta_store_address = "127.0.0.1:9083"
protocol = "binary"

[catalogs.my_iceberg]
URL = "s3://bucket"
```

静态目录将始终从配置中加载，并且无法更改或删除。

## 缺点

没有。

## 原理和替代方案

没有。

## 先例

### Presto

[Presto](https://prestodb.io/) 是一个开源 SQL 查询引擎，它快速、可靠且高效。它没有持久化状态，因此将配置其所有连接器。

以 iceberg 为例：

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

没有。

## 未来可能性

### Iceberg Catalog

在 RFC [Iceberg External Table](https://github.com/databendlabs/databend/pull/8215) 中讨论

### Delta Sharing Catalog

在 [Tracking issues of integration with delta sharing](https://github.com/databendlabs/databend/issues/7830) 中讨论
