---
title: TO_BOOLEAN
---

将值转换为 BOOLEAN 数据类型。

## 句法

```sql
TO_BOOLEAN( <expr> )
```

## 示例

```sql
SELECT TO_BOOLEAN('true');

┌────────────────────┐
│ to_boolean('true') │
├────────────────────┤
│ true               │
└────────────────────┘
```