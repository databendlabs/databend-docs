---
title: External Tables
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Databend Cloud manages table storage for you by default. You do not need to configure a bucket or a storage class for regular tables.

Use an **external table** when you want Databend to store a table in your own S3 bucket. An external table uses the Fuse engine and supports SQL reads and writes. It does not query arbitrary files already in the bucket. To load existing files into a table, use [COPY INTO](/sql/sql-commands/dml/dml-copy-into-table).

## Before You Start

- Prepare an S3 bucket and a path for the table.
- Give Databend Cloud access to the bucket. For AWS, [set up an IAM role](/guides/cloud/security/iam-role).
- Ensure that the role has the [required bucket permissions](/sql/sql-commands/ddl/table/ddl-create-table-external-location#bucket-permissions).

The examples use `mybucket`. Replace it with your bucket name. Run the SQL in a Databend Cloud worksheet or a connected SQL client.

## Create an External Table

Create a reusable connection with your IAM role. Replace `<your-role-arn>` with the role you prepared.

```sql
CREATE CONNECTION my_s3
    STORAGE_TYPE = 's3'
    ROLE_ARN = '<your-role-arn>';
```

Create a database and a table with an explicit S3 location.

```sql
CREATE DATABASE external_analytics;

CREATE TABLE external_analytics.events (id INT, event_time TIMESTAMP)
    's3://mybucket/events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3');

INSERT INTO external_analytics.events VALUES (1, '2026-01-01 00:00:00');
SELECT * FROM external_analytics.events;
```

For access keys or an S3-compatible service, see [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection).

## Choose an S3 Storage Class {/* #s3-storage-class */}

<FunctionDescription description="Introduced or updated: v1.2.955"/>

You can select a storage class for new data written to external tables. Values are case-insensitive.

| Value | When to use it |
|-------|----------------|
| `standard` | Use S3 Standard for frequently accessed data. |
| `intelligent_tiering` | Let S3 Intelligent-Tiering manage tiers as access patterns change. Check [AWS pricing and conditions](https://aws.amazon.com/s3/storage-classes/intelligent-tiering/) before you select it. |

You can set the class on a table or set a default on the database. A table-level setting overrides the database default. S3-compatible services must support the selected class. Changes apply only to future writes. They do not change existing S3 objects or delete table data.

### Set the Class on a Table

Add `S3_STORAGE_CLASS` when you create the table.

```sql
CREATE TABLE external_analytics.archive_events (id INT)
    's3://mybucket/archive_events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3')
    S3_STORAGE_CLASS = 'intelligent_tiering';
```

To change or remove the setting on an existing table, use `ALTER TABLE`. You do not need to recreate the table.

```sql
-- Use Intelligent-Tiering for future writes.
ALTER TABLE external_analytics.events SET OPTIONS (S3_STORAGE_CLASS = 'intelligent_tiering');

-- Use S3 Standard for future writes.
ALTER TABLE external_analytics.events SET OPTIONS (S3_STORAGE_CLASS = 'standard');

-- Remove the stored table option.
ALTER TABLE external_analytics.events UNSET OPTIONS (S3_STORAGE_CLASS);
```

`UNSET` uses the default storage behavior. It **does not** reapply the database default. To ensure S3 Standard, explicitly set `standard`.

To check the stored option:

```sql
SET hide_options_in_show_create_table = 0;
SHOW CREATE TABLE external_analytics.events;
```

After `UNSET`, the definition no longer includes `S3_STORAGE_CLASS`.

### Set a Database Default

Set `DEFAULT_S3_STORAGE_CLASS` on the database to avoid repeating the class for each new external table.

```sql
ALTER DATABASE external_analytics SET OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE TABLE external_analytics.daily_events (id INT)
    's3://mybucket/daily_events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3');
```

The new table inherits `intelligent_tiering`.

You can also set the connection, path, and class together when you create a database. New tables then use the database's external storage defaults without a location clause.

```sql
CREATE DATABASE external_logs OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/logs/',
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE TABLE external_logs.app_events (id INT);
```

Setting only `DEFAULT_S3_STORAGE_CLASS` does not make tables external. The table must have an explicit external location or inherit one from the database.

A change to the database default applies only to new tables. To switch back to S3 Standard, update the database default and each existing table separately.

```sql
ALTER DATABASE external_analytics SET OPTIONS (DEFAULT_S3_STORAGE_CLASS = 'standard');
ALTER TABLE external_analytics.daily_events SET OPTIONS (S3_STORAGE_CLASS = 'standard');
```

### Limits and Permission Errors

- Storage-class options apply only to non-temporary external Fuse tables on S3 or S3-compatible storage.
- Internal tables and temporary tables do not inherit the database class. Explicitly setting `S3_STORAGE_CLASS` on them returns an error.
- Materialized Views and Dynamic Tables use internal storage. They do not inherit the database or source table's storage class and reject `S3_STORAGE_CLASS`.
- If your bucket policy restricts `s3:PutObject` by storage class, allow the class selected for the table or database. Databend uses that class when it checks access to the external location.

## SQL Reference

- [CREATE EXTERNAL TABLE](/sql/sql-commands/ddl/table/ddl-create-table-external-location)
- [CREATE DATABASE](/sql/sql-commands/ddl/database/ddl-create-database)
- [ALTER DATABASE](/sql/sql-commands/ddl/database/ddl-alter-database)
- [ALTER TABLE](/sql/sql-commands/ddl/table/alter-table#fuse-engine-options)
