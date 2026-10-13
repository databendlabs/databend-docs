---
title: Share Data as a Provider
sidebar_label: Provider Setup
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Do these steps in the provider tenant. Before you start, make sure that the [requirements](index.md#prerequisites) are satisfied.

The example uses the provider tenant `provider_acct` and the consumer tenant `consumer_acct`.

## Storage Setup {/* #storage-setup */}

Put the shared tables in a location that the provider connection can read.

| Deployment | Table location |
| --- | --- |
| **Databend Cloud** | Use a table with an external location in your bucket. Databend Cloud manages the default storage, and you do not have credentials for it. |
| **Self-hosted Databend** | Use a table with an external location, or a table in the default storage. For the default storage, the connection must have read access to it. |

The storage type of the connection must be the same as the storage type of the tables. For the connection options, see [CREATE CONNECTION](/sql/sql-commands/ddl/connection/create-connection).

For file system storage in self-hosted Databend, use an `fs` connection without parameters. The consumer query nodes must have access to the same files.

## Create a Share

### 1. Get the Provider Tenant ID

```sql
SELECT CURRENT_TENANT_ID();
```

Send this ID to the consumer. The consumer uses it to create the shared database.

### 2. Create a Connection

Replace the placeholders with your credentials. The credentials must have read and write access to the bucket.

```sql
CREATE CONNECTION share_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';
```

You can use an IAM role instead of access keys. For S3-compatible storage that is not AWS, add `ENDPOINT_URL`.

The example uses this connection for the table and for the Share. The Share connection must have read access only. In production, you can create a different read-only connection for the Share.

### 3. Prepare the Source Data

If you share a table that exists, skip this step.

```sql
CREATE DATABASE orders_db;
CREATE TABLE orders_db.orders (id INT, region STRING, amount INT)
    's3://<your-bucket>/orders_db/'
    CONNECTION = (CONNECTION_NAME = 'share_conn');
INSERT INTO orders_db.orders VALUES (1, 'apac', 100), (2, 'emea', 200);
```

The table is a FUSE table. Its data is in your bucket.

You can use the same location for other tables in this database. Databend keeps the data of each table in a different subdirectory. For the syntax, see [CREATE EXTERNAL TABLE](/sql/sql-commands/ddl/table/ddl-create-table-external-location).

### 4. Create the Share

:::caution
Do not use `CREATE OR REPLACE SHARE` to change credentials. This statement creates a new Share. Each consumer must then create its shared database again. To change credentials, see [Change the Connection](03-manage-shares.md#change-the-connection).
:::

```sql
CREATE SHARE sales_share
    CONNECTION = share_conn
    COMMENT = 'Shared order data';
```

### 5. Grant the Database

```sql
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
```

This grant does not give access to the tables. Grant each table in the next step.

### 6. Grant the Tables

```sql
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
```

The table must be in the granted database. The table must be a FUSE table without row access policies or masking policies.

### 7. Add the Consumer Account

Get the tenant ID from the consumer. Then run this statement:

```sql
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct;
```

If the ID contains uppercase letters or special characters, such as a hyphen, put the ID in backticks:

```sql
ALTER SHARE sales_share ADD ACCOUNTS = `consumer-tenant`;
```

:::note
`ADD ACCOUNTS` adds accounts to the list. `SET ACCOUNTS` replaces the full list.
:::

### 8. Examine the Share

```sql
DESCRIBE SHARE sales_share;
SHOW SHARES LIKE 'sales_share';
```

Make sure that `DESCRIBE SHARE` shows a `DATABASE` row for `orders_db` and a `TABLE` row for `orders_db.orders`.

Make sure that `SHOW SHARES` shows `OUTBOUND` in the `kind` column. The `to` column must contain the consumer tenant ID.

## Next Steps

Send the provider tenant ID and the Share name to the consumer. The consumer then does the steps in [Consumer Setup](02-consumers.md).

To change the consumer accounts, the grants, or the connection, see [Manage Shares](03-manage-shares.md).
