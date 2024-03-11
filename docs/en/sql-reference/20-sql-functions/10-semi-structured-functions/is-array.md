---
title: IS_ARRAY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.368"/>

Checks if the input JSON value is an array.

## Syntax

```sql
IS_ARRAY( <expr> )
```

## Return Type

Returns `true` if the input JSON value is an array, and `false` otherwise.

## Examples

```sql
SELECT
  IS_ARRAY(PARSE_JSON('true')),
  IS_ARRAY(PARSE_JSON('[1,2,3]'));

┌────────────────────────────────────────────────────────────────┐
│ is_array(parse_json('true')) │ is_array(parse_json('[1,2,3]')) │
├──────────────────────────────┼─────────────────────────────────┤
│ false                        │ true                            │
└────────────────────────────────────────────────────────────────┘
```