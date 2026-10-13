---
title: Manage Shares
sidebar_label: Manage Shares
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Do these operations in the provider tenant. For the required privileges, see [Access Control](index.md#access-control).

Changes apply to subsequent queries. A query that is in progress continues.

## Manage Consumer Accounts

| Statement | Result |
| --- | --- |
| `ALTER SHARE sales_share ADD ACCOUNTS = a, b` | Adds the accounts. The accounts in the list stay. |
| `ALTER SHARE sales_share REMOVE ACCOUNTS = a` | Removes the accounts. The other accounts stay. |
| `ALTER SHARE sales_share SET ACCOUNTS = a, b` | Replaces the full list. The accounts that are not in the statement lose access. |

:::caution
`SET ACCOUNTS` replaces the full list. To add or remove one account, use `ADD ACCOUNTS` or `REMOVE ACCOUNTS`.
:::

When you remove an account, the consumer cannot read the shared database. When you add the account again, the consumer can read the shared database again.

### Configure an Empty Share

You can create a Share without a connection:

```sql
CREATE SHARE pending_share;
```

Then set the accounts and the connection in one statement:

```sql
ALTER SHARE pending_share SET
    ACCOUNTS = consumer_acct
    CONNECTION = share_conn
    COMMENT = 'Ready for consumers';
```

`ADD ACCOUNTS` and `SET ACCOUNTS` require a connection. `SET` can set the connection in the same statement.

## Change the Connection {/* #change-the-connection */}

Use this procedure to change the credentials. The consumers keep access.

1. Create a new connection. Use the same storage type as the granted tables.
2. Set the new connection on the Share:

   ```sql
   ALTER SHARE sales_share SET CONNECTION = replacement_conn;
   ```

Databend examines the new connection for all granted tables. If the examination fails, the Share keeps the old connection.

Do not drop the old connection before step 2. If Databend cannot find the connection, reads fail.

:::note
This procedure changes the credentials for consumer reads only. A table with an external location keeps a copy of its connection settings. To change the credentials of the provider table, use [ALTER TABLE ... CONNECTION](/sql/sql-commands/ddl/table/alter-table#external-table-connection).
:::

## Change the Grants

Use the current object names in `GRANT` and `REVOKE` statements.

To stop sharing one table, run this statement:

```sql
REVOKE SELECT ON TABLE orders_db.orders FROM SHARE sales_share;
```

The other table grants stay. To give access again, grant the same table again.

:::caution
When you revoke `USAGE` on the database, Databend also removes all table grants from the Share.
:::

```sql
REVOKE USAGE ON DATABASE orders_db FROM SHARE sales_share;
```

To give access again, grant the database. Then grant each table.

After a rename, revoke the new name. A `REVOKE` statement on an old name or on a dropped object does nothing.

After the provider drops a table, its grant can stay in the Share. `DESCRIBE SHARE` can show this grant with an incomplete name. This grant does not give access to a new table with the same name.

## Lifecycle and Recovery {/* #lifecycle-and-recovery */}

| Provider operation | Result for the consumer | Recovery |
| --- | --- | --- |
| Inserts data. | Subsequent queries show the new data. | Not necessary. |
| Renames a table. | The shared database shows the new name. | Use the new name in queries. |
| Renames the database. | The shared database continues to operate. Its name does not change. | Not necessary. |
| Revokes `SELECT` on a table. | The consumer cannot read the table. | Grant the same table again. |
| Revokes `USAGE` on the database. | The consumer cannot read the shared database. All table grants are removed. | Grant the database and each table again. |
| Removes the consumer account. | The consumer cannot read the shared database. | Add the account again. |
| Sets a compatible connection. | Reads use the new credentials. | Not necessary. |
| Drops the connection. | Reads fail. | Create the connection again, or set a different connection. |
| Adds a row access policy or a masking policy to a shared table. | Databend rejects the operation. | Not applicable. |
| Drops a table and creates it again. | The new table is a different object. The old grant does not apply to it. | Grant the new table. The consumer creates its streams again. |
| Drops the database and creates it again. | The shared database stops operation. | Grant the new database and tables. The consumer creates the shared database again. |
| Drops the Share or replaces it. | The shared database stops operation. | Configure the new Share. The consumer creates the shared database again. |

### Create the Shared Database Again

Before you start, configure the Share, the grants, and the consumer account on the provider side.

:::warning
This procedure drops the shared database. The streams on this database become invalid. The provider data does not change.
:::

1. In the consumer session, drop the shared database:

   ```sql
   DROP DATABASE shared_orders;
   ```

2. Create the shared database from the current Share:

   ```sql
   CREATE DATABASE shared_orders FROM SHARE provider_acct.sales_share;
   ```

3. Create the streams again.

`CREATE DATABASE IF NOT EXISTS` does not repair a shared database that exists.

## Drop a Share

```sql
DROP SHARE sales_share;
```

This statement does not drop the provider tables or the connection. The shared databases of the consumers stay, but reads fail.

A new Share with the same name is a different Share. It does not repair the shared databases.

For errors, see [Troubleshooting](04-troubleshooting.md). For the full syntax, see the [Share SQL Reference](/sql/sql-commands/ddl/share).
