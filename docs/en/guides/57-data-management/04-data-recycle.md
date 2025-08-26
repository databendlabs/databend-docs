---
title: Data Purge and Recycle
sidebar_label: Data Recycle
---

## Overview

In Databend, data is not immediately deleted when you run `DROP`, `TRUNCATE`, or `DELETE` commands. This enables Databend's time travel feature, allowing you to access previous states of your data. However, this approach means that storage space is not automatically freed up after these operations.

```
Before DELETE:                After DELETE:                 After VACUUM:
+----------------+           +----------------+           +----------------+
| Current Data   |           | New Version    |           | Current Data   |
|                |           | (After DELETE) |           | (After DELETE) |
+----------------+           +----------------+           +----------------+
| Historical Data|           | Historical Data|           |                |
| (Time Travel)  |           | (Original Data)|           |                |
+----------------+           +----------------+           +----------------+
                             Storage not freed            Storage freed
```

## VACUUM Commands and Cleanup Scope

Databend provides three VACUUM commands to clean different types of data. **Understanding what each command cleans is crucial** - some commands only clean storage data, while others clean both storage and metadata.

| Command | Target Data | S3 Storage | Meta Service | Details |
|---------|-------------|------------|--------------|---------|
| **VACUUM DROP TABLE** | Dropped tables after `DROP TABLE` | ✅ **Removes**: All data files, segments, blocks, indexes, statistics | ✅ **Removes**: Table schema, permissions, metadata records | **Complete purge** - table cannot be recovered |
| **VACUUM TABLE** | Table history & orphan files | ✅ **Removes**: Historical snapshots, orphan segments/blocks, old indexes/stats | ❌ **Preserves**: Table structure and current metadata | **Storage-only** - table remains active |
| **VACUUM TEMPORARY FILES** | Spill files from queries (joins, aggregates, sorts) | ✅ **Removes**: Temporary spill files from crashed/interrupted queries | ❌ **No metadata**: Temp files have no associated metadata | **Storage-only** - rarely needed, auto-cleaned normally |

> **Critical**: Only `VACUUM DROP TABLE` removes metadata from the meta service. The other commands only clean storage files.

## Using VACUUM Commands

The VACUUM command family is the primary method for cleaning data in Databend ([Enterprise Edition Feature](/guides/products/dee/enterprise-features)).

### VACUUM DROP TABLE

Permanently removes dropped tables from both storage and metadata.

```sql
VACUUM DROP TABLE [FROM <database_name>] [DRY RUN [SUMMARY]] [LIMIT <file_count>];
```

**Options:**
- `FROM <database_name>`: Restrict to a specific database
- `DRY RUN [SUMMARY]`: Preview files to be removed without actually deleting them
- `LIMIT <file_count>`: Limit the number of files to be vacuumed

**Examples:**

```sql
-- Preview files that would be removed
VACUUM DROP TABLE DRY RUN;

-- Preview summary of files that would be removed
VACUUM DROP TABLE DRY RUN SUMMARY;

-- Remove dropped tables from the "default" database
VACUUM DROP TABLE FROM default;

-- Remove up to 1000 files from dropped tables
VACUUM DROP TABLE LIMIT 1000;
```

### VACUUM TABLE

Removes historical data and orphan files for active tables (storage-only cleanup).

```sql
VACUUM TABLE <table_name> [DRY RUN [SUMMARY]];
```

**Options:**
- `DRY RUN [SUMMARY]`: Preview files to be removed without actually deleting them

**Examples:**

```sql
-- Preview files that would be removed
VACUUM TABLE my_table DRY RUN;

-- Preview summary of files that would be removed
VACUUM TABLE my_table DRY RUN SUMMARY;

-- Remove historical data from my_table
VACUUM TABLE my_table;
```

### VACUUM TEMPORARY FILES

Removes temporary spill files created during query execution.

```sql
VACUUM TEMPORARY FILES;
```

> **Note**: Rarely needed during normal operation since Databend automatically handles cleanup. Manual cleanup is typically only required when Databend crashes during query execution.

## Adjusting Data Retention Time

The VACUUM commands remove data files older than the `DATA_RETENTION_TIME_IN_DAYS` setting. By default, Databend retains historical data for 1 day (24 hours). You can adjust this setting:

```sql
-- Change retention period to 2 days
SET GLOBAL DATA_RETENTION_TIME_IN_DAYS = 2;

-- Check current retention setting
SHOW SETTINGS LIKE 'DATA_RETENTION_TIME_IN_DAYS';
```

| Edition                                  | Default Retention | Maximum Retention |
| ---------------------------------------- | ----------------- | ---------------- |
| Databend Community & Enterprise Editions | 1 day (24 hours)  | 90 days          |
| Databend Cloud (Personal)                | 1 day (24 hours)  | 1 day (24 hours) |
| Databend Cloud (Business)                | 1 day (24 hours)  | 90 days          |
