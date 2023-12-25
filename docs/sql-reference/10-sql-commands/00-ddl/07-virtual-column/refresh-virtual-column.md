---
title: REFRESH VIRTUAL COLUMN
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Refreshes virtual columns for a table. When the `enable_refresh_virtual_column_after_write` setting is configured to 1 (default), Databend automatically updates virtual columns for a table following data updates to the table.

## Syntax

```sql
REFRESH VIRTUAL COLUMN FOR <table>
```

## Examples

This example refreshes virtual columns for a table named 'test':

```sql
REFRESH VIRTUAL COLUMN FOR test;
```