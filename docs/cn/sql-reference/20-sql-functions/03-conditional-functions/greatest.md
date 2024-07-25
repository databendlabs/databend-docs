---
title: GREATEST
---

从一组值中返回最大值。

## 语法

```sql
GREATEST(<value1>, <value2> ...)
```

## 示例

```sql
SELECT GREATEST(5, 9, 4);

┌───────────────────┐
│ greatest(5, 9, 4) │
├───────────────────┤
│                 9 │
└───────────────────┘
```