---
id: delta
title: Delta Lake 引擎
sidebar_label: Delta Lake 引擎
slug: /sql-reference/table-engines/delta
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

Databend 的 [Delta Lake](https://delta.io/) 引擎允许你无缝查询和分析存储在对象存储中的 Delta Lake 表数据。在 Databend 中使用 Delta Lake 引擎创建表时，你需要指定 Delta Lake 表数据文件的存储位置。这样即可直接访问该表，并在 Databend 内无缝执行查询。

- Databend 的 Delta Lake 引擎目前仅支持只读操作，即可以查询 Delta Lake 表中的数据，但无法写入。
- 使用 Delta Lake 引擎创建的表，其 Schema（模式）在创建时即已固定。若原始 Delta Lake 表的 Schema 发生变更，需在 Databend 中重新创建对应表以保持同步。
- Databend 中的 Delta Lake 引擎基于官方 [delta-rs](https://github.com/delta-io/delta-rs) 库构建。请注意，delta-protocol 定义的某些特性（如 Deletion Vector、Change Data Feed、Generated Columns 和 Identity Columns）目前尚不受支持。

## 语法

```sql
CREATE TABLE <table_name> 
ENGINE = Delta 
LOCATION = 's3://<path_to_table>' 
CONNECTION_NAME = '<connection_name>'
```

在使用 Delta Lake 引擎创建表之前，需先创建用于连接 S3 存储的连接对象。在 Databend 中，请使用 [CREATE CONNECTION](/sql/sql-reference/connect-parameters) 命令创建连接。

## 示例

```sql
-- 建立连接
CREATE CONNECTION my_s3_conn 
STORAGE_TYPE = 's3' 
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- 使用 Delta Lake 引擎创建表
CREATE TABLE test_delta 
ENGINE = Delta 
LOCATION = 's3://testbucket/admin/data/delta/delta-table/' 
CONNECTION_NAME = 'my_s3_conn';
```