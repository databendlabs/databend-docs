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

## Types of Data to Clean

Databend provides specific commands to clean different types of data. The following table summarizes the data types and their corresponding cleanup commands:

| Data Type | Description | Cleanup Command |
|-----------|-------------|-----------------|
| **Dropped Table Data** | Data files from tables that have been dropped using the DROP TABLE command | `VACUUM DROP TABLE` |
| **Table History Data** | Historical versions of tables, including snapshots created through UPDATE, DELETE, and other operations | `VACUUM TABLE` |
| **Orphan Files** | Snapshots, segments, and blocks that are no longer associated with any table | `VACUUM TABLE` |
| **Spill Temporary Files** | Temporary files created when memory usage exceeds available limits during query execution (for joins, aggregates, sorts, etc.) | `VACUUM TEMPORARY FILES` |

> **Note**: Spill temporary files are typically cleaned automatically by Databend. Manual cleanup is only needed when Databend crashes or shuts down unexpectedly during query execution.


## Using VACUUM Commands

The VACUUM command family is the primary method for cleaning data in Databend ([Enterprise Edition Feature](/guides/products/dee/enterprise-features)). Different VACUUM subcommands are used depending on the type of data you need to clean.

```
VACUUM Commands:
+------------------------+    +------------------------+    +------------------------+
| VACUUM DROP TABLE      |    | VACUUM TABLE          |    | VACUUM TEMPORARY FILES |
+------------------------+    +------------------------+    +------------------------+
| Cleans dropped tables  |    | Cleans table history  |    | Cleans spill files     |
| and their data files   |    | and orphan files      |    | (rarely needed)        |
+------------------------+    +------------------------+    +------------------------+
```

### VACUUM DROP TABLE

This command permanently deletes data files of dropped tables, freeing up storage space.

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

This command removes historical data for a specified table, clearing old versions and freeing storage.

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

This command clears temporary spilled files used for joins, aggregates, and sorts, freeing up storage space.

```sql
VACUUM TEMPORARY FILES;
```

**Note:** While this command is provided as a manual method for cleaning up temporary files, it's rarely needed during normal operation since Databend automatically handles cleanup in most cases.

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
