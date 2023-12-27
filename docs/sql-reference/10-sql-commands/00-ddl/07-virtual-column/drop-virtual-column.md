---
title: DROP VIRTUAL COLUMN
sidebar_position: 5
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.271"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Deletes virtual columns created for a table.

## Syntax

```sql
DROP VIRTUAL COLUMN [IF EXISTS] FOR <table>
```

## Examples

This example deletes virtual columns created for a table named 'test':

```sql
DROP VIRTUAL COLUMN FOR test;
```