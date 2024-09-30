---
title: Delta Lake
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.262"/>

Databend 的 [Delta Lake](https://delta.io/) 引擎允许您无缝查询和分析存储在对象存储中的 Delta Lake 表中的数据。当您在 Databend 中使用 Delta Lake 引擎创建表时，您需要指定一个位置，该位置存储 Delta Lake 表的数据文件。这种设置允许您直接访问表并在 Databend 中无缝执行查询。

- Databend 的 Delta Lake 引擎目前仅支持只读操作。这意味着支持从您的 Delta Lake 表中查询数据，但不支持写入表。
- 使用 Delta Lake 引擎创建的表的架构在创建时设置。对原始 Delta Lake 表架构的任何修改都需要在 Databend 中重新创建相应的表以确保同步。
- Databend 中的 Delta Lake 引擎基于官方的 [delta-rs](https://github.com/delta-io/delta-rs) 库构建。需要注意的是，delta-protocol 中定义的某些功能，包括 Deletion Vector、Change Data Feed、Generated Columns 和 Identity Columns，目前不支持此引擎。

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
-- 设置连接
CREATE CONNECTION my_s3_conn 
STORAGE_TYPE = 's3' 
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- 使用 Delta Lake 引擎创建表
CREATE TABLE test_delta 
ENGINE = Delta 
LOCATION = 's3://testbucket/admin/data/delta/delta-table/' 
CONNECTION_NAME = 'my_s3_conn';
```