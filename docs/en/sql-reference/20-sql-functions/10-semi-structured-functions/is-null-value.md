---
title: IS_NULL_VALUE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.368"/>

Checks if the input JSON value is NULL.

## Syntax

```sql
IS_NULL_VALUE( <expr> )
```

## Return Type

Returns `true` if the input JSON value is NULL, and `false` otherwise.

## Examples

```sql
SELECT
  IS_NULL_VALUE(PARSE_JSON('null')),
  IS_NULL_VALUE(PARSE_JSON('[1,2,3]'));

┌──────────────────────────────────────────────────────────────────────────┐
│ is_null_value(parse_json('null')) │ is_null_value(parse_json('[1,2,3]')) │
├───────────────────────────────────┼──────────────────────────────────────┤
│ true                              │ false                                │
└──────────────────────────────────────────────────────────────────────────┘
```