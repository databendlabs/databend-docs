---
title: JSON_ARRAY_DISTINCT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

Removes duplicate elements from a JSON array and returns an array with only distinct elements.

## Syntax

```sql
JSON_ARRAY_DISTINCT(<json_array>)
```

## Return Type

JSON array.

## Examples

```sql
SELECT JSON_ARRAY_DISTINCT('["apple", "banana", "apple", "orange", "banana"]'::VARIANT)

-[ RECORD 1 ]-----------------------------------
json_array_distinct('["apple", "banana", "apple", "orange", "banana"]'::VARIANT): ["apple","banana","orange"]
```
