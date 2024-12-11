---
title: Iceberg Catalog
description: 将Apache Iceberg格式的数据源作为外部目录访问。
---

- RFC PR: [datafuselabs/databend#8215](https://github.com/databendlabs/databend/pull/8215)
- Tracking Issue: [datafuselabs/databend#8216](https://github.com/databendlabs/databend/issues/8216)

## 概述

Iceberg 是数据湖仓中广泛支持的表格式。
本 RFC 描述了 iceberg 外部目录的行为以及我们将如何实现它。

## 动机

[Apache Iceberg](https://iceberg.apache.org) 是一种广泛用于数据湖仓的表格式，它提供了更完整的逻辑数据库视图，并且在作为外部表访问时具有更高的性能，因为用户不需要了解分区，并且在访问时通过文件的索引较少，相比`Hive`。

`Iceberg`的分裂和结构化也使得数据源的并发访问和版本管理更加安全、节省和方便。

![Apache Iceberg的堆栈](https://iceberg.apache.org/assets/images/iceberg-metadata.png)

支持 Iceberg 将使 databend 成为一个开放的数据湖，赋予其更多的 OLAP 能力。

## 指南级解释

### 创建 Iceberg Catalog

要使用 Iceberg 目录，用户需要建立一个具有必要权限的 iceberg 存储。然后他们可以在其上创建一个`catalog`。

```sql
CREATE CATALOG my_iceberg
  TYPE="iceberg"
  URL='s3://path/to/iceberg'
  CONNECTION=(
    ACCESS_KEY_ID=...
    SECRET_ACCESS_KEY=...
    ...
  )
```

### 访问 Iceberg 表的内容

```sql
SELECT * FROM my_iceberg.iceberg_db.iceberg_tbl;
```

在普通表和 Iceberg 表上的联合查询：

```sql
SELECT normal_tbl.book_name,
       my_iceberg.iceberg_db.iceberg_tbl.author
FROM normal_tbl,
     iceberg_tbl
WHERE normal_tbl.isbn = my_iceberg.iceberg_db.iceberg_tbl.isbn
  AND iceberg_tbl.sales > 100000;
```

在操作表时，所有数据仍然保留在用户提供的端。

### 时间回溯

Iceberg 提供了一系列快照及其时间戳。在其上进行时间回溯是自然的。

```sql
SELECT ...
FROM <iceberg_catalog>.<database_name>.<table_name>
AT ( { SNAPSHOT => <snapshot_id> | TIMESTAMP => <timestamp> } );
```

#### 访问快照元数据

用户应该能够在目录中查找快照 ID 列表：

```sql
SELECT snapshot_id FROM ICEBERG_SNAPSHOT(my_iceberg.iceberg_db.iceberg_tbl);
```

```
     snapshot_id
---------------------
 1234567890123456789
 1234567890123456790
(2 rows)
```

外部表当前读取的快照 ID 将始终是最新的。但用户可以使用`AT`进行时间回溯。

## 参考级解释

一个新的目录类型`ICEBERG`，以及用于从 Iceberg 存储读取数据的表引擎。

### 表引擎

该表引擎使用户能够从已建立的 Apache Iceberg 端点读取数据。外部表的所有表内容和元数据应保留在用户提供的 Iceberg 数据源中，以 Iceberg 的方式。

该引擎将跟踪最后提交的快照，并且应该能够从前快照读取。

### 外部位置

无论 Iceberg 在哪里，如 S3、GCS 或 OSS，如果 Databend 支持该存储，那么 Iceberg 应该是可访问的。用户需要告诉 databend Iceberg 存储的位置以及 databend 应该如何访问该存储。

### 类型约定

| Iceberg         | 说明                                | Databend                      |
| --------------- | ----------------------------------- | ----------------------------- |
| `boolean`       | 真或假                              | `BOOLEAN`                     |
| `int`           | 32 位有符号整数                     | `INT32`                       |
| `long`          | 64 位有符号整数                     | `INT64`                       |
| `float`         | 32 位 IEEE 754 浮点数               | `FLOAT`                       |
| `double`        | 64 位 IEEE 754 浮点数               | `DOUBLE`                      |
| `decimal(P, S)` | 固定点小数；精度 P，比例 S          | 不支持                        |
| `date`          | 没有时区或时间的日历日期            | `DATE`                        |
| `time`          | 没有日期、时区的时间戳              | `TIMESTAMP`，将日期转换为今天 |
| `timestamp`     | 没有时区的时间戳                    | `TIMESTAMP`，将时区转换为 GMT |
| `timestamptz`   | 带时区的时间戳                      | `TIMESTAMP`                   |
| `string`        | UTF-8 字符串                        | `VARCHAR`                     |
| `uuid`          | 16 字节固定字节数组，通用唯一标识符 | `VARCHAR`                     |
| `fixed(L)`      | 长度为 L 的固定长度字节数组         | `VARCHAR`                     |
| `binary`        | 任意长度的字节数组                  | `VARCHAR`                     |
| `struct`        | 类型化值的元组                      | `OBJECT`                      |
| `list`          | 具有某些元素类型的值的集合          | `ARRAY`                       |
| `map`           |                                     | `OBJECT`                      |

## 缺点

无

## 基本原理和替代方案

### Iceberg 外部表

从 Iceberg 存储创建外部表：

```sql
CREATE EXTERNAL TABLE [IF NOT EXISTS] [db.]table_name
[(
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    ...
)] ENGINE=ICEBERG
ENGINE_OPTIONS=(
  DATABASE='db0'
  TABLE='tbl0'
  LOCATION=<external-location>
)
```

将引入一个新的表引擎`ICEBERG`，所有数据将仍然保留在 Iceberg 存储中。外部表还应支持用户查询其快照数据和时间回溯。

```sql
SELECT snapshot_id FROM ICEBERG_SNAPSHOT('<db_name>', '<external_table_name');
```

```
 snapshot_id
--------------
73556087355608
```

经过讨论，选择了上述的目录方式，因为它对 Iceberg 功能的支持更完整，并且更符合当前 Hive 目录的设计。

## 先前技术

无

## 未解决的问题

无

## 未来的可能性

### 从 Iceberg 快照创建表

Iceberg 提供了快照功能，可以从快照创建表。

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name
(
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    <column_name> <data_type> [ NOT NULL | NULL] [ { DEFAULT <expr> }],
    ...
) ENGINE = `ICEBERG`
ENGINE_OPTIONS = (
  URL = 's3://path/to/iceberg'
  DATABASE = <iceberg_db>
  TABLE = <iceberg_tbl>
  [ SNAPSHOT = { SNAPSHOT_ID => <snapshot_id> | TIMESTAMP => <timestamp> } ]
)
```

### 模式演变

外部表使用的默认 Iceberg 快照应始终是最新提交的快照：

```sql
SELECT snapshot_id from ICEBERG_SNAPSHOT(iceberg_catalog.iceberg_db.iceberg_tbl);
```

```
  snapshot_id
---------------
 0000000000001
```

支持模式演变使 databend 能够修改 Iceberg 的内容。
例如，向 Iceberg 表插入新记录：

```sql
INSERT INTO iceberg_catalog.iceberg_db.iceberg_tbl VALUES ('datafuselabs', 'How To Be a Healthy DBA', '2022-10-14');
```

这将在 Iceberg 存储中创建一个新的快照：

```sql
SELECT snapshot_id from ICEBERG_SNAPSHOT(iceberg_catalog.iceberg_db.iceberg_tbl);
```

```
  snapshot_id
---------------
 0000000000001
 0000000000002
```
