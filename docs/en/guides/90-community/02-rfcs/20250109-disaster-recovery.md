---
title: Disaster Recovery
description: Enable Databend to recover from disasters involving the loss of either metadata or data.
---

- RFC PR: [datafuselabs/databend#0000](https://github.com/databendlabs/databend/pull/0000)
- Tracking Issue: [datafuselabs/databend#0000](https://github.com/databendlabs/databend/issues/0000)

## Summary

Enable databend to recover from disasters involving the loss of either metadata or data.

## Motivation

Databend is designed to be highly available and fault-tolerant. Its metadata is served by Databend MetaSrv, which is powered by [OpenRaft](https://github.com/databendlabs/openraft). The data is stored in object storage systems such as S3, GCS, and others, which guarantee 99.99% availability and 99.999999999% durability.

However, it is insufficient for our enterprise users who require a robust disaster recovery plan. These users either have significant needs for cross-continent disaster recovery or must comply with stringent regulatory requirements.

For example, [The Health Insurance Portability and Accountability Act (HIPAA)](https://www.hhs.gov/hipaa/index.html) mandates that healthcare organizations develop and implement contingency plans. Such planning ensures that, in the event of a natural or man-made disaster disrupting operations, the business can continue functioning until regular services are restored.

This RFC proposes a solution to enable Databend to recover from disasters involving the loss of metadata or data.

## Guide-level explanation

This RFC is the first step in enabling Databend to recover from disasters involving the loss of metadata or data. We will support `BACKUP` and `RESTORE` commands to back up and restore both metadata and data at the same time.

`BACKUP` and `RESTORE` table:

```sql
BACKUP TABLE [ <database_name>. ]<table_name> 
	INTO { internalStage | externalStage | externalLocation };

RESOTRE TABLE
	FROM { internalStage | externalStage | externalLocation };
```

`BACKUP` and `RESTORE` database:

```sql
BACKUP DATABASE <database_name>
	INTO { internalStage | externalStage | externalLocation };
	
RESOTRE DATABASE
	FROM { internalStage | externalStage | externalLocation };
```

For example, users can backup the `test` table to an external stage:

```sql
BACKUP TABLE test INTO @backup_stage/table/test/2025_01_09_08_00_00/;
```

`BACKUP` supports both full and incremental backups. The full backup will back up all metadata and data, while the incremental backup will only back up the changes since the last full or incremental backup.

`BACKUP` will perform incremental backups by default. Users can specify the `FULL` keyword to perform a full backup:

```sql
BACKUP TABLE test INTO @backup_stage/table/test/2025_01_09_08_00_00/ FULL;
```

The backup will store all relevant metadata and data in the backup storage, ensuring that users can restore it even if the entire databend cluster is lost.

Users can restore the `test` table from the external stage in another databend cluster:

```sql
RESOTRE TABLE FROM @backup_stage/table/test/2025_01_09_08_00_00/;
```

`RESTORE` also supports `DRY RUN` to preview the restore operation without actually restoring the metadata and data.

```sql
RESOTRE TABLE FROM @backup_stage/table/test/2025_01_09_08_00_00/ DRY RUN;
```

Users can use `DRY RUN` to check and validate the backup without affecting the existing metadata and data.

### Maintenance

Databend will provide a set of system functions to manage the backups:

```sql
-- scan backup manifest in given location
SELECT list_backups(
    -- full identifier of the database or table,
    'test',
    location => '@backup_stage/table/test/'
);

-- delete backup in given location
SELECT delete_backup(
    -- full identifier of the database or table,
    'test',
    -- the location to search the backups.
    location => '@backup_stage/table/test/2025_01_09_08_00_00/'
);

-- vacuum backup in given location to meet the retention policy.
SELECT vacuum_backup(
    -- full identifier of the database or table,
    'test',
    -- the location to search the backups.
    location => '@backup_stage/table/test',
    -- keep recent 30 days backups
    RETENTION_DAYS => 30,
    -- keep at least for 7 days.
    MIN_RETENTION_DAYS => 7,
    -- keep at most 5 full backups.
    MAX_FULL_BACKUPS = 5,
    -- keep at least 2 full backups.
    MIN_FULL_BACKUPS = 2,
    -- keep at most 10 incremental backups.
    MAX_INCREMENTAL_BACKUPS = 10,
);
```

Perhaps we could integrate them into the SQL commands, allowing us to use `VACUUM BACKUP` to clean up the backups. However, we need to take the complexity of the SQL commands into account. Let's start with SQL functions first.

### Use cases

The backup and restore functionality can be used for the following scenarios:

#### Disaster Recovery

Users can back up databases or tables to an external location or storage to safeguard against data loss caused by disasters. In case of a disaster, they can restore the metadata and data to a new databend cluster to resume operations.

#### Dangerous Operations

Users can back up databases or tables before performing dangerous operations such as `VACUUM TABLE` or `ALTER TABLE`. If the operation fails or causes data loss, they can restore the metadata and data from the backup to recover the lost data.

In this case, users can backup table into internal stage directly for quick backup and restore:

```sql
BACKUP TABLE test INTO '~/table/test/2025_01_09_08_00_00/';
```

## Reference-level explanation

Databend will introduce an `BackupManifest` in which stores the following things:

- metadata of given backup: like backup time, backup location, backup type (full or incremental), etc.
- the locations of metadata backup: the locations which points to the metadata backup.
- the locations of data backup: the locations which contains all table data.

```rust
struct BackupManifest {
    meta: BackupMeta,
    table_meta: BackupTableMeta,
    table_data: Vec<BackupTableData>,
    ...
}

struct BackupMeta {
    backup_time: DateTime<Utc>,
    backup_type: BackupType,
    ...
}

struct BackupTableMeta {
    location: String
    ...
}

struct BackupTableData {
    source_location: String,

    backup_location: String,
    etag: String,
}
```

The `BackupManifest` will be encoded by protobuf and stored inside backup storage along with the backup metadata and data.

During the backup process, Databend reads existing table snapshots to generate a `BackupManifest` file, dumps metadata from the metasrv, and copies all related data files to the backup storage.

During the restore process, Databend reads the `BackupManifest` file from the backup storage, copies all related data files to their original location, and restores the metadata to the metasrv.

To perform incremental backups, Databend checks the existing `BackupManifest` file and copies only the modified data files to the backup storage.

The protobuf definition of `BackupManifest` will be versioned to ensure both backward and forward compatibility. This will enable Databend Query to restore backups created using different versions of Databend.

## Drawbacks

None.

## Rationale and alternatives

### Why not backup and restore the metadata and data directly?

It's simple and feasible to back up and restore both metadata and data directly. For instance, users can export the metadata using our existing tool and then copy the entire bucket to another location to back up the data.

However, this approach has several drawbacks:

**It's manual and error-prone**

Both the backup and restore processes require manual operations and external tools, making them susceptible to errors. For instance, users might forget to back up the metadata or data, or they might accidentally overwrite the backup files.

During emergency recovery, users must manually restore the metadata and data from the backup under highly stressful conditions, increasing the likelihood of mistakes that could result in data loss or prolonged recovery times.

**It's transaction unaware**

The backup and restore processes are not transaction-aware, making it highly likely that metadata and data will become inconsistent if these processes are not properly coordinated. For example, metadata might be backed up before the corresponding data, resulting in discrepancies between the two.

Alternatively, we could implement a constraint preventing operations on the table during the backup of metadata and data, but this could impact system availability.

**It doesn't work in complex scenarios**

Databend offers excellent support for `stage`. It is common for users to store and access data from various cloud locations. Backing up data from different buckets or even across multiple storage vendors is highly challenging and adds significant complexity to the backup and restore process.

## Prior art

### Databricks Clone

Databricks allows users to perform shadow and deep cloning of a table.

For example:

Use clone for data archiving

```sql
CREATE OR REPLACE TABLE archive_table CLONE my_prod_table;
```

Or use clone for short-term experiments on a production table

```sql
-- Perform shallow clone
CREATE OR REPLACE TABLE my_test SHALLOW CLONE my_prod_table;

UPDATE my_test WHERE user_id is null SET invalid=true;
-- Run a bunch of validations. Once happy:

-- This should leverage the update information in the clone to prune to only
-- changed files in the clone if possible
MERGE INTO my_prod_table
USING my_test
ON my_test.user_id <=> my_prod_table.user_id
WHEN MATCHED AND my_test.user_id is null THEN UPDATE *;

DROP TABLE my_test;
```

## Unresolved questions

None.

## Future possibilities

### Task

After Databend adds native task support, users will be able to perform timely automatic backups for all existing tables as needed.

### Replication

In the future, we could extend the backup and restore functionality to support replication. This would allow users to replicate databases or tables across different databend clusters for disaster recovery or data distribution purposes.

Databend can also implement a warm standby to ensure high availability and fault tolerance.

### Iceberg

In the future, databend can support backup and restore an iceberg table.
