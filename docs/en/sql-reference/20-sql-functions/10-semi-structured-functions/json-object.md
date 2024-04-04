/---
title: JSON_OBJECT
title_includes: TRY_JSON_OBJECT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.402"/>

Creates a JSON object with keys and values.

- The arguments are zero or more key-value pairs(where keys are strings, and values are of any type).
- If a key or value is NULL, the key-value pair is ommitted from the resulting object.
- The keys must be distinct from each other, and their order in the resulting JSON might be different from the order you specify.
- `TRY_JSON_OBJECT` returns a NULL value if an error occurs when building the object.

See also: [JSON_OBJECT_KEEP_NULL](json-object-keep-null.md)

## Syntax

```sql
JSON_OBJECT(key1, value1[, key2, value2[, ...]])

TRY_JSON_OBJECT(key1, value1[, key2, value2[, ...]])
```

## Return Type

JSON object.

## Examples

```sql
SELECT JSON_OBJECT();
┌───────────────┐
│ json_object() │
├───────────────┤
│ {}            │
└───────────────┘

SELECT JSON_OBJECT('a', 3.14, 'b', 'xx', 'c', NULL);
┌──────────────────────────────────────────────┐
│ json_object('a', 3.14, 'b', 'xx', 'c', null) │
├──────────────────────────────────────────────┤
│ {"a":3.14,"b":"xx"}                          │
└──────────────────────────────────────────────┘

SELECT JSON_OBJECT('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']);
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ json_object('fruits', ['apple', 'banana', 'orange'], 'vegetables', ['carrot', 'celery']) │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ {"fruits":["apple","banana","orange"],"vegetables":["carrot","celery"]}                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘

SELECT JSON_OBJECT('key');
  |
1 | SELECT JSON_OBJECT('key')
  |        ^^^^^^^^^^^^^^^^^^ The number of keys and values must be equal while evaluating function `json_object('key')`


SELECT TRY_JSON_OBJECT('key');
┌────────────────────────┐
│ try_json_object('key') │
├────────────────────────┤
│ NULL                   │
└────────────────────────┘
```

