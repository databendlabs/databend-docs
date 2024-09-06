---
title: SHOW DROP TABLES
sidebar_position: 11
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.203"/>

列出当前或指定数据库中已删除的表。

## 语法

```sql
SHOW DROP TABLES [ FROM <database_name> ] [ LIKE '<pattern>' | WHERE <expr> ]
```

## 示例

```sql
USE database1;

-- 列出当前数据库中已删除的表
SHOW DROP TABLES;

-- 列出 "default" 数据库中已删除的表
SHOW DROP TABLES FROM default;

Name                |Value                        |
--------------------+-----------------------------+
tables              |t1                           |
table_type          |BASE TABLE                   |
database            |default                      |
catalog             |default                      |
engine              |FUSE                         |
create_time         |2023-06-13 08:43:36.556 +0000|
drop_time           |2023-07-19 04:39:18.536 +0000|
num_rows            |2                            |
data_size           |34                           |
data_compressed_size|330                          |
index_size          |464                          |
```