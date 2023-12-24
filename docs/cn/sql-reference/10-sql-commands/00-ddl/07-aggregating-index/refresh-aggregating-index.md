---
title: REFRESH AGGREGATING INDEX
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='AGGREGATING INDEX'/>

Manually refreshes an aggregating index. For more information about the refresh mechanisms, see [Refreshing Aggregating Index](index.md#refreshing-aggregating-index).

## Syntax

```sql
REFRESH AGGREGATING INDEX <index_name> [LIMIT <limit>]
```

The "LIMIT" parameter allows you to control the maximum number of blocks that can be updated with each refresh action. It is strongly recommended to use this parameter with a defined limit to optimize memory usage. Please also note that setting a limit may result in partial data updates. For example, if you have 100 blocks but set a limit of 10, a single refresh might not update the most recent data, potentially leaving some blocks unrefreshed. You may need to execute multiple refresh actions to ensure a complete update.

## Examples

This example creates and refreshes an aggregating index named *my_agg_index*:

```sql
-- Prepare data
CREATE TABLE agg(a int, b int, c int);
INSERT INTO agg VALUES (1,1,4), (1,2,1), (1,2,4);

-- Create an aggregating index
CREATE AGGREGATING INDEX my_agg_index AS SELECT MIN(a), MAX(c) FROM agg;

-- Insert new data
INSERT INTO agg VALUES (2,2,5);

-- Refresh the aggregating index
REFRESH AGGREGATING INDEX my_agg_index;
```