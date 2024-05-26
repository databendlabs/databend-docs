---
title: ARRAY_APPLY
---

是 [ARRAY_TRANSFORM](array-transform.md) 的别名。

## 语法

```sql
ARRAY_APPLY( <array>, <lambda> )
```

## 示例

```sql
SELECT ARRAY_APPLY([1, 2, 3], x -> x + 1);

┌──────────────────────────────────────┐
│ array_apply([1, 2, 3], x -> (x + 1)) │
├──────────────────────────────────────┤
│ [2,3,4]                              │
└──────────────────────────────────────┘
```