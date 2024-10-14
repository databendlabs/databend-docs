---
title: JSON_ARRAY_TRANSFORM
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

Transforms each element of a JSON array using a specified transformation expression.

## Syntax

```sql
JSON_ARRAY_TRANSFORM(<json_array>, <transform_expression>)
```

## Return Type

JSON array.

## Examples

In this example, each numeric element in the array is multiplied by 10, transforming the original array into `[10, 20, 30, 40]`:

```sql
SELECT JSON_ARRAY_TRANSFORM(
    [1, 2, 3, 4]::JSON,
    data -> (data::Int * 10)
);

-[ RECORD 1 ]-----------------------------------
json_array_transform([1, 2, 3, 4]::VARIANT, data -> data::Int32 * 10): [10,20,30,40]
```