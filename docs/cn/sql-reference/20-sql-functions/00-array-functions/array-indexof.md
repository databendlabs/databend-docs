---
title: ARRAY_INDEXOF
---

如果数组包含该元素，则返回该元素的索引（从 1 开始）。

## Syntax

```sql
ARRAY_INDEXOF( <array>, <element> )
```

## Examples

```sql
SELECT ARRAY_INDEXOF([1, 2, 9], 9);

┌─────────────────────────────┐
│ array_indexof([1, 2, 9], 9) │
├─────────────────────────────┤
│                           3 │
└─────────────────────────────┘
```