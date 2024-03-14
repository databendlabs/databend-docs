---
title: Delta Lake
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.262"/>

Databend的[Delta Lake](https://delta.io/)引擎允许您无缝查询和分析存储在对象存储中的Delta Lake表中的数据。当您在Databend中使用Delta Lake引擎创建表时，您需要指定一个位置，该位置存储了Delta Lake表的数据文件。这种设置允许您直接访问表并从Databend内部无缝执行查询。

- Databend的Delta Lake引擎目前支持只读操作。这意味着支持从您的Delta Lake表中查询数据，而不支持向表中写入数据。
- 使用Delta Lake引擎创建的表的模式在创建时设置。任何对原始Delta Lake表模式的修改都需要在Databend中重新创建相应的表，以确保同步。
- Databend中的Delta Lake引擎是基于官方的[delta-rs](https://github.com/delta-io/delta-rs)库构建的。重要的是要注意，delta-protocol中定义的某些功能，包括删除向量、变更数据源、生成的列和身份列，目前不被这个引擎支持。

## 语法

```sql
CREATE TABLE <table_name> 
ENGINE = Delta 
LOCATION = 's3://<path_to_table>' 
CONNECTION_NAME = '<connection_name>'
```

在使用Delta Lake引擎创建表之前，您需要创建一个连接对象，用于与您的S3存储建立连接。要在Databend中创建连接，请使用[CREATE CONNECTION](/sql/sql-reference/connect-parameters)命令。

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