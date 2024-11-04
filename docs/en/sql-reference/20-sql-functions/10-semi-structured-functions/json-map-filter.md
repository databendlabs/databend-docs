---
title: JSON_MAP_FILTER
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

Filters key-value pairs in a JSON object based on a specified condition, defined using a [lambda expression](../../00-sql-reference/42-lambda-expressions.md).

## Syntax

```sql
JSON_MAP_FILTER(<json_object>, (<key>, <value>) -> <condition>)
```

## Return Type

Returns a JSON object with only the key-value pairs that satisfy the specified condition.

## Examples

This example extracts only the `"status": "active"` key-value pair from the JSON object, filtering out the other fields:

```sql
SELECT JSON_MAP_FILTER('{"status":"active", "user":"admin", "time":"2024-11-01"}'::VARIANT, (k, v) -> k = 'status') AS filtered_metadata;

┌─────────────────────┐
│  filtered_metadata  │
├─────────────────────┤
│ {"status":"active"} │
└─────────────────────┘
```