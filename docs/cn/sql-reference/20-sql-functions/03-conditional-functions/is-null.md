---
title: IS_NULL
---

检查一个值是否为 NULL。

## 语法

```sql
IS_NULL(<expr>)
```

## 示例

```sql
SELECT IS_NULL(1);

┌────────────┐
│ is_null(1) │
├────────────┤
│ false      │
└────────────┘
```