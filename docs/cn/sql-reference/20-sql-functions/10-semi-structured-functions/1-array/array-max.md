---
title: ARRAY_MAX
---

返回数组中的最大数值。NULL 会被忽略，若包含非数值类型则报错。

## 语法

```sql
ARRAY_MAX(<array>)
```

## 返回类型

与数组元素一致的数值类型。

## 示例

```sql
SELECT ARRAY_MAX([5, 2, 9, -1]) AS max_int;
```

```
+---------+
| max_int |
+---------+
|       9 |
+---------+
```

```sql
SELECT ARRAY_MAX([NULL, 10, 4]) AS max_with_null;
```

```
+---------------+
| max_with_null |
+---------------+
|            10 |
+---------------+
```
