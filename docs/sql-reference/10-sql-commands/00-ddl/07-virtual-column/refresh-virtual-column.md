---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Refreshes virtual columns for a table. Virtual columns needs refreshing in the following scenarios:

- After creating virtual columns for a table that already contains Variant data, it is necessary to refresh the virtual columns.
- When modifying virtual columns for a table, refresh them after the modifications.
- If the `enable_refresh_virtual_column_after_write` setting is set to 1 (default), virtual columns for a table are automatically refreshed after data updates. However, if this setting is not enabled, manual refreshing of virtual columns becomes necessary.

## Syntax

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## Examples

This example refreshes virtual columns for a table named 'test':

```sql
REFRESH VIRTUAL COLUMN FOR test;
```