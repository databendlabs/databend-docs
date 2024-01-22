```
---
title: ARRAY_APPLY
---

别名为 [ARRAY_TRANSFORM](array-transform.md)。

## 语法 {#syntax}

```sql
ARRAY_APPLY( <array>, <lambda> )
```

## 示例 {#examples}

```sql
SELECT ARRAY_APPLY([1, 2, 3], x -> x + 1);

┌──────────────────────────────────────┐
│ array_apply([1, 2, 3], x -> (x + 1)) │
├──────────────────────────────────────┤
│ [2,3,4]                              │
└──────────────────────────────────────┘
```
```