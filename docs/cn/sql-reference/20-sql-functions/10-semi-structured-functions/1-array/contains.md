---
title: CONTAINS
---

检查数组是否包含指定元素。

## 语法

```sql
CONTAINS( <array>, <element> )
```

## 别名

- [ARRAY_CONTAINS](array-contains.md)

## 示例

```sql
SELECT ARRAY_CONTAINS([1, 2], 1), CONTAINS([1, 2], 1);

┌─────────────────────────────────────────────────┐
│ array_contains([1, 2], 1) │ contains([1, 2], 1) │
├───────────────────────────┼─────────────────────┤
│ true                      │ true                │
└─────────────────────────────────────────────────┘
```