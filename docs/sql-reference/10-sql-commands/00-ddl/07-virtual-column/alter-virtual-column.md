---
title: ALTER VIRTUAL COLUMN
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Modifies virtual columns for a table. Please note that after modifying virtual columns for a table, refresh them using the [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) command.

## Syntax

```sql
ALTER VIRTUAL COLUMN [IF EXISTS] (<virtual_column_1>, <virtual_column_2>, ...) FOR <table>
```

## Examples

```sql
-- Create a table named 'test' with columns 'id' and 'val' of type Variant.
CREATE TABLE test(id int, val variant);

-- Insert a sample record into the 'test' table with Variant data.
INSERT INTO
  test
VALUES
  (
    1,
    '{"id":1,"name":"databend","tags":["powerful","fast"],"pricings":[{"type":"Standard","price":"Pay as you go"},{"type":"Enterprise","price":"Custom"}]}'
  );

-- Create virtual columns for specific elements in the 'val' column.
CREATE VIRTUAL COLUMN (
  val ['name'],                 -- Extract the 'name' field.
  val ['tags'] [0],             -- Extract the first element in the 'tags' array.
  val ['pricings'] [0] ['type'] -- Extract the 'type' field from the first pricing in the 'pricings' array.
) FOR test;

SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────────────────────────────────────────────┐
│ database │  table │                     virtual_columns                     │
├──────────┼────────┼─────────────────────────────────────────────────────────┤
│ default  │ test   │ val['name'], val['pricings'][0]['type'], val['tags'][0] │
└─────────────────────────────────────────────────────────────────────────────┘


-- Modify virtual columns to contain "val ['name']" only

ALTER VIRTUAL COLUMN (
  val ['name']
) FOR test;

SHOW VIRTUAL COLUMNS;

┌─────────────────────────────────────┐
│ database │  table │ virtual_columns │
├──────────┼────────┼─────────────────┤
│ default  │ test   │ val['name']     │
└─────────────────────────────────────┘

REFRESH VIRTUAL COLUMN FOR test;
```