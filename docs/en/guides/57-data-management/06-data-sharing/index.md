---
title: Data Sharing
sidebar_label: Overview
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Data Sharing gives other tenants read-only access to selected tables. Databend does not copy the data.

The provider creates a Share and grants tables to it. The consumer creates a shared database from the Share. Queries on the shared database read the provider data directly.

## Terms

| Term | Definition |
| --- | --- |
| **Provider** | The tenant that owns the source tables and the Share. |
| **Consumer** | A tenant that has authorization to read the Share. |
| **Share** | An object that contains one database grant, table grants, consumer accounts, and a connection. |
| **Consumer account** | The tenant ID of a consumer in a Share. A tenant ID is not a user name or a role name. |
| **Connection** | A storage connection of the provider. Databend uses its credentials to read the shared tables. |
| **Shared database** | A read-only database that a consumer creates from a Share. It does not contain a copy of the data. |

## Requirements {/* #prerequisites */}

- Use Databend v1.2.949 or later.
- **Databend Cloud:** The provider and the consumer must be in the same region. Cross-region sharing is not supported.
- **Self-hosted Databend:** The provider and the consumer must use the same Databend Meta cluster. Each deployment must have an Enterprise license with the `DataSharing` feature.
- Share FUSE tables only. Views, other table engines, and tables with row access policies or masking policies are not supported.
- The provider connection must have read access to the storage location of the shared tables. In self-hosted Databend, the consumer query nodes must also have network access to this storage.
- The provider and the consumer must have the privileges in [Access Control](#access-control).

## Quickstart {/* #quickstart */}

The example uses the provider tenant `provider_acct` and the consumer tenant `consumer_acct`. Use a different session for each tenant.

Before you start, get an S3 bucket and credentials with read and write access to it. The example puts the shared table in this bucket. This procedure also applies to Databend Cloud.

In the provider session, run these statements:

```sql
CREATE CONNECTION share_conn
    STORAGE_TYPE = 's3'
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>';

CREATE DATABASE orders_db;
CREATE TABLE orders_db.orders (id INT, region STRING, amount INT)
    's3://<your-bucket>/orders_db/'
    CONNECTION = (CONNECTION_NAME = 'share_conn');
INSERT INTO orders_db.orders VALUES (1, 'apac', 100), (2, 'emea', 200);

CREATE SHARE sales_share CONNECTION = share_conn;
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct;
```

To make the example simple, the table and the Share use the same connection. For S3-compatible storage that is not AWS, add `ENDPOINT_URL` to the connection.

In the consumer session, run these statements:

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
SELECT * FROM shared_orders.orders;
```

For each step and its options, see [Provider Setup](01-providers.md) and [Consumer Setup](02-consumers.md).

## Access Control {/* #access-control */}

| Operation | Required privileges |
| --- | --- |
| `CREATE SHARE`, `ALTER SHARE`, `DROP SHARE` | The global `GRANT` privilege. |
| `GRANT USAGE ON DATABASE ... TO SHARE` | The global `GRANT` privilege and `USAGE` on the provider database. |
| `GRANT SELECT ON TABLE ... TO SHARE` | The global `GRANT` privilege and `SELECT` on the provider table. |
| `REVOKE ... FROM SHARE` | The global `GRANT` privilege. If the object exists, also `USAGE` or `SELECT` on the object. |
| `SHOW SHARES`, `DESCRIBE SHARE` | No other privilege. A tenant can see only its Shares and the Shares that give access to it. |
| `CREATE DATABASE ... FROM SHARE` | The global `CREATE DATABASE` privilege. The consumer tenant must be a consumer account of the Share. |

In self-hosted Databend, all Share operations require the `DataSharing` license feature.

## Storage and Connections {/* #storage-and-connections */}

When the provider grants a table, Databend records the storage location of the table. Databend does not record credentials. When the consumer reads the table, Databend uses the credentials of the current Share connection.

- The credentials of the connection must have read access to the bucket of the granted tables.
- The storage type of the connection must be the same as the storage type of the granted tables.
- S3, Azure Blob, and GCS connections can supply credentials. An `fs` connection without parameters uses the file system configuration of the provider. Other storage types are not supported.
- The default storage of the consumer does not change the location of the shared data.
- The consumer does not get the credentials of the connection.

## Limits

- A Share can grant one database only. Use a different Share for each database.
- Grant `USAGE` on the database first. Then grant `SELECT` on each table. `USAGE` alone does not give access to the tables.
- Column-level grants and wildcard table grants are not supported.
- Shared tables are read-only. The consumer cannot change the data or the table definition.
- The consumer cannot grant a shared database to a Share.
- `SHOW SHARES` supports `LIKE` and `LIMIT` only.
- Changes by the provider apply to subsequent queries. A query that is in progress continues.

The consumer can create streams on shared tables. See [Streams on Shared Tables](02-consumers.md#streams-on-shared-tables).

## Data Sharing and ATTACH TABLE

Databend has two different sharing mechanisms:

| Mechanism | Setup | Access control |
| --- | --- | --- |
| **Share** | The provider creates a Share. The consumer creates a shared database from it. | The provider controls the table grants and the consumer accounts. |
| **ATTACH TABLE** | The consumer attaches a table from its storage location. | The storage configuration controls access. A Share is not used. |

For `ATTACH TABLE`, see [How Databend Data Sharing Works](/guides/how-databend-works/how-databend-share-data-works). For the syntax of all Share statements, see the [Share SQL Reference](/sql/sql-commands/ddl/share).
