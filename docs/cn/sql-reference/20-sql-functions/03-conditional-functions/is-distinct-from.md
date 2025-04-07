---
title: "IS [ NOT ] DISTINCT FROM"
---

比较两个表达式是否相等（或不相等），同时感知可空性，这意味着它将 NULL 视为比较相等性的已知值。

## 句法

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