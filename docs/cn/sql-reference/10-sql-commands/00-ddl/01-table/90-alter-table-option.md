---
title: ALTER TABLE OPTIONS
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.733"/>

为表设置或取消设置 [Fuse Engine 选项](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options)。

## 语法

```sql
-- 设置 Fuse Engine 选项
ALTER TABLE [ <database_name>. ]<table_name> SET OPTIONS (<options>)

-- 取消设置 Fuse Engine 选项，将其恢复为默认值
ALTER TABLE [ <database_name>. ]<table_name> UNSET OPTIONS (<options>)
```

请注意，只能取消设置以下 Fuse Engine 选项：

- `block_per_segment`
- `block_size_threshold`
- `data_retention_period_in_hours`
- `data_retention_num_snapshots_to_keep`
- `row_avg_depth_threshold`
- `row_per_block`
- `row_per_page`

## 示例

### 设置 Fuse Engine 选项

以下示例演示如何设置 Fuse Engine 选项，并通过 [SHOW CREATE TABLE](show-create-table.md) 验证更改：

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

-- 将段中的最大块数更改为 500
-- 将数据保留期限更改为 240 小时
ALTER TABLE fuse_table SET OPTIONS (block_per_segment = 500, data_retention_period_in_hours = 240);

-- 显示更新后的 CREATE TABLE 语句，反映新的选项
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE BLOCK_PER_SEGMENT='500' COMPRESSION='lz4' DATA_RETENTION_PERIOD_IN_HOURS='240' STORAGE_FORMAT='native'
```

以下示例演示如何将 `data_retention_num_snapshots_to_keep` 选项与 `enable_auto_vacuum` 一起使用：

```sql
-- 创建一个新表
CREATE OR REPLACE TABLE t(c INT);

-- 设置该表仅保留最新的快照
ALTER TABLE t SET OPTIONS(data_retention_num_snapshots_to_keep = 1);

-- 启用自动清理以触发快照清理
SET enable_auto_vacuum = 1;

-- 在每次操作之后，只会保留一个快照
INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
INSERT INTO t VALUES(3);
```

### 取消设置 Fuse Engine 选项

以下示例演示如何取消设置 Fuse Engine 选项，将其恢复为默认值：

```sql
ALTER TABLE fuse_table UNSET OPTIONS (block_per_segment, data_retention_period_in_hours);

SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' STORAGE_FORMAT='native'