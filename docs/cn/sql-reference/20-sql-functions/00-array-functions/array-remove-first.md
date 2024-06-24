---
title: ARRAY_REMOVE_FIRST
---

移除数组中的第一个元素。

## 语法

```sql
ARRAY_REMOVE_FIRST( <array> )
```

## 示例

```sql
SELECT ARRAY_REMOVE_FIRST([1, 2, 3]);

┌───────────────────────────────┐
│ array_remove_first([1, 2, 3]) │
├───────────────────────────────┤
│ [2,3]                         │
└───────────────────────────────┘
```
