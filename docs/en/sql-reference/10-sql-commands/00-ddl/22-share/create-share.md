---
title: CREATE SHARE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Creates a Share in the provider tenant.

## Syntax

```sql
CREATE [ OR REPLACE ] SHARE [ IF NOT EXISTS ] <share_name>
    [ CONNECTION = <connection_name> ]
    [ COMMENT = '<comment>' ]
```

| Parameter | Description |
| --- | --- |
| `share_name` | The name of the Share. The name must be unique in the tenant. |
| `CONNECTION` | A connection in the provider tenant. Its storage type must be the same as the storage type of the tables that you grant. |
| `COMMENT` | A description of the Share. |

## Usage Notes

- A new Share does not grant objects or consumer accounts. Use [GRANT TO SHARE](grant-share.md) and [ALTER SHARE](alter-share.md).
- You can create a Share without a connection. Set a connection before you grant tables or add consumer accounts.
- You cannot use `OR REPLACE` and `IF NOT EXISTS` in the same statement.

:::caution
`OR REPLACE` creates a new Share. The shared databases of the consumers stop operation. Do not use `OR REPLACE` to change credentials. Use `ALTER SHARE ... SET CONNECTION`.
:::

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
CREATE SHARE sales_share
    CONNECTION = share_conn
    COMMENT = 'Shared order data';
```
