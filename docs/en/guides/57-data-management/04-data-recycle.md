---
title: Data Purge and Recycle
sidebar_label: Data Recycle
---

In Databend, the data is not truly deleted when you run `DROP`, `TRUNCATE`, or `DELETE` commands, allowing for time travel back to previous states.

There are two types of data:

- **History Data**: Used by Time Travel to store historical data or data from dropped tables.
- **Temporary Data**: Used by the system to store spilled data.

If the data size is significant, you can run several commands ([Enterprise Edition Features](/guides/products/dee/enterprise-features)) to delete these data and free up storage space.

## Spill Data Storage

Self-hosted Databend supports spilling intermediate query results to disk when memory usage exceeds available limits. Users can configure where spill data is stored, choosing between local disk storage and a remote S3-compatible bucket.

### Spill Storage Options

Databend provides the following spill storage configurations:

- Local Disk Storage: Spilled data is written to a specified local directory in the query node (Windows only).
- Remote S3-Compatible Storage: Spilled data is stored in an external S3 bucket.
- Default Storage: If no spill storage is configured, Databend spills data to the default storage bucket along with your table data.

### Spill Priority

If both local and S3 spill storage are configured, Databend follows this order:

1. Spill to local disk first (if configured).
2. Spill to remote S3 storage when local disk space is insufficient.
3. Spill to Databend’s default storage bucket if neither local nor external S3 storage is configured.

### Configuring Spill Storage

To configure spill storage, update the [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file.

This example sets Databend to use up to 1 TB of local disk space for spill operations, while reserving 40% of the disk for system use:

```toml
[spill]
spill_local_disk_path = "C:\data1\databend\databend_spill"
spill_local_disk_reserved_space_percentage = 40
spill_local_disk_max_bytes = 1099511627776
```

This example sets Databend to use MinIO as an S3-compatible storage service for spill operations:

```toml
[spill]
[spill.storage]
type = "s3"
[spill.storage.s3]
bucket = "databend"
root = "admin"
endpoint_url = "http://127.0.0.1:9900"
access_key_id = "minioadmin"
secret_access_key = "minioadmin"
allow_insecure = true
```

## Purge Drop Table Data

Deletes data files of all dropped tables, freeing up storage space.

```sql
VACUUM DROP TABLE;
```

See more [VACUUM DROP TABLE](/sql/sql-commands/administration-cmds/vacuum-drop-table).

## Purge Table History Data

Removes historical data for a specified table, clearing old versions and freeing storage.

```sql
VACUUM TABLE <table_name>;
```

See more [VACUUM TABLE](/sql/sql-commands/administration-cmds/vacuum-table).

## Purge Temporary Data

Clears temporary spilled files used for joins, aggregates, and sorts, freeing up storage space.

```sql
VACUUM TEMPORARY FILES;
```

See more [VACUUM TEMPORARY FILES](/sql/sql-commands/administration-cmds/vacuum-temp-files).
