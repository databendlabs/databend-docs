---
title: REVOKE FROM SHARE
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Revokes a database or a table from a Share. The source objects do not change.

## Syntax

```sql
REVOKE USAGE ON DATABASE <database_name> FROM SHARE <share_name>

REVOKE SELECT ON TABLE [ <database_name>. ]<table_name> FROM SHARE <share_name>
```

Only these two forms are supported. If you do not specify `database_name`, Databend uses the current database.

## Usage Notes

- `REVOKE SELECT` removes the grant for one table. The other table grants stay.
- Use the current object name. A `REVOKE` statement on an old name or on a dropped object does nothing.
- To remove a consumer and keep the grants, use `ALTER SHARE ... REMOVE ACCOUNTS`.

:::caution
`REVOKE USAGE` on the database also removes all table grants from the Share.
:::

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
REVOKE SELECT ON TABLE orders_db.orders FROM SHARE sales_share;
REVOKE USAGE ON DATABASE orders_db FROM SHARE sales_share;
```
