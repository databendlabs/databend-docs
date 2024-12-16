---
title: CREATE VIRTUAL COLUMN
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.339"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='VIRTUAL COLUMN'/>

Creates virtual columns for a table. Please note that virtual columns exclusively support the [FUSE Engine](../../../00-sql-reference/30-table-engines/00-fuse.md), are designed for exclusive compatibility with the [Variant](../../../00-sql-reference/10-data-types/variant.md) data type. Refer to [Accessing Elements in JSON](../../../00-sql-reference/10-data-types/variant.md#accessing-elements-in-json) for column definition.

Please note that after creating virtual columns for a table that already contains Variant data, it is necessary to refresh the virtual columns using the [REFRESH VIRTUAL COLUMN](refresh-virtual-column.md) command.

## Syntax

```sql
CREATE [ OR REPLACE ] VIRTUAL COLUMN [ IF NOT EXISTS ] ( <virtual_column_1>, <virtual_column_2>, ... ) FOR <table>
```

## Examples

This example creates virtual columns for a table named 'test':

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

REFRESH VIRTUAL COLUMN FOR test;
```