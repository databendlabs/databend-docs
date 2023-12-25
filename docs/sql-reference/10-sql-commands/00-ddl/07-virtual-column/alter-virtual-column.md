---
title: ALTER VIRTUAL COLUMN
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Modifies virtual columns created for a table.

## Syntax

```sql
ALTER VIRTUAL COLUMN [IF EXISTS] (<virtual_column_1>, <virtual_column_2>, ...) FOR <table>
```

## Examples

