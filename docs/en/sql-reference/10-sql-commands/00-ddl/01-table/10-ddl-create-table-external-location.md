---
title: CREATE EXTERNAL TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

Creates a Fuse table in your own S3 or S3-compatible bucket. Databend Cloud manages storage for regular tables; use an external table only when you need your own storage location.

For the complete workflow, see [External Tables](/guides/data-management/external-tables).

## Syntax

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name (
    <column_name> <data_type> [, ...]
)
's3://<bucket>/<path>/'
CONNECTION = (CONNECTION_NAME = '<connection_name>')
[ S3_STORAGE_CLASS = 'standard' | 'intelligent_tiering' ];
```

| Parameter | Description |
|-----------|-------------|
| `s3://<bucket>/<path>/` | The external storage location for the table. |
| `CONNECTION_NAME` | An existing storage connection. See [CREATE CONNECTION](../13-connection/create-connection.md). |
| `S3_STORAGE_CLASS` | Optional storage class for future writes. See [S3 Storage Class](#s3-storage-class). |

You can also supply [S3 connection parameters](../../../00-sql-reference/51-connect-parameters.md) directly in `CONNECTION = (...)`. Use a named connection to reuse credentials across tables.

## S3 Storage Class

<FunctionDescription description="Introduced or updated: v1.2.955"/>

`S3_STORAGE_CLASS` accepts `standard` or `intelligent_tiering` (case-insensitive). It applies only to non-temporary external Fuse tables on storage that supports the selected class.

If omitted, the table inherits the database's `DEFAULT_S3_STORAGE_CLASS` when set. An explicit table value takes priority. Inheritance occurs only at table creation.

For class selection, database defaults, and changes to existing tables, see [Choose an S3 Storage Class](/guides/data-management/external-tables#s3-storage-class).

<a id="bucket-permissions"></a>

## S3-compatible Bucket Policy Requirements

The connection must have these permissions for the external location.

| Access | Required S3 permissions |
|--------|-------------------------|
| Read | `s3:GetObject`, `s3:ListBucket`, `s3:ListBucketVersions`, `s3:GetObjectVersion` |
| Write | `s3:PutObject`, `s3:DeleteObject`, `s3:AbortMultipartUpload`, `s3:DeleteObjectVersion` |

If the bucket policy restricts `s3:PutObject` by storage class, it must allow the selected class. Databend uses the effective class when it checks access to the external location.

## Example

The connection `my_s3` must already exist and have access to the bucket.

```sql
CREATE TABLE external_events (id INT)
    's3://mybucket/events/'
    CONNECTION = (CONNECTION_NAME = 'my_s3')
    S3_STORAGE_CLASS = 'intelligent_tiering';
```
