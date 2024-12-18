---
title: Iceberg 表引擎
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.262"/>

Databend 的 [Apache Iceberg](https://iceberg.apache.org/) 引擎允许您无缝查询和分析存储在对象存储中的 Apache Iceberg 表中的数据。当您在 Databend 中使用 Apache Iceberg 引擎创建表时，您需要指定一个位置，该位置存储了 Apache Iceberg 表的数据文件。此设置使您可以直接访问该表，并从 Databend 内部无缝执行查询。

- Databend 的 Apache Iceberg 引擎目前仅支持只读操作。这意味着可以从您的 Apache Iceberg 表中查询数据，但不支持向表中写入数据。
- 使用 Apache Iceberg 引擎创建的表的 schema 在其创建时设置。对原始 Apache Iceberg 表的 schema 的任何修改都需要在 Databend 中重新创建相应的表，以确保同步。

## 数据类型映射

此表映射了 Apache Iceberg 和 Databend 之间的数据类型。请注意，Databend 目前不支持未列在表中的 Iceberg 数据类型。

| Apache Iceberg                  | Databend                |
| ------------------------------- | ----------------------- |
| BOOLEAN                         | [BOOLEAN](/sql/sql-reference/data-types/boolean)                 |
| INT                             | [INT32](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| LONG                            | [INT64](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| DATE                            | [DATE](/sql/sql-reference/data-types/datetime)                    |
| TIMESTAMP/TIMESTAMPZ            | [TIMESTAMP](/sql/sql-reference/data-types/datetime)               |
| FLOAT                           | [FLOAT](/sql/sql-reference/data-types/numeric#floating-point-data-types)                  |
| DOUBLE                          | [DOUBLE](/sql/sql-reference/data-types/numeric#floating-point-data-type)                  |
| STRING/BINARY                   | [STRING](/sql/sql-reference/data-types/string)                  |
| DECIMAL                         | [DECIMAL](/sql/sql-reference/data-types/decimal)                 |
| ARRAY&lt;TYPE&gt;               | [ARRAY](/sql/sql-reference/data-types/array), 支持嵌套 |
| MAP&lt;KEYTYPE, VALUETYPE&gt;       | [MAP](/sql/sql-reference/data-types/map)                     |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)           |
| LIST                            | [ARRAY](/sql/sql-reference/data-types/array)                   |

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
-- 设置连接
CREATE CONNECTION my_s3_conn 
STORAGE_TYPE = 's3' 
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- 使用 Apache Iceberg 引擎创建表
CREATE TABLE test_iceberg
ENGINE = Iceberg 
LOCATION = 's3://testbucket/iceberg_ctl/iceberg_db/iceberg_tbl/' 
CONNECTION_NAME = 'my_s3_conn';
```