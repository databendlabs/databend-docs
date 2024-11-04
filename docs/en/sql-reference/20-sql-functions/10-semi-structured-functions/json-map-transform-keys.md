---
title: JSON_MAP_TRANSFORM_KEYS
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

Applies a transformation to each key in a JSON object using a [lambda expression](../../00-sql-reference/42-lambda-expressions.md).

## Syntax

```sql
JSON_MAP_TRANSFORM_KEYS(<json_object>, (<key>, <value>) -> <key_transformation>)
```

## Return Type

Returns a JSON object with the same values as the input JSON object, but with keys modified according to the specified lambda transformation.

## Examples

This example appends "_v1" to each key, creating a new JSON object with modified keys:

```sql
SELECT JSON_MAP_TRANSFORM_KEYS('{"name":"John", "role":"admin"}'::VARIANT, (k, v) -> CONCAT(k, '_v1')) AS versioned_metadata;

┌──────────────────────────────────────┐
│          versioned_metadata          │
├──────────────────────────────────────┤
│ {"name_v1":"John","role_v1":"admin"} │
└──────────────────────────────────────┘
```