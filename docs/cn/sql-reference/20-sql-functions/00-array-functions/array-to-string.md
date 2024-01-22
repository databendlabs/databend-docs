```
---
title: ARRAY_TO_STRING
---

使用指定的分隔符将数组中的元素连接成一个单一的字符串。

## 语法 {/*syntax*/}

```sql
ARRAY_TO_STRING( <array>, '<separator>' )
```

## 示例 {/*examples*/}

```sql
SELECT ARRAY_TO_STRING(['Apple', 'Banana', 'Cherry'], ', ');

┌──────────────────────────────────────────────────────┐
│ array_to_string(['apple', 'banana', 'cherry'], ', ') │
├──────────────────────────────────────────────────────┤
│ Apple, Banana, Cherry                                │
└──────────────────────────────────────────────────────┘
```
```