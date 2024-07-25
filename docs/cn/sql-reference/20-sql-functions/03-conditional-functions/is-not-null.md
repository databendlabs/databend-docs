---
title: IS_NOT_NULL
---

检查一个值是否不为 NULL。

## 语法

```sql
IS_NOT_NULL(<expr>)
```

## 示例

```sql
SELECT IS_NOT_NULL(1);

┌────────────────┐
│ is_not_null(1) │
├────────────────┤
│ true           │
└────────────────┘
```