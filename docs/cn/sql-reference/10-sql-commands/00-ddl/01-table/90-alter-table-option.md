---
title: ALTER TABLE OPTION
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.25"/>

修改使用 [Fuse Engine](../../../00-sql-reference/30-table-engines/00-fuse.md) 创建的表的选项。有关可用选项，请参见 [Fuse Engine Options](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options)。

## 语法

```sql
ALTER TABLE [ <database_name>. ]<table_name> 
SET OPTIONS (<options>)
```

## 示例

此示例演示如何修改 Fuse Engine 选项并通过 [SHOW CREATE TABLE](show-create-table.md) 验证更改：

```sql
CREATE TABLE fuse_table (a int);

SET hide_options_in_show_create_table=0;

-- 显示当前的 CREATE TABLE 语句，包括 Fuse Engine 选项
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' STORAGE_FORMAT='native'

-- 将数据保留期更改为 240 小时
ALTER TABLE fuse_table SET OPTIONS (data_retention_period_in_hours = 240);

-- 显示更新后的 CREATE TABLE 语句，反映新的选项
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' DATA_RETENTION_PERIOD_IN_HOURS='240' STORAGE_FORMAT='native'
```