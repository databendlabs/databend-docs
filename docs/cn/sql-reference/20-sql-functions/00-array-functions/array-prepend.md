---
title: ARRAY_PREPEND
---

将元素添加到数组的开头。

## Syntax

```sql
ARRAY_PREPEND( <element>, <array> )
```

## Examples

```sql
SELECT ARRAY_PREPEND(1, [3, 4]);

┌──────────────────────────┐
│ array_prepend(1, [3, 4]) │
├──────────────────────────┤
│ [1,3,4]                  │
└──────────────────────────┘
```