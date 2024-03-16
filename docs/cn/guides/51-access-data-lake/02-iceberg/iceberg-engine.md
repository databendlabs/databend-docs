---
title: Iceberg 表引擎
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.262"/>

Databend 的 [Apache Iceberg](https://iceberg.apache.org/) 引擎允许您无缝查询和分析存储在对象存储中的 Apache Iceberg 表中的数据。当您在 Databend 中使用 Apache Iceberg 引擎创建表时，您需要指定 Apache Iceberg 表的数据文件存储位置。这种设置允许您直接访问表并从 Databend 内部无缝进行查询。

- Databend 的 Apache Iceberg 引擎目前仅支持只读操作。这意味着支持从您的 Apache Iceberg 表中查询数据，而不支持向表中写入数据。
- 使用 Apache Iceberg 引擎创建的表的模式在创建时设置。对原始 Apache Iceberg 表的模式进行任何修改都需要在 Databend 中重新创建相应的表，以确保同步。

## 数据类型映射

此表将 Apache Iceberg 与 Databend 之间的数据类型进行了映射。请注意，Databend 目前不支持表中未列出的 Iceberg 数据类型。

| Apache Iceberg                              | Databend                                                                                 |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| BOOLEAN                                     | [BOOLEAN](/sql/sql-reference/data-types/data-type-logical-types)                         |
| INT                                         | [INT32](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)        |
| LONG                                        | [INT64](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)        |
| DATE                                        | [DATE](/sql/sql-reference/data-types/data-type-time-date-types)                          |
| TIMESTAMP/TIMESTAMPZ                        | [TIMESTAMP](/sql/sql-reference/data-types/data-type-time-date-types)                     |
| FLOAT                                       | [FLOAT](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-types) |
| DOUBLE                                      | [DOUBLE](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-type) |
| STRING/BINARY                               | [STRING](/sql/sql-reference/data-types/data-type-string-types)                           |
| DECIMAL                                     | [DECIMAL](/sql/sql-reference/data-types/data-type-decimal-types)                         |
| ARRAY&lt;TYPE&gt;                           | [ARRAY](/sql/sql-reference/data-types/data-type-array-types), 支持嵌套                   |
| MAP&lt;KEYTYPE, VALUETYPE&gt;               | [MAP](/sql/sql-reference/data-types/data-type-map)                                       |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/data-type-tuple-types)                             |
| LIST                                        | [ARRAY](/sql/sql-reference/data-types/data-type-array-types)                             |

## 语法

```sql
CREATE TABLE <table_name>
ENGINE = Iceberg
LOCATION = 's3://<path_to_table>'
CONNECTION_NAME = '<connection_name>'
```

在使用 Apache Iceberg 引擎创建表之前，您需要创建一个连接对象，用于与您的 S3 存储建立连接。要在 Databend 中创建连接，请使用 [CREATE CONNECTION](/sql/sql-reference/connect-parameters) 命令。

## 示例

```sql
--设置连接
CREATE CONNECTION my_s3_conn
STORAGE_TYPE = 's3'
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- 使用 Apache Iceberg 引擎创建表
CREATE TABLE test_iceberg
ENGINE = Iceberg
LOCATION = 's3://testbucket/iceberg_ctl/iceberg_db/iceberg_tbl/'
CONNECTION_NAME = 'my_s3_conn';
```
