---
title: TO_BOOLEAN
---

将一个值转换为 BOOLEAN 数据类型。

## 语法

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