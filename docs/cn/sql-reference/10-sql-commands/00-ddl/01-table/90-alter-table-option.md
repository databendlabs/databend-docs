---
title: ALTER TABLE OPTION
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.2.25"/>

修改使用默认[Fuse 引擎](../../../00-sql-reference/30-table-engines/00-fuse.md)创建的表的选项。要修改的可用选项，请参见[选项](../../../00-sql-reference/30-table-engines/00-fuse.md#options)。

## 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> SET OPTIONS (options)
```

## 示例

```sql
create table t(a int, b int);

alter table t set options(bloom_index_columns='a');

set hide_options_in_show_create_table=0;

show create table t;
+-------+-------------------------------------------------------------------------+
| Table | Create Table                                                            |
+-------+-------------------------------------------------------------------------+
| t     | CREATE TABLE `t` (
  `a` INT,
  `b` INT
) ENGINE=FUSE BLOOM_INDEX_COLUMNS='a' COMPRESSION='zstd' STORAGE_FORMAT='parquet' |
+-------+-------------------------------------------------------------------------+

-- 禁用所有布隆过滤器索引。
alter table t set options(bloom_index_columns='');

show create table t;
+-------+-------------------------------------------------------------------------+
| Table | Create Table                                                            |
+-------+-------------------------------------------------------------------------+
| t     | CREATE TABLE `t` (
  `a` INT,
  `b` INT
) ENGINE=FUSE BLOOM_INDEX_COLUMNS='' COMPRESSION='zstd' STORAGE_FORMAT='parquet'  |
+-------+-------------------------------------------------------------------------+
```