---
title: ARRAY_SKEWNESS
---

返回数组中数值的偏度。NULL 元素会被忽略，若存在非数值类型则报错。

## 语法

```sql
ARRAY_SKEWNESS(<array>)
```

## 返回类型

浮点型。

## 示例

```sql
SELECT ARRAY_SKEWNESS([1, 2, 3, 4]) AS skew;
```

```
+------+
| skew |
+------+
| 0    |
+------+
```

```sql
SELECT ARRAY_SKEWNESS([NULL, 2, 3, 10]) AS skew_null;
```

```
+-----------+
| skew_null |
+-----------+
| 1.63005916|
+-----------+
```
