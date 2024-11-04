---
title: JSON_ARRAY_REDUCE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

Reduces a JSON array to a single value by applying a specified Lambda expression. For more information about Lambda expression, see [Lambda Expressions](../../00-sql-reference/42-lambda-expressions.md).

## Syntax

```sql
JSON_ARRAY_REDUCE(<json_array>, <lambda_expression>)
```

## Examples

This example multiplies all the elements in the array (2 _ 3 _ 4):

```sql
SELECT JSON_ARRAY_REDUCE(
    [2, 3, 4]::JSON,
    (acc, d) -> acc::Int * d::Int
);

-[ RECORD 1 ]-----------------------------------
json_array_reduce([2, 3, 4]::VARIANT, (acc, d) -> acc::Int32 * d::Int32): 24
```
