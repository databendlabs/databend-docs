---
title: JSON_OBJECT_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.647"/>

Inserts or updates a key-value pair in a JSON object.

## Syntax

```sql
JSON_OBJECT_INSERT(<json_object>, <key>, <value>[, <update_flag>])
```

| Parameter           | Description                                                                                                                                                                                                                                          |   |
|---------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| `<json_object>`     | The input JSON object.                                                                                                                                                                                                                               |   |
| `<key>`             | The key to be inserted or updated.                                                                                                                                                                                                                   |   |
| `<value>`           | The value to assign to the key.                                                                                                                                                                                                                      |   |
| `<update_flag>` | A boolean flag that controls whether to replace the value if the specified key already exists in the JSON object. If `true`, the function replaces the value if the key already exists. If `false`  (or omitted), an error occurs if the key exists. |   |

## Return Type

Returns the updated JSON object.

## Examples

This example demonstrates how to insert a new key 'c' with the value 3 into the existing JSON object:

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'c', 3);

┌────────────────────────────────────────────────────────────┐
│ json_object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'c', 3) │
├────────────────────────────────────────────────────────────┤
│ {"a":1,"b":2,"c":3,"d":4}                                  │
└────────────────────────────────────────────────────────────┘
```

This example shows how to update the value of an existing key 'a' from 1 to 10 using the update flag set to `true`, allowing the key's value to be replaced:

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10, true);

┌───────────────────────────────────────────────────────────────────┐
│ json_object_insert('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 10, TRUE) │
├───────────────────────────────────────────────────────────────────┤
│ {"a":10,"b":2,"d":4}                                              │
└───────────────────────────────────────────────────────────────────┘
```

This example demonstrates an error that occurs when trying to insert a value for an existing key 'a' without specifying the update flag set to `true`:

```sql
SELECT JSON_OBJECT_INSERT('{"a":1,"b":2,"d":4}'::variant, 'a', 10);

error: APIError: ResponseError with 1006: ObjectDuplicateKey while evaluating function `json_object_insert('{"a":1,"b":2,"d":4}', 'a', 10)` in expr `json_object_insert('{"a":1,"b":2,"d":4}', 'a', 10)`
```