---
title: MAP_TRANSFORM_VALUES
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

Applies a transformation to each value in a map using a [lambda expression](../../00-sql-reference/42-lambda-expressions.md).

## Syntax

```sql
MAP_TRANSFORM_VALUES(<map>, (<key>, <value>) -> <value_transformation>)
```

## Return Type

Returns a map with the same keys as the input map but with values modified according to the specified lambda transformation.

## Examples

This example reduces each product's price by 10%, while the product IDs (keys) remain unchanged:

```sql
SELECT MAP_TRANSFORM_VALUES({101: 100.0, 102: 150.0, 103: 200.0}, (product_id, price) -> price * 0.9) AS discounted_prices;

┌───────────────────────────────────┐
│         discounted_prices         │
├───────────────────────────────────┤
│ {101:90.00,102:135.00,103:180.00} │
└───────────────────────────────────┘
```