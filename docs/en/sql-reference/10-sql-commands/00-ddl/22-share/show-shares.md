---
title: SHOW SHARES
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Shows the Shares of the current tenant (`OUTBOUND`) and the Shares that give access to the current tenant (`INBOUND`).

## Syntax

```sql
SHOW SHARES [ LIKE '<pattern>' ] [ LIMIT <rows> ]
```

`LIKE` filters the Share names. `WHERE` is not supported.

## Output

| Column | Description |
| --- | --- |
| `created_on` | The time of creation. |
| `kind` | `OUTBOUND` or `INBOUND`. |
| `owner_account` | The provider tenant ID. |
| `name` | The Share name. |
| `database_name` | The name of the granted database. Empty if the Share does not grant a database. |
| `to` | The consumer accounts. Empty for `INBOUND` Shares. |
| `owner` | Not used. Always empty. |
| `comment` | The comment. |
| `listing_global_name` | Not used. Always empty. |

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
SHOW SHARES;
SHOW SHARES LIKE 'sales%' LIMIT 10;
```
