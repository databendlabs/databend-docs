---
title: NULLIF
---

如果两个表达式相等，则返回 NULL。 否则返回 expr1。 它们必须具有相同的数据类型。

## Syntax

```sql
NULLIF(<expr1>, <expr2>)
```

## Examples

```sql
SELECT NULLIF(0, NULL);

┌─────────────────┐
│ nullif(0, null) │
├─────────────────┤
│               0 │
└─────────────────┘
```