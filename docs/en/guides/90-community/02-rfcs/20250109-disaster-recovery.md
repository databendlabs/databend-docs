---
title: Disaster Recovery
description: Enable Databend to recover from disasters involving the loss of either metadata or data.
---

- RFC PR: [databendlabs/databend-docs#1546](https://github.com/databendlabs/databend-docs/pull/1546)
- Tracking Issue: [datafuselabs/databend#17234](https://github.com/databendlabs/databend/issues/17234)

## Summary

Enable databend to recover from disasters involving the loss of either metadata or data.

## Motivation

Databend is designed to be highly available and fault-tolerant. Its metadata is served by Databend MetaSrv, which is powered by [OpenRaft](https://github.com/databendlabs/openraft). The data is stored in object storage systems such as S3, GCS, and others, which guarantee 99.99% availability and 99.999999999% durability.

However, it is insufficient for our enterprise users who require a robust disaster recovery plan. These users either have significant needs for cross-continent disaster recovery or must comply with stringent regulatory requirements.

For example, [The Health Insurance Portability and Accountability Act (HIPAA)](https://www.hhs.gov/hipaa/index.html) mandates that healthcare organizations develop and implement contingency plans. Such planning ensures that, in the event of a natural or man-made disaster disrupting operations, the business can continue functioning until regular services are restored.

This RFC proposes a solution to enable Databend to recover from disasters involving the loss of metadata or data.

## Guide-Level Explanation

This RFC introduces the first step toward enabling Databend to recover from disasters, such as metadata or data loss, by providing a robust backup and restore solution. Our proposed product, tentatively named `bendsave`, will allow users to back up and restore both metadata and data efficiently.

*The name of this product is not decided yet, let's call it `bendsave`*

### 1. Backup

Create backups of cluster data and metadata using the `bendsave backup` command. Incremental backups are supported, ensuring that only changes since the last backup are saved. This simplifies daily backups.

Example:

```shell
bendsave backup --from /path/to/query-node-1.toml --to s3://backup/
```

Key Points:
- Metadata and data are stored in the backup location.
- Enables complete cluster recovery, even in cases of total failure.

### 2. List Backups

To view all backups stored in a specified location, use the `bendsave list` command.

Example:

```shell
bendsave list s3://backup/
```

### 3. Restore

Restore a Databend cluster from a backup using the `bendsave restore` command. By default, this operates in dry-run mode to prevent accidental restoration. For automatic restoration, use the `--confirm` flag.

Example:

```shell
# Dry-run mode (default)
bendsave restore --from s3://backup/path/to/backup/manifest --to /path/to/query-node-1.toml

# Perform the restoration immediately
bendsave restore --from s3://backup/path/to/backup/manifest --to /path/to/query-node-1.toml --confirm
```

### 4. Vacuum

Manage backup retention using the `bendsave vacuum` command. This ensures backups adhere to your retention policies by removing old or unnecessary backups.

Example:

```shell
bendsave vacuum s3://backup \
    --retention-days 30     \
    --min-retention-days 7  \
    --max-backups 5         \
    --min-backups 2
```

The `bendsave` tool will provide a simple yet powerful way to secure Databend clusters through backup and restore operations. With features like incremental backups, dry-run restore mode, and vacuum-based retention management, it offers users control and reliability in disaster recovery scenarios.

## Reference-level explanation

`bendsave` will introduce an `BackupManifest` in which stores the following things:

- metadata of given backup: like backup time, backup location, backup type (full or incremental), etc.
- the locations of metadata backup: the locations which points to the metadata backup.
- the locations of data backup: the locations which contains all table data.

```rust
struct BackupManifest {
    backup_meta: BackupMeta,
    
    metasrv: BackupFile,
    storage: Vec<BackupFile>,
    ...
}

struct BackupMeta {
    backup_time: DateTime<Utc>,
    ...
}

struct BackupFile {
    blocks: Vec<Block>,
    etag: String,
}

struct BackupBlock {
    block_id: String,
    block_size: u64,
    ...
}
```

The `BackupManifest` will be encoded by protobuf and stored inside backup storage along with the backup metadata and data.

The protobuf definition of `BackupManifest` will be versioned to ensure both backward and forward compatibility. This will enable Databend Query to restore backups created using different versions of Databend.

### Backup Storage Layout

The backup storage layout will be as follows:

```
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/manifests/20250115_201500.manifest
s3://backup/manifests/20250116_201500.manifest
s3://backup/data/<block_id_0>
s3://backup/data/<block_id_1>
s3://backup/data/<block_id_....>
s3://backup/data/<block_id_N>
```

- `bendsave.md` serves as a quick reference guide to help users understand backup storage and recover the cluster.
- Each manifest in the `manifests/` directory includes everything needed to restore the cluster.
- The `data/` directory stores all the data blocks. Bendsave splits the source data into fixed-size blocks (e.g., 8 MiB) and uses their SHA-256 checksum as the block ID.

### Backup Process

- Export all metasrv data and save it to the backup storage.
- Enumerate the source backend storage services to create a `BackupManifest` file.
- Copy all data files to the backup storage.

For incremental backups, Databend examines the existing `BackupManifest` file and transfers only the modified data files to the backup storage, along with a new `BackupManifest` file.

For example:

The first time users perform a backup like:

```shell
bendsave backup --from /path/to/query-node-1.toml --to s3://backup/
```

they will see the following files created:

```shell
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/data/<sha256_of_block_0>
s3://backup/data/<sha256_of_block_1>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_N>
```

The second time users perform a backup, bendsave will generate the following files and omit existing blocks:

```shell
s3://backup/bendsave.md
s3://backup/manifests/20250114_201500.manifest
s3://backup/manifests/20250115_201500.manifest
s3://backup/data/<sha256_of_block_0>
s3://backup/data/<sha256_of_block_1>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_N>
s3://backup/data/<sha256_of_block_....>
s3://backup/data/<sha256_of_block_M>
```

The block id is generated by the SHA-256 checksum of the block content. So we can reuse the same block if it has been backed up before.

### Restore Process

- Read the `BackupManifest` file from the backup storage.
- Copies all related data files to their original location.
- Read the backed up metasrv data and import into new metasrv cluster.

Please note that the restore process will overwrite the entire MetaSrv cluster. All existing metadata in the backup target MetaSrv cluster will be permanently lost.

Users can restore from a backup using the following command:

```shell
bendsave restore --from s3://backup/manifests/20250114_201500.manifest --to /path/to/query-node-1.toml
```

Users can also restore incrementally by specifying the latest manifest file:

```shell
bendsave restore --from s3://backup/manifests/20250115_201500.manifest --to /path/to/query-node-1.toml
```

## Drawbacks

None.

## Rationale and alternatives

None.

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

### Replication

In the future, we could extend the backup and restore functionality to support replication. This would allow users to replicate databases or tables across different databend clusters for disaster recovery or data distribution purposes.

Databend can also implement a warm standby to ensure high availability and fault tolerance.
