---
title: JSON_ARRAY_INSERT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.644"/>

Inserts a value into a JSON array at the specified index and returns the updated JSON array.

## Syntax

```sql
JSON_ARRAY_INSERT(<json_array>, <index>, <json_value>);
```

| Parameter      | Description                                                 |
|----------------|-------------------------------------------------------------|
| `<json_array>` | The JSON array to modify.                                   |
| `<index>`      | The position at which the value will be inserted (0-based). |
| `<json_value>` | The JSON value to insert into the array.                    |

## Return Type

JSON array.

## Examples

```sql
SELECT JSON_ARRAY_INSERT('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT);

-[ RECORD 1 ]-----------------------------------
json_array_insert('["task1", "task2", "task3"]'::VARIANT, 1, '"new_task"'::VARIANT): ["task1","new_task","task2","task3"]
```
