---
title: CREATE VIRTUAL COLUMN
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Creates virtual columns for a table.

## Syntax

```sql
CREATE VIRTUAL COLUMN [IF NOT EXISTS] (<virtual_column_1>, <virtual_column_2>, ...) FOR <table>
```

## Examples

