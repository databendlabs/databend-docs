---
title: DROP SHARE
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.949"/>

<EEFeature featureName='Data Sharing'/>

Drops a Share in the provider tenant.

## Syntax

```sql
DROP SHARE [ IF EXISTS ] <share_name>
```

## Usage Notes

- This statement does not drop the provider databases, tables, or connections.
- The shared databases of the consumers stay, but reads fail.
- A new Share with the same name is a different Share. It does not repair the shared databases.
- To drop a shared database, use `DROP DATABASE` in the consumer tenant.

For the privileges, see [Access Control](/guides/data-management/data-sharing#access-control).

## Examples

```sql
DROP SHARE IF EXISTS sales_share;
```
