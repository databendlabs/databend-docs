---
title: CREATE EXTERNAL TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

The `CREATE TABLE ... CONNECTION = (...)` statement creates a Fuse table in an S3-compatible storage bucket instead of the server's default storage.

## Benefits

- You can determine the storage location of the table data.
- Leverage high-performance storage like [Amazon S3 Express One Zone](https://aws.amazon.com/s3/storage-classes/express-one-zone/), to improve performance.

## Syntax

```sql
CREATE TABLE [IF NOT EXISTS] [db.]table_name (
    <column_name> <data_type> [NOT NULL | NULL] [{ DEFAULT <expr> }],
    <column_name> <data_type> [NOT NULL | NULL] [{ DEFAULT <expr> }],
    ...
)
's3://<bucket>/[<path>]'
CONNECTION = (
    ENDPOINT_URL = 'https://<endpoint-URL>'
    ACCESS_KEY_ID = '<your-access-key-ID>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
    ENABLE_VIRTUAL_HOST_STYLE = 'true' | 'false'
)
|
CONNECTION = (
    CONNECTION_NAME = '<your-connection-name>'
)
[ S3_STORAGE_CLASS = 'standard' | 'intelligent_tiering' ];
```

Connection parameters:

| Parameter                   | Description                                                                                                                                                                                                              | Required   |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| `s3://<bucket>/[<path>]`    | Files are in the specified external location (S3-like bucket)                                                                                                                                                            | YES        |
| ENDPOINT_URL              	 | The bucket endpoint URL starting with "https://". To use a URL starting with "http://", set `allow_insecure` to `true` in the [storage] block of the file `databend-query-node.toml`.                                  	 | Optional 	 |
| ACCESS_KEY_ID             	 | Your access key ID for connecting the AWS S3 compatible object storage. If not provided, Databend will access the bucket anonymously.    	                                                                               | Optional 	 |
| SECRET_ACCESS_KEY         	 | Your secret access key for connecting the AWS S3 compatible object storage. 	                                                                                                                                            | Optional 	 |
| ENABLE_VIRTUAL_HOST_STYLE 	 | If you use virtual hosting to address the bucket, set it to "true".                               	                                                                                                                      | Optional 	 |

For more information on `CONNECTION_NAME`, see [CREATE CONNECTION](../13-connection/create-connection.md)

## S3 Storage Class

Use `S3_STORAGE_CLASS` to select the S3 storage class for new objects in a non-temporary external Fuse table. Values are case-insensitive:

| Value | S3 storage class |
|-------|------------------|
| `standard` | S3 Standard |
| `intelligent_tiering` | S3 Intelligent-Tiering |

This option applies only to S3 and S3-compatible storage. The storage service must support the selected storage class.

### Database default and table override

- Set `DEFAULT_S3_STORAGE_CLASS` with [CREATE DATABASE](../00-database/ddl-create-database.md) or [ALTER DATABASE](../00-database/ddl-alter-database.md).
- A new non-temporary external Fuse table copies this default into its table options. This applies to explicit external locations and locations inherited from the database connection and path defaults.
- An explicit `S3_STORAGE_CLASS` takes priority over the database default.
- Later changes to the database default do not affect existing tables.
- `ALTER TABLE ... SET OPTIONS` changes the class for future writes only. Existing objects keep their storage class.
- `ALTER TABLE ... UNSET OPTIONS(S3_STORAGE_CLASS)` removes the stored override, including an inherited value. It does not reapply the current database default.

### Restrictions

- Internal tables do not inherit this default. Their S3 storage class comes from the server `[storage.s3].storage_class` configuration. `CREATE TABLE` and `ALTER TABLE ... SET OPTIONS` reject `S3_STORAGE_CLASS` without an external location.
- Temporary tables do not inherit this default and reject explicit `S3_STORAGE_CLASS` values. Temporary S3 tables use `STANDARD`.
- Non-Fuse engines do not support this option.
- Materialized Views and Dynamic Tables currently use internal storage only. They do not inherit the database default or the source table's storage class. An explicit `S3_STORAGE_CLASS` is rejected.

## S3-compatible Bucket Policy Requirements

The external location S3 bucket must have the following permissions granted through an S3 bucket policy:

**Read-only Access:**
- `s3:GetObject`: Allows reading objects from the bucket.
- `s3:ListBucket`: Allows listing objects in the bucket.
- `s3:ListBucketVersions`: Allows listing object versions in the bucket.
- `s3:GetObjectVersion`: Allows retrieving a specific version of an object.

**Writable Access:**
- `s3:PutObject`: Allows writing objects to the bucket.
- `s3:DeleteObject`: Allows deleting objects from the bucket.
- `s3:AbortMultipartUpload`: Allows aborting multipart uploads.
- `s3:DeleteObjectVersion`: Allows deleting a specific version of an object.

Databend checks external-location permissions with the effective storage class. If a bucket policy restricts `s3:PutObject` by storage class, it must allow the class selected by the table option or database default.

## Examples

:::info

Before using the `SHOW CREATE TABLE` command, you need to set the `hide_options_in_show_create_table` variable to `0`.
```sql
SET GLOBAL hide_options_in_show_create_table = 0;
```
:::

### Create a Table with External Location

Create a table with data stored on an external location, such as Amazon S3:

```sql
-- Create a table named `mytable` and specify the location `s3://testbucket/admin/data/` for the data storage
CREATE TABLE mytable (
  a INT
)
's3://testbucket/admin/data/'
CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>',
  ENDPOINT_URL = 'https://s3.amazonaws.com'
);

-- Show the table schema
SHOW CREATE TABLE mytable;

CREATE TABLE mytable (
  a INT NULL
)
ENGINE = FUSE
COMPRESSION = 'zstd'
STORAGE_FORMAT = 'parquet'
LOCATION = 's3 | bucket=testbucket,root=/admin/data/,endpoint=https://s3.amazonaws.com';
```

### Set and Change an S3 Storage Class

The connection `s3_connection` must already exist and have access to the bucket.

```sql
CREATE OR REPLACE DATABASE external_analytics OPTIONS (
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE OR REPLACE TABLE external_analytics.events (id INT)
    's3://testbucket/events/'
    CONNECTION = (CONNECTION_NAME = 's3_connection')
    S3_STORAGE_CLASS = 'standard';

ALTER TABLE external_analytics.events SET OPTIONS (
    S3_STORAGE_CLASS = 'intelligent_tiering'
);

ALTER TABLE external_analytics.events UNSET OPTIONS (S3_STORAGE_CLASS);
```

The explicit `standard` value overrides the database default at creation. Without that table option, the table inherits `intelligent_tiering`. `SET OPTIONS` affects only new objects. `UNSET OPTIONS` removes the override without copying the database default again.

### Create a Table Using a Connection

Or you can create a connection and use it to create a table:
```sql
-- Create a connection named `s3_connection` for the S3 credentials
CREATE CONNECTION s3_connection
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE TABLE mytable (
  a INT
)
's3://testbucket/admin/data/'
CONNECTION = (
  CONNECTION_NAME = 's3_connection'
);

-- Show the table schema
SHOW CREATE TABLE mytable;

CREATE TABLE mytable (
  a INT NULL
)
ENGINE = FUSE
COMPRESSION = 'zstd'
STORAGE_FORMAT = 'parquet'
LOCATION = 's3 | bucket=testbucket,root=/admin/data/,endpoint=https://s3.amazonaws.com';
```
