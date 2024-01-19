---
title: "IS [ NOT ] DISTINCT FROM"
---

比较两个表达式是否相等（或不相等），同时意识到可空性，即将 NULL 视为已知值来比较等同性。

## 语法 {/*syntax*/}

```sql
<expr1> IS [ NOT ] DISTINCT FROM <expr2>
```

## 示例 {/*examples*/}

```sql
SELECT NULL IS DISTINCT FROM NULL;

┌────────────────────────────┐
│ null is distinct from null │
├────────────────────────────┤
│ false                      │
└────────────────────────────┘
```