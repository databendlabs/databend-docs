---
title: ARRAY_MIN
---

返回数组中的最小数值。NULL 会被忽略，若包含非数值类型则报错。

## 语法

```sql
ARRAY_MIN(<array>)
```

## 返回类型

与数组元素一致的数值类型。

## 示例

```sql
SELECT ARRAY_MIN([5, 2, 9, -1]) AS min_int;
```

```
+---------+
| min_int |
+---------+
|      -1 |
+---------+
```

```sql
SELECT ARRAY_MIN([NULL, 10, 4]) AS min_with_null;
```

```
+---------------+
| min_with_null |
+---------------+
|            4  |
+---------------+
```
