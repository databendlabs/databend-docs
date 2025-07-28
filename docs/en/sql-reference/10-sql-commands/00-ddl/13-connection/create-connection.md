---
title: CREATE CONNECTION
sidebar_position: 1
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.780"/>

Creates a connection to external storage.

:::warning
IMPORTANT: When objects (stages, tables, etc.) use a connection, they copy and store the connection's parameters permanently. If you later modify the connection using CREATE OR REPLACE CONNECTION, existing objects will continue using the old parameters. To update objects with new connection parameters, you must drop and recreate those objects.
:::

## Syntax

```sql
CREATE [ OR REPLACE ] CONNECTION [ IF NOT EXISTS ] <connection_name> 
    STORAGE_TYPE = '<type>' 
    [ <storage_params> ]
```

| Parameter        | Description                                                                                                                                        |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|
| STORAGE_TYPE     | Type of storage service. Possible values include: `s3`, `azblob`, `gcs`, `oss`, and `cos`.                                                         |
| storage_params   | Vary based on storage type and authentication method. See details below for common authentication methods. |

For other storage types and additional parameters, see [Connection Parameters](../../../00-sql-reference/51-connect-parameters.md) for details.

### Authentication Methods for Amazon S3

Databend supports two primary authentication methods for Amazon S3 connections:

#### 1. Access Keys Authentication

Use AWS access keys for authentication. This is the traditional method using an access key ID and secret access key.

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

| Parameter | Description |
|-----------|-------------|
| ACCESS_KEY_ID | Your AWS access key ID. |
| SECRET_ACCESS_KEY | Your AWS secret access key. |

#### 2. IAM Role Authentication

Use AWS IAM roles for authentication instead of access keys. This provides a more secure way to access your S3 buckets without managing credentials directly in Databend.

```sql
CREATE CONNECTION <connection_name> 
    STORAGE_TYPE = 's3' 
    ROLE_ARN = '<your-role-arn>';
```

| Parameter | Description |
|-----------|-------------|
| ROLE_ARN  | The Amazon Resource Name (ARN) of the IAM role that Databend will assume to access your S3 resources. |


## Access control requirements

| Privilege         | Object Type | Description           |
|:------------------|:------------|:----------------------|
| CREATE CONNECTION | Global      | Creates a connection. |


To create a connection, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the CREATE CONNECTION [privilege](/guides/security/access-control/privileges).

:::note

The enable_experimental_connection_rbac_check settings governs connection-level access control. It is disabled by default.
Connection creation solely requires the user to possess superuser privileges, bypassing detailed RBAC checks.
When enabled, granular permission verification is enforced during connection establishment.

This is an experimental feature and may be enabled by default in the future.

:::

## Examples

### Using Access Keys

This example creates a connection to Amazon S3 named 'toronto' and establishes an external stage named 'my_s3_stage' linked to the 's3://databend-toronto' URL, using the 'toronto' connection. For more practical examples about connection, see [Usage Examples](index.md#usage-examples).  

```sql
CREATE CONNECTION toronto 
    STORAGE_TYPE = 's3' 
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE STAGE my_s3_stage 
    URL = 's3://databend-toronto' 
    CONNECTION = (CONNECTION_NAME = 'toronto');
```

### Using AWS IAM Role

This example creates a connection to Amazon S3 using an IAM role and then creates a stage that uses this connection. This approach is more secure as it doesn't require storing access keys in Databend.

```sql
CREATE CONNECTION databend_test 
    STORAGE_TYPE = 's3' 
    ROLE_ARN = 'arn:aws:iam::987654321987:role/databend-test';

CREATE STAGE databend_test 
    URL = 's3://test-bucket-123' 
    CONNECTION = (CONNECTION_NAME = 'databend_test');

-- You can now query data from your S3 bucket
SELECT * FROM @databend_test/test.parquet LIMIT 1;
```

:::info
To use IAM roles with Databend Cloud, you need to set up a trust relationship between your AWS account and Databend Cloud. See [Creating External Stage with AWS IAM Role](/guides/load-data/stage/aws-iam-role) for detailed instructions.
:::
