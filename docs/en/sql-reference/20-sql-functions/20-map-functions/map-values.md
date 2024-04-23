---
title: MAP_VALUES
---

Returns the values in a map.

## Syntax

```sql
MAP_VALUES( <map> )
```

## Examples

```sql
SELECT MAP_VALUES({'a':1,'b':2,'c':3});

┌─────────────────────────────────┐
│ map_values({'a':1,'b':2,'c':3}) │
│           Array(UInt8)          │
├─────────────────────────────────┤
│ [1,2,3]                         │
└─────────────────────────────────┘
```
