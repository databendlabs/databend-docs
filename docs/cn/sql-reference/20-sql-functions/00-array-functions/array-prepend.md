---
title: ARRAY_PREPEND
---

将元素添加到数组的开头。

## 句法

```sql
ARRAY_PREPEND( <element>, <array> )
```

## 示例

```sql
SELECT ARRAY_PREPEND(1, [3, 4]);

┌──────────────────────────┐
│ array_prepend(1, [3, 4]) │
├──────────────────────────┤
│ [1,3,4]                  │
└──────────────────────────┘
```