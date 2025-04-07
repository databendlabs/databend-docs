---
title: ARRAY_TO_STRING
---

使用指定的分隔符将数组元素连接成一个字符串。

## 句法

```sql
ARRAY_TO_STRING( <array>, '<separator>' )
```

## 示例

```sql
SELECT ARRAY_TO_STRING(['Apple', 'Banana', 'Cherry'], ', ');

┌──────────────────────────────────────────────────────┐
│ array_to_string(['apple', 'banana', 'cherry'], ', ') │
├──────────────────────────────────────────────────────┤
│ Apple, Banana, Cherry                                │
└──────────────────────────────────────────────────────┘
```