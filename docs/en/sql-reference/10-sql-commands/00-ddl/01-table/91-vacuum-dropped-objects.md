---
title: VACUUM DROPPED OBJECTS
sidebar_position: 18
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

<EEFeature featureName='VACUUM DROPPED OBJECTS'/>

Permanently removes eligible dropped objects and reclaims their storage and metadata. This includes dropped tables and, when scanning all databases, dropped databases. Dropped view metadata is also cleaned up. Objects that have been vacuumed cannot be recovered with UNDROP.

To list dropped tables in a database, use [SHOW DROP TABLES](show-drop-tables.md). To clean history from an active table, use [VACUUM TABLE](91-vacuum-table.md).

## Syntax

```sql
VACUUM DROPPED OBJECTS [FROM <database>]
```

| Parameter | Description |
|-----------|-------------|
| `FROM <database>` | Restricts cleanup to the specified database in the current catalog. If omitted, scans all databases in the current catalog, including dropped databases. |

With `FROM`, the command requires `SUPER` access to the database. Without `FROM`, it requires global `SUPER` privilege.

The command does not return a result set.

## Retention

Dropped objects become eligible for cleanup after the retention period configured by `data_retention_time_in_days` (1 day by default). Removing storage and metadata is permanent.

```sql
SET data_retention_time_in_days = 2;
SHOW SETTINGS LIKE 'data_retention_time_in_days';
```

## Metadata Compatibility

Cleanup distinguishes metadata that this version cannot read from metadata for a known retired engine:

| Condition | Cleanup behavior | Diagnostic location |
|-----------|------------------|---------------------|
| Table metadata cannot be decoded | Skip that table. Keep its metadata. When scanning all databases, keep a dropped database that contains skipped undecodable tables. | Meta server warning logs |
| Recognized retired read-only external engine, currently `DELTA` | Reclaim the dropped table's metadata without initializing the removed engine. Do not delete external data files. | Query server informational logs |
| Other unknown or uninitializable non-FUSE engine | Retain the table's metadata and its containing dropped database. Do not treat an arbitrary unknown engine as retired. | Query warnings and Query server logs |

Other eligible tables can still be cleaned. Other errors can still stop the command. Completion does not prove that every dropped object was reclaimed. Retention and other protection rules still apply.

Skipping metadata does not repair it. Check the indicated logs if objects remain after cleanup. Do not interpret a skipped table as permission to delete its metadata or data manually.

[VACUUM ALL](../../50-administration-cmds/09-vacuum-all.md) inherits these rules for its dropped-object cleanup step.

## Examples

Clean up eligible dropped objects from a specific database:

```sql
VACUUM DROPPED OBJECTS FROM default;
```

Clean up eligible dropped objects across all databases in the current catalog:

```sql
VACUUM DROPPED OBJECTS;
```
