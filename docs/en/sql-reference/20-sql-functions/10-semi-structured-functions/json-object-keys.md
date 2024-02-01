---
title: JSON_OBJECT_KEYS
---

Returns an Array containing the list of keys in the input Variant OBJECT.


## Syntax

```sql
JSON_OBJECT_KEYS(<variant>)
```

## Arguments

| Arguments   | Description                               |
|-------------|-------------------------------------------|
| `<variant>` | The VARIANT value that contains an OBJECT |

## Aliases

- [OBJECT_KEYS](object-keys.md)

## Return Type

Array`<String>`

## Examples

```sql
CREATE TABLE IF NOT EXISTS objects_test1(id TINYINT, var VARIANT);

INSERT INTO
  objects_test1
VALUES
  (1, parse_json('{"a": 1, "b": [1,2,3]}'));

INSERT INTO
  objects_test1
VALUES
  (2, parse_json('{"b": [2,3,4]}'));

SELECT
  id,
  object_keys(var),
  json_object_keys(var)
FROM
  objects_test1;

┌────────────────────────────────────────────────────────────┐
│       id       │  object_keys(var) │ json_object_keys(var) │
├────────────────┼───────────────────┼───────────────────────┤
│              1 │ ["a","b"]         │ ["a","b"]             │
│              2 │ ["b"]             │ ["b"]                 │
└────────────────────────────────────────────────────────────┘
```