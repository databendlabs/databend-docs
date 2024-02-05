---
title: Iceberg 目录
description: 作为外部目录访问 Apache Iceberg 格式的数据源。
---

- RFC PR: [datafuselabs/databend#8215](https://github.com/datafuselabs/databend/pull/8215)
- 跟踪问题: [datafuselabs/databend#8216](https://github.com/datafuselabs/databend/issues/8216)

## 概要

Iceberg 是数据湖仓库中广泛支持的表格格式。
本 RFC 描述了 iceberg 外部目录将如何表现以及我们将如何实现它。

## 动机

[Apache Iceberg](https://iceberg.apache.org) 是数据湖仓库中广泛使用的表格格式，它提供了数据库的更完整逻辑视图，并且由于用户不需要了解分区并且在访问时通过文件的索引较少，与 `Hive` 相比，作为外部表的访问性能要高得多。

`Iceberg` 的分割和定义良好的结构也使得对数据源的并发访问和版本管理更加安全、节省和方便。

![Apache Iceberg 的堆栈](https://iceberg.apache.org/assets/images/iceberg-metadata.png)

支持 Iceberg 将使 databend 成为一个开放的数据湖，赋予它更多的 OLAP 能力。

## 指南级解释

### 创建 Iceberg 目录

要使用 Iceberg 目录，用户需要建立一个具有必要权限的 iceberg 存储。然后他们可以在其上创建一个 `目录`。

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

在普通表和 Iceberg 表上进行联合查询：

```sql
SELECT normal_tbl.book_name,
       my_iceberg.iceberg_db.iceberg_tbl.author
FROM normal_tbl,
     iceberg_tbl
WHERE normal_tbl.isbn = my_iceberg.iceberg_db.iceberg_tbl.isbn
  AND iceberg_tbl.sales > 100000;
```

在操作表时，所有数据仍然保留在用户提供的端点上。

### 时间旅行

Iceberg 提供了一系列快照及其时间戳。在其上进行时间旅行是自然的。

```sql
SELECT ...
FROM <iceberg_catalog>.<database_name>.<table_name>
AT ( { SNAPSHOT => <snapshot_id> | TIMESTAMP => <timestamp> } );
```

#### 访问快照元数据

用户应该能够在目录中查找快照 id 列表：

```sql
SELECT snapshot_id FROM ICEBERG_SNAPSHOT(my_iceberg.iceberg_db.iceberg_tbl);
```

```
     snapshot_id
---------------------
 1234567890123456789
 1234567890123456790
(2 行)
```

外部表正在读取的当前快照 id 将始终是最新的。但用户可以使用 `时间旅行` 和 `AT`。

## 参考级解释

一个新的目录类型 `ICEBERG`，以及用于从 Iceberg 存储读取数据的表引擎。

### 表引擎

表引擎使用户能够从建立的 Apache Iceberg 端点读取数据。外部表的所有内容和元数据应保留在用户提供的 Iceberg 数据源中，以 Iceberg 的方式。

引擎将跟踪最后提交的快照，并应能够从以前的快照中读取。

### 外部位置

无论 Iceberg 位于何处，如 S3、GCS 或 OSS，如果 Databend 支持存储，则应该可以访问 Iceberg。用户需要告诉 databend Iceberg 存储在哪里以及 databend 应该如何访问存储。

### 类型约定

| Iceberg         | 注释                                                       | Databend                             |
| --------------- | ---------------------------------------------------------- | ------------------------------------ |
| `boolean`       | 真或假                                                     | `BOOLEAN`                            |
| `int`           | 32位有符号整数                                              | `INT32`                              |
| `long`          | 64位有符号整数                                              | `INT64`                              |
| `float`         | 32位IEEE 754浮点数                                          | `FLOAT`                              |
| `double`        | 64位IEEE 754浮点数                                          | `DOUBLE`                             |
| `decimal(P, S)` | 定点小数；精度P，小数位数S                                  | 不支持                               |
| `date`          | 不含时区或时间的日历日期                                    | `DATE`                               |
| `time`          | 不含日期、时区的时间戳                                      | `TIMESTAMP`，将日期转换为今天        |
| `timestamp`     | 不含时区的时间戳                                            | `TIMESTAMP`，将时区转换为GMT         |
| `timestamptz`   | 含时区的时间戳                                              | `TIMESTAMP`                          |
| `string`        | UTF-8字符串                                                 | `VARCHAR`                            |
| `uuid`          | 16字节固定字节数组，全球唯一标识符                          | `VARCHAR`                            |
| `fixed(L)`      | 长度为L的固定长度字节数组                                   | `VARCHAR`                            |
| `binary`        | 任意长度的字节数组                                          | `VARCHAR`                            |
| `struct`        | 类型值的元组                                                | `OBJECT`                             |
| `list`          | 某种元素类型的值的集合                                      | `ARRAY`                              |
| `map`           |                                                            | `OBJECT`                             |

## 缺点

无

## 理由及替代方案

### Iceberg外部表

从Iceberg存储创建外部表：

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

将引入一个新的表引擎`ICEBERG`，所有数据仍将保留在Iceberg存储中。外部表还应支持用户查询其快照数据和时间旅行。

```sql
SELECT snapshot_id FROM ICEBERG_SNAPSHOT('<db_name>', '<external_table_name');
```

```
 snapshot_id
--------------
73556087355608
```

经讨论，上述目录方式被选中，因为它对Iceberg特性的支持更加完整，且更符合Hive目录的当前设计。

## 先行技术

无

## 未解决的问题

无

## 未来可能性

### 从Iceberg快照创建表

Iceberg提供快照功能，可以从中创建表。

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

### 架构演进

外部表中默认使用的Iceberg快照应始终是最新提交的那一个：

```sql
SELECT snapshot_id from ICEBERG_SNAPSHOT(iceberg_catalog.iceberg_db.iceberg_tbl);
```

```
  snapshot_id
---------------
 0000000000001
```

支持模式演化使得databend能够修改Iceberg的内容。
例如，向Iceberg表中插入一条新记录：

```sql
INSERT INTO iceberg_catalog.iceberg_db.iceberg_tbl VALUES ('datafuselabs', 'How To Be a Healthy DBA', '2022-10-14');
```

这将在Iceberg存储中创建一个新的快照：

```sql
SELECT snapshot_id from ICEBERG_SNAPSHOT(iceberg_catalog.iceberg_db.iceberg_tbl);
```

```
  snapshot_id
---------------
 0000000000001
 0000000000002
```