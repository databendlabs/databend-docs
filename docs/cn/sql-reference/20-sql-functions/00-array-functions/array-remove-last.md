---
title: ARRAY_REMOVE_LAST
---

移除数组的最后一个元素。

## 语法

```sql
ARRAY_REMOVE_LAST( <array> )
```

## 示例

```sql
SELECT ARRAY_REMOVE_LAST([1, 2, 3]);

┌──────────────────────────────┐
│ array_remove_last([1, 2, 3]) │
├──────────────────────────────┤
│ [1,2]                        │
└──────────────────────────────┘
```
