---
title: MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

Filters key-value pairs from a map using a [lambda expression](../../00-sql-reference/42-lambda-expressions.md) to define the condition.

## Syntax

```sql
MAP_FILTER(<map>, (<key>, <value>) -> <condition>)
```

## Return Type

Returns a map that includes only the key-value pairs meeting the condition specified by the lambda expression.

## Examples

This example returns a map containing only the products with stock quantities below 10:

```sql
SELECT MAP_FILTER({101:15, 102:8, 103:12, 104:5}, (product_id, stock) -> (stock < 10)) AS low_stock_products;

┌────────────────────┐
│ low_stock_products │
├────────────────────┤
│ {102:8,104:5}      │
└────────────────────┘
```