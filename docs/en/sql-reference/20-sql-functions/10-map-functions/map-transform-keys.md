---
title: MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

Applies a transformation to each key in a map using a [lambda expression](../../00-sql-reference/42-lambda-expressions.md).

## Syntax

```sql
MAP_TRANSFORM_KEYS(<map>, (<key>, <value>) -> <key_transformation>)
```

## Return Type

Returns a map with the same values as the input map but with keys modified according to the specified lambda transformation.

## Examples

This example adds 1,000 to each product ID, creating a new map with updated keys while keeping the associated prices the same:

```sql
SELECT MAP_TRANSFORM_KEYS({101: 29.99, 102: 45.50, 103: 15.00}, (product_id, price) -> product_id + 1000) AS updated_product_ids;

┌────────────────────────────────────┐
│         updated_product_ids        │
├────────────────────────────────────┤
│ {1101:29.99,1102:45.50,1103:15.00} │
└────────────────────────────────────┘
```