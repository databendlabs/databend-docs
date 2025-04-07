---
title: IS_NOT_NULL
---

检查一个值是否不是 NULL。

## 句法

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