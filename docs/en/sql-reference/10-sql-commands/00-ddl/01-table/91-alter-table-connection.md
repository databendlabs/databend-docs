---
title: ALTER TABLE CONNECTION
sidebar_position: 6
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.750"/>

Updates the connection settings for an external table.

## Syntax

```sql
ALTER TABLE [ <database_name>. ]<table_name> CONNECTION = ( connection_name = '<connection_name>' )
```

| Parameter | Description | Required |
|-----------|-------------|----------|
| connection_name | Name of the connection to be used for the external table. The connection must already exist in the system. | Yes |

## Usage Notes

When using the ALTER TABLE CONNECTION command, only credential-related settings can be changed, including `access_key_id`, `secret_access_key`, and `role_arn`. Changes to other connection parameters such as `bucket`, `region`, or `root` will be ignored.

This command is particularly useful when credentials need to be rotated or when IAM roles change. The specified connection must already exist in the system before it can be used with this command.

## Security Best Practices

When working with external tables, AWS IAM roles provide significant security advantages over access keys:

- **No stored credentials**: Eliminates the need to store access keys in your configuration
- **Automatic rotation**: Handles credential rotation automatically
- **Fine-grained control**: Allows for more precise access control

To use IAM roles with Databend Cloud, see [Creating External Stage with AWS IAM Role](/guides/load-data/stage/aws-iam-role) for instructions.

## Examples

### Updating Connection for an External Table

This example creates an external table with an initial connection, then updates it to use a different connection:

```sql
-- Create two connections with different credentials
CREATE CONNECTION external_table_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE CONNECTION external_table_conn_new
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-new-access-key-id>'
    SECRET_ACCESS_KEY = '<your-new-secret-access-key>';

-- Create an external table using the first connection
CREATE OR REPLACE TABLE external_table_test (
    id INT,
    name VARCHAR,
    age INT
) 
's3://testbucket/13_fuse_external_table/' 
CONNECTION=(connection_name = 'external_table_conn');

-- Update the table to use the new connection with rotated credentials
ALTER TABLE external_table_test CONNECTION=( connection_name = 'external_table_conn_new' );
```

### Updating Connection for an External Table with IAM Role

This example demonstrates migrating from access key authentication to IAM role authentication:

```sql
-- Create an external table with access key authentication
CREATE CONNECTION s3_access_key_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE TABLE sales_data (
    order_id INT,
    product_name VARCHAR,
    quantity INT
) 
's3://sales-bucket/data/' 
CONNECTION=(connection_name = 's3_access_key_conn');

-- Later, create a new connection using IAM role authentication
CREATE CONNECTION s3_role_conn
    STORAGE_TYPE = 's3'
    ROLE_ARN = 'arn:aws:iam::123456789012:role/databend-access';

-- Update the table to use the IAM role connection instead
ALTER TABLE sales_data CONNECTION=( connection_name = 's3_role_conn' );
```
