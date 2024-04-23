---
title: MAP_KEYS
---

Returns the keys in a map.

## Syntax

```sql
MAP_KEYS( <map> )
```

## Examples

```sql
SELECT MAP_KEYS({'a':1,'b':2,'c':3});

┌───────────────────────────────┐
│ map_keys({'a':1,'b':2,'c':3}) │
│         Array(String)         │
├───────────────────────────────┤
│ ['a','b','c']                 │
└───────────────────────────────┘
```
