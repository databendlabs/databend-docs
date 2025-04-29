---
title: ALTER TABLE OPTIONS
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.733"/>

Sets or unsets [Fuse Engine options](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options) for a table. 

## Syntax

```sql
-- Set Fuse Engine options
ALTER TABLE [ <database_name>. ]<table_name> SET OPTIONS (<options>)

-- Unset Fuse Engine options, reverting them to their default values
ALTER TABLE [ <database_name>. ]<table_name> UNSET OPTIONS (<options>)
```

Please note that only the following Fuse Engine options can be unset:

- `block_per_segment`
- `block_size_threshold`
- `data_retention_period_in_hours`
- `data_retention_num_snapshots_to_keep`
- `row_avg_depth_threshold`
- `row_per_block`
- `row_per_page`

## Examples

### Setting Fuse Engine Options

The following demonstrates how to set Fuse Engine options and verify changes with [SHOW CREATE TABLE](show-create-table.md):

```sql
CREATE TABLE fuse_table (a int);

SET hide_options_in_show_create_table=0;

-- Show the current CREATE TABLE statement, including the Fuse Engine options
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' STORAGE_FORMAT='native'

-- Change maximum blocks in a segment to 500
-- Change the data retention period to 240 hours
ALTER TABLE fuse_table SET OPTIONS (block_per_segment = 500, data_retention_period_in_hours = 240);

-- Show the updated CREATE TABLE statement, reflecting the new options
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE BLOCK_PER_SEGMENT='500' COMPRESSION='lz4' DATA_RETENTION_PERIOD_IN_HOURS='240' STORAGE_FORMAT='native'
```

The following demonstrates how to use the `data_retention_num_snapshots_to_keep` option with `enable_auto_vacuum`:

```sql
-- Create a new table
CREATE OR REPLACE TABLE t(c INT);

-- Set the table to retain only the most recent snapshot
ALTER TABLE t SET OPTIONS(data_retention_num_snapshots_to_keep = 1);

-- Enable automatic vacuum to trigger snapshot cleanup
SET enable_auto_vacuum = 1;

-- After each of these operations, only one snapshot will be kept
INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
INSERT INTO t VALUES(3);
```

### Unsetting Fuse Engine Options

The following demonstrates how to unset Fuse Engine options, reverting them to their default values:

```sql
ALTER TABLE fuse_table UNSET OPTIONS (block_per_segment, data_retention_period_in_hours);

SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' STORAGE_FORMAT='native'