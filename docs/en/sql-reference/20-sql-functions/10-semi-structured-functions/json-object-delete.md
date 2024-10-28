---
title: JSON_OBJECT_DELETE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.650"/>

Deletes specified keys from a JSON object and returns the modified object. If a specified key doesn't exist in the object, it is ignored.

## Syntax

```sql
json_object_delete(<json_object>, <key1> [, <key2>, ...])
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| json_object | A JSON object (VARIANT type) from which to delete keys. |
| key1, key2, ... | One or more string literals representing the keys to be deleted from the object. |

## Return Type

Returns a VARIANT containing the modified JSON object with specified keys removed.

## Examples

Delete a single key:
```sql
SELECT json_object_delete('{"a":1,"b":2,"c":3}'::VARIANT, 'a');
-- Result: {"b":2,"c":3}
```

Delete multiple keys:
```sql
SELECT json_object_delete('{"a":1,"b":2,"d":4}'::VARIANT, 'a', 'c');
-- Result: {"b":2,"d":4}
```

Delete a non-existent key (key is ignored):
```sql
SELECT json_object_delete('{"a":1,"b":2}'::VARIANT, 'x');
-- Result: {"a":1,"b":2}
```
