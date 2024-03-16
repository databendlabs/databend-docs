---
title: Delta Lake
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.262"/>

Databend 的[Delta Lake](https://delta.io/)引擎允许您无缝查询和分析存储在对象存储中的 Delta Lake 表中的数据。当您在 Databend 中使用 Delta Lake 引擎创建表时，您需要指定一个位置，该位置存储了 Delta Lake 表的数据文件。这种设置允许您直接访问表并从 Databend 内部无缝执行查询。

- Databend 的 Delta Lake 引擎目前支持只读操作。这意味着支持从您的 Delta Lake 表中查询数据，而不支持向表中写入数据。
- 使用 Delta Lake 引擎创建的表的模式在创建时设置。任何对原始 Delta Lake 表模式的修改都需要在 Databend 中重新创建相应的表，以确保同步。
- Databend 中的 Delta Lake 引擎是基于官方的 [delta-rs](https://github.com/delta-io/delta-rs) 库构建的。另请注意，delta-protocol 中定义的某些功能目前尚未在该引擎中得到支持，包括删除向量、变更数据源、生成列和身份列。

## 语法

```sql
CREATE TABLE <table_name>
ENGINE = Delta
LOCATION = 's3://<path_to_table>'
CONNECTION_NAME = '<connection_name>'
```

在使用 Delta Lake 引擎创建表之前，您需要创建一个连接对象，用于与您的 S3 存储建立连接。要在 Databend 中创建连接，请使用 [CREATE CONNECTION](/sql/sql-reference/connect-parameters) 命令。

## 示例

```sql
--设置连接
CREATE CONNECTION my_s3_conn
STORAGE_TYPE = 's3'
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- 使用Delta Lake引擎创建表
CREATE TABLE test_delta
ENGINE = Delta
LOCATION = 's3://testbucket/admin/data/delta/delta-table/'
CONNECTION_NAME = 'my_s3_conn';
```
