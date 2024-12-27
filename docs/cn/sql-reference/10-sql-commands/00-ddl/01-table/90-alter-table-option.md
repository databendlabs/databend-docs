---
title: ALTER TABLE OPTIONS
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.643"/>

为表设置或取消设置 [Fuse Engine 选项](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options)。

## 语法

```sql
-- 设置 Fuse Engine 选项
ALTER TABLE [ <database_name>. ]<table_name> SET OPTIONS (<options>)

-- 取消设置 Fuse Engine 选项，恢复为默认值
ALTER TABLE [ <database_name>. ]<table_name> UNSET OPTIONS (<options>)
```

请注意，只有以下 Fuse Engine 选项可以被取消设置：

- `block_per_segment`
- `block_size_threshold`
- `data_retention_period_in_hours`
- `row_avg_depth_threshold`
- `row_per_block`
- `row_per_page`

## 示例

以下示例展示了如何设置 Fuse Engine 选项，并通过 [SHOW CREATE TABLE](show-create-table.md) 验证更改：

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

-- 将每个段的最大块数更改为 500
-- 将数据保留期更改为 240 小时
ALTER TABLE fuse_table SET OPTIONS (block_per_segment = 500, data_retention_period_in_hours = 240);

-- 显示更新后的 CREATE TABLE 语句，反映新的选项
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE BLOCK_PER_SEGMENT='500' COMPRESSION='lz4' DATA_RETENTION_PERIOD_IN_HOURS='240' STORAGE_FORMAT='native'
```

以下示例展示了如何取消设置 Fuse Engine 选项，恢复为默认值：

```sql
ALTER TABLE fuse_table UNSET OPTIONS (block_per_segment, data_retention_period_in_hours);

SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' STORAGE_FORMAT='native'
```