---
title: ALTER SHARE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Changes the consumer accounts, the connection, or the comment of a Share.

## Syntax

```sql
ALTER SHARE [ IF EXISTS ] <share_name>
    ADD ACCOUNTS = <tenant_id> [, <tenant_id> ... ]

ALTER SHARE [ IF EXISTS ] <share_name>
    REMOVE ACCOUNTS = <tenant_id> [, <tenant_id> ... ]

ALTER SHARE [ IF EXISTS ] <share_name> SET
    [ ACCOUNTS = <tenant_id> [, <tenant_id> ... ] ]
    [ CONNECTION = <connection_name> ]
    [ COMMENT = '<comment>' ]
```

| Clause | Description |
| --- | --- |
| `ADD ACCOUNTS` | Adds consumer accounts. The accounts in the list stay. |
| `REMOVE ACCOUNTS` | Removes consumer accounts. The other accounts stay. |
| `SET ACCOUNTS` | Replaces the full list of consumer accounts. |
| `SET CONNECTION` | Replaces the connection. The consumers keep access. |
| `SET COMMENT` | Replaces the comment. |

## Usage Notes

- A tenant ID is not a user name or a role name. To get a tenant ID, use [CURRENT_TENANT_ID](/sql/sql-functions/context-functions/current-tenant-id).
- If a tenant ID contains uppercase letters or special characters, put the ID in backticks.
- `ADD ACCOUNTS` and `SET ACCOUNTS` require a connection. `SET` can set the connection in the same statement.
- `SET` requires one or more properties.
- Databend examines a new connection for all granted tables. If the examination fails, the Share keeps the old connection.

:::caution
`SET ACCOUNTS` replaces the full list. The accounts that are not in the statement lose access.
:::

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control). For the procedures, see [Manage Shares](/guides/data-management/data-sharing/manage-shares).

## Examples

```sql
ALTER SHARE sales_share ADD ACCOUNTS = consumer_acct, `consumer-tenant`;
ALTER SHARE sales_share REMOVE ACCOUNTS = `consumer-tenant`;
ALTER SHARE sales_share SET ACCOUNTS = consumer_acct;
ALTER SHARE sales_share SET CONNECTION = replacement_conn;
ALTER SHARE sales_share SET COMMENT = 'Updated description';
```
