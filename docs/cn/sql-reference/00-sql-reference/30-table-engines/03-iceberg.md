---
title: Apache Iceberg 引擎
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.262"/>

Databend 的 Apache Iceberg 引擎允许您无缝查询和分析存储在对象存储中的 Apache Iceberg 表中的数据。当您在 Databend 中使用 Apache Iceberg 引擎创建表时，您需要指定一个位置，该位置存储了 Apache Iceberg 表的数据文件。这种设置允许您直接访问表并从 Databend 内部无缝执行查询。

- Databend 的 Apache Iceberg 引擎目前仅支持只读操作。这意味着支持从您的 Apache Iceberg 表中查询数据，而不支持向表中写入数据。
- 使用 Apache Iceberg 引擎创建的表的模式在创建时设置。对原始 Apache Iceberg 表的模式进行任何修改都需要在 Databend 中重新创建相应的表，以确保同步。

## 语法

```sql
CREATE TABLE <table_name> 
ENGINE = Iceberg 
LOCATION = 's3://<path_to_table>' 
CONNECTION_NAME = '<connection_name>'
```

在使用 Apache Iceberg 引擎创建表之前，您需要创建一个连接对象，用于与您的 S3 存储建立连接。要在 Databend 中创建连接，请使用 [CREATE CONNECTION](../../10-sql-commands/00-ddl/13-connection/create-connection.md) 命令。

## 示例

```sql
--设置连接
CREATE CONNECTION my_s3_conn 
STORAGE_TYPE = 's3' 
ACCESS_KEY_ID ='minioadmin' SECRET_ACCESS_KEY ='minioadmin' 
ENDPOINT_URL='http://127.0.0.1:9900';

-- 使用 Apache Iceberg 引擎创建表
CREATE TABLE test_iceberg
ENGINE = Iceberg 
LOCATION = 's3://testbucket/iceberg_ctl/iceberg_db/iceberg_tbl/' 
CONNECTION_NAME = 'my_s3_conn';
```