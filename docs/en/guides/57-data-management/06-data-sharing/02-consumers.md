---
title: Consume Shared Data
sidebar_label: Consumer Setup
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Do these steps in the consumer tenant. The provider must first do the steps in [Provider Setup](01-providers.md).

## Create a Shared Database

### 1. Get the Consumer Tenant ID

```sql
SELECT CURRENT_TENANT_ID();
```

Send this ID to the provider. The provider adds it to the consumer accounts of the Share.

### 2. Find the Share

```sql
SHOW SHARES;
```

Find the row that shows `INBOUND` in the `kind` column. Record the values in the `owner_account` and `name` columns. These values are the provider tenant ID and the Share name.

### 3. Examine the Shared Objects

```sql
DESCRIBE SHARE provider_acct.sales_share;
```

Make sure that the Share grants the database and the tables that you need.

### 4. Create the Shared Database

```sql
CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
```

If the provider tenant ID contains uppercase letters or special characters, put the ID in backticks:

```sql
CREATE DATABASE shared_orders FROM SHARE `provider-tenant`.sales_share;
```

Create the shared database in the default catalog. Do not use `ENGINE` or `OPTIONS` with `FROM SHARE`.

### 5. Query the Data

```sql
SHOW TABLES FROM shared_orders;
SELECT id, region, amount FROM shared_orders.orders ORDER BY id;
```

The shared database shows only the granted tables. New data from the provider is visible in subsequent queries.

## Use the Shared Database

- The role that creates the shared database owns it. The owner can grant access to other roles in the consumer tenant.
- Local grants do not replace the authorization from the provider. If the provider removes access, local grants do not give access.
- Shared tables are read-only. Statements that change the data or the table definition fail. `OPTIMIZE` and `VACUUM` also fail.
- You can create more than one shared database from the same Share.

## Streams on Shared Tables {/* #streams-on-shared-tables */}

The consumer can create a stream on a shared table. Put the stream in a local database, not in the shared database. Each stream has its own offset.

- The provider must enable change tracking on the source table.
- To create a stream, you must have the `CREATE` privilege on the local database.
- In self-hosted Databend, the license must also include the stream feature.

### 1. Enable Change Tracking

In the provider session, run this statement:

```sql
ALTER TABLE orders_db.orders SET OPTIONS(change_tracking = true);
```

### 2. Create a Local Database

In the consumer session, run this statement:

```sql
CREATE DATABASE local_analytics;
```

### 3. Create the Stream

```sql
CREATE STREAM local_analytics.order_changes ON TABLE shared_orders.orders;
```

The default stream mode is append-only. For a standard stream, add `APPEND_ONLY = false`.

### 4. Consume the Changes

```sql
CREATE TABLE local_analytics.order_sink (id INT, region STRING, amount INT);

INSERT INTO local_analytics.order_sink
    SELECT id, region, amount FROM local_analytics.order_changes;
```

A `SELECT` statement alone does not move the offset. A successful `INSERT` moves the offset of this stream only.

The stream becomes invalid in these conditions:

- The provider drops the source table.
- You drop the shared database.
- Change tracking on the source table stops for a period.

In these conditions, create the stream again. For the stream syntax, see [CREATE STREAM](/sql/sql-commands/ddl/stream/create-stream).

## Drop a Shared Database

:::warning
When you drop a shared database, the streams on it become invalid. A new database with the same name does not repair these streams.
:::

```sql
DROP DATABASE shared_orders;
```

This statement does not delete the provider data. In self-hosted Databend, this statement does not require the `DataSharing` license feature.
