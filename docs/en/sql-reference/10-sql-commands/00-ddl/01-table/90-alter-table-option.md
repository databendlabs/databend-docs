---
title: ALTER TABLE OPTION
sidebar_position: 5
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.25"/>

Modifies the options of a table created with the [Fuse Engine](../../../00-sql-reference/30-table-engines/00-fuse.md). For available options, see [Fuse Engine Options](../../../00-sql-reference/30-table-engines/00-fuse.md#fuse-engine-options).

## Syntax

```sql
ALTER TABLE [ <database_name>. ]<table_name> 
SET OPTIONS (<options>)
```

## Examples

This example demonstrates how to modify Fuse Engine options and verify changes with [SHOW CREATE TABLE](show-create-table.md):

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

-- Change the data retention period to 240 hours
ALTER TABLE fuse_table SET OPTIONS (data_retention_period_in_hours = 240);

-- Show the updated CREATE TABLE statement, reflecting the new option
SHOW CREATE TABLE fuse_table;

-[ RECORD 1 ]-----------------------------------
       Table: fuse_table
Create Table: CREATE TABLE fuse_table (
  a INT NULL
) ENGINE=FUSE COMPRESSION='lz4' DATA_RETENTION_PERIOD_IN_HOURS='240' STORAGE_FORMAT='native'
```