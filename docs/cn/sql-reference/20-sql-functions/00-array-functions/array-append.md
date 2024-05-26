---
title: ARRAY_APPEND
---

在数组前端添加一个元素。

## 语法

```sql
ARRAY_APPEND( <array>, <element>)
```

## 示例

```sql
SELECT ARRAY_APPEND([3, 4], 5);

┌─────────────────────────┐
│ array_append([3, 4], 5) │
├─────────────────────────┤
│ [3,4,5]                 │
└─────────────────────────┘
```