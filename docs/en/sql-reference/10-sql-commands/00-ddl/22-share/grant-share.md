---
title: GRANT TO SHARE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Grants a database or a table of the provider to a Share.

## Syntax

```sql
GRANT USAGE ON DATABASE <database_name> TO SHARE <share_name>

GRANT SELECT ON TABLE [ <database_name>. ]<table_name> TO SHARE <share_name>
```

Only these two forms are supported. If you do not specify `database_name`, Databend uses the current database.

## Usage Notes

- Grant `USAGE` on the database first. Then grant `SELECT` on each table. `USAGE` alone does not give access to the tables.
- A Share can grant one database only. The tables must be in this database.
- The Share must have a connection before you grant a table.
- The table must be a FUSE table without row access policies or masking policies.
- You cannot grant a shared database.
- If you rename a table, the grant stays. If you drop a table and create it again, grant the new table.

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
GRANT USAGE ON DATABASE orders_db TO SHARE sales_share;
GRANT SELECT ON TABLE orders_db.orders TO SHARE sales_share;
```
