---
title: ARRAY_TO_STRING
---

将字符串数组按照给定分隔符拼接成单个字符串，NULL 元素会被跳过。

## 语法

```sql
ARRAY_TO_STRING(<array_of_strings>, <delimiter>)
```

## 返回类型

`STRING`

## 示例

```sql
SELECT ARRAY_TO_STRING(['a', 'b', 'c'], ',') AS joined;
```

```
+--------+
| joined |
+--------+
| a,b,c  |
+--------+
```

```sql
SELECT ARRAY_TO_STRING([NULL, 'x', 'y'], '-') AS joined_no_nulls;
```

```
+------------------+
| joined_no_nulls  |
+------------------+
| x-y              |
+------------------+
```
