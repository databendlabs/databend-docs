---
title: DESCRIBE SHARE
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Shows the database and the tables that a Share grants. `DESC SHARE` is an alias.

## Syntax

```sql
DESC[RIBE] SHARE [ <provider_tenant>. ]<share_name>
```

- For a Share of the current tenant, do not use `provider_tenant`.
- For a Share of a different provider, use its tenant ID. The current tenant must be a consumer account of the Share.

## Output

| Column | Description |
| --- | --- |
| `kind` | `DATABASE` or `TABLE`. |
| `name` | The database name, or `<database>.<table>` for a table. |
| `shared_on` | The time of the grant. |

If the provider dropped a table, its grant can show an incomplete name. This grant does not give access to a new table with the same name.

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
-- Provider tenant
DESCRIBE SHARE sales_share;

-- Consumer tenant
DESC SHARE provider_acct.sales_share;
```
