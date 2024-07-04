---
title: MAP_DELETE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.547"/>

Returns a MAP based on an existing MAP with one or more keys removed.

## Syntax

```sql
MAP_DELETE( <map>, <key1> [, <key2>, ... ] )
```

## Arguments

| Arguments | Description                                  |
|-----------|----------------------------------------------|
| `<map>`   | The MAP that contains the KEY to remove.     |
| `<keyN>`  | The KEY to be omitted from the returned MAP. |

:::note
- The type of the key expression must match the type of the map’s key.
- Key values that are not found in the map are ignored.
:::

## Return Type

Map.

## Examples

```sql
SELECT MAP_DELETE({'a':1,'b':2,'c':3}, 'a', 'c');
┌───────────────────────────────────────────┐
│ map_delete({'a':1,'b':2,'c':3}, 'a', 'c') │
├───────────────────────────────────────────┤
│ {'b':2}                                   │
└───────────────────────────────────────────┘
```
