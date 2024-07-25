---
title: "IS [ NOT ] DISTINCT FROM"
---

比较两个表达式是否相等（或不相等），并考虑了可空性，即在比较相等性时将 NULL 视为已知值。

## 语法

```sql
<expr1> IS [ NOT ] DISTINCT FROM <expr2>
```

## 示例

```sql
SELECT NULL IS DISTINCT FROM NULL;

┌────────────────────────────┐
│ null is distinct from null │
├────────────────────────────┤
│ false                      │
└────────────────────────────┘
```