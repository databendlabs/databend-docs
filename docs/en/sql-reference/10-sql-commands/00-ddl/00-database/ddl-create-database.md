---
title: CREATE DATABASE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.866"/>

Create a database.

## Syntax

```sql
CREATE [ OR REPLACE ] DATABASE [ IF NOT EXISTS ] <database_name>
    [ OPTIONS (
        DEFAULT_STORAGE_CONNECTION = '<connection_name>',
        DEFAULT_STORAGE_PATH = '<path>'
    ) ]
```

## Parameters

| Parameter                    | Description                                                                                                                                      |
|:-----------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------|
| `DEFAULT_STORAGE_CONNECTION` | The name of an existing connection (created via `CREATE CONNECTION`) to use as the default storage connection for tables in this database.        |
| `DEFAULT_STORAGE_PATH`       | The default storage path URI (e.g., `s3://bucket/path/`) for tables in this database. Must end with `/` and match the connection's storage type. |

:::note
- `DEFAULT_STORAGE_CONNECTION` and `DEFAULT_STORAGE_PATH` must be specified together. Specifying only one is an error.
- When both options are set, Databend validates that the connection exists, the path URI is well-formed, and the storage location is accessible.
:::

## Access control requirements

| Privilege       | Object Type | Description         |
|:----------------|:------------|:--------------------|
| CREATE DATABASE | Global      | Creates a database. |


To create a database, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the CREATE DATABASE [privilege](/guides/security/access-control/privileges).

## Examples

### Creating a Basic Database

The following example creates a database named `test`:

```sql
CREATE DATABASE test;
```

### Creating a Database with a Default Storage Connection

The following example creates a connection using an AWS IAM role and then creates a database that uses this connection as its default storage. Using an IAM role is more secure than access keys because it doesn't require storing credentials in Databend.

```sql
CREATE CONNECTION my_s3
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE DATABASE analytics OPTIONS (
    DEFAULT_STORAGE_CONNECTION = 'my_s3',
    DEFAULT_STORAGE_PATH = 's3://mybucket/analytics/'
);
```

:::info
To use IAM roles with Databend Cloud, you need to set up a trust relationship between your AWS account and Databend Cloud. See [Authenticate with AWS IAM Role](/guides/cloud/security/iam-role) for detailed instructions.
:::
