---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.955"/>

Create a database.

## Syntax

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    [ OPTIONS ( <database_option> = '<value>' [, ...] ) ]

CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    FROM SHARE <provider_tenant>.<share_name>
```

## Parameters

| Parameter                    | Description                                                                                                                                      |
|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION` | The name of an existing connection (created via `CREATE CONNECTION`) to use as the default storage connection for tables in this database.        |
| `DEFAULT_STORAGE_PATH`       | The default storage path URI (e.g., `s3://bucket/path/`) for tables in this database. Must end with `/` and match the connection's storage type. |
| `DEFAULT_S3_STORAGE_CLASS`   | The default S3 storage class for new non-temporary external Fuse tables. Accepts `standard` or `intelligent_tiering` (case-insensitive). |
| `FROM SHARE`                 | Creates a read-only shared database from a Share. `provider_tenant` is the tenant ID of the provider. See [Create a Database from a Share](#from-share). |

:::note
- `DEFAULT_STORAGE_CONNECTION` and `DEFAULT_STORAGE_PATH` must be specified together. Specifying only one is an error.
- When both options are set, Databend validates that the connection exists, the path URI is well-formed, and the storage location is accessible.
- `DEFAULT_S3_STORAGE_CLASS` can be set independently. It does not make tables external. New external Fuse tables inherit it unless they specify `S3_STORAGE_CLASS`. For the workflow and limits, see [External Tables](/guides/data-management/external-tables#s3-storage-class).
:::

## Access control requirements

| Privilege       | Object Type | Description         |
|:----------------|:------------|:--------------------|
| CREATE DATABASE | Global      | Creates a database. |


To create a database, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the CREATE DATABASE [privilege](/guides/security/access-control/privileges).

For `FROM SHARE`, the consumer tenant must also be a consumer account of the Share. In self-hosted Databend, the license must include the `DataSharing` feature.

## Create a Database from a Share {/* #from-share */}

Use `FROM SHARE` in the consumer tenant. Databend creates a read-only shared database from the Share of the provider.

- If the tenant ID contains uppercase letters or special characters, put the ID in backticks.
- Create the shared database in the default catalog. Do not use `ENGINE` or `OPTIONS` with `FROM SHARE`.
- Databend examines the Share when it creates the database. The Share must exist, the consumer tenant must be a consumer account, and the Share must grant a database. If one of these conditions is not satisfied, the statement fails.
- Databend examines the authorization again for each query.
- Shared tables are read-only.
- `DROP DATABASE` drops the shared database only. The provider data does not change.
- If a database with the same name exists, `IF NOT EXISTS` does nothing. Databend does not examine the Share.

:::caution
`OR REPLACE` replaces a database with the same name. This includes a local database that contains data. Databend examines the Share before it replaces the database.
:::

For the requirements and the procedures, see [Data Sharing](/guides/data-management/data-sharing).

## Examples

### Creating a Basic Database

The following example creates a database named `test`:

```sql
CREATE DATABASE test;
```

### Creating a Database with External Storage Defaults

The following example creates a connection using an AWS IAM role and then creates a database that uses this connection as its default storage. Using an IAM role is more secure than access keys because it doesn't require storing credentials in Databend.

```sql
CREATE CONNECTION my_s3
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE DATABASE analytics OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics/',
    DEFAULT_S3_STORAGE_CLASS = 'intelligent_tiering'
);

CREATE TABLE analytics.events (id INT);
```

The table uses the database's external location and storage class. Omit `DEFAULT_S3_STORAGE_CLASS` if you do not need to select a class.

### Creating a Database from a Share

The following example creates a shared database from the Share `sales_share` of the provider tenant `provider_acct`:

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
SELECT * FROM shared_orders.orders;
```

:::info
To use IAM roles with Databend Cloud, you need to set up a trust relationship between your AWS account and Databend Cloud. See [Authenticate with AWS IAM Role](/guides/cloud/security/iam-role) for detailed instructions.
:::
