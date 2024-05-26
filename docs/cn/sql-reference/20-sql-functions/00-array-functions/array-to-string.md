---
title: ARRAY_TO_STRING
---

将数组中的元素连接成一个字符串，使用指定的分隔符。

## 语法

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