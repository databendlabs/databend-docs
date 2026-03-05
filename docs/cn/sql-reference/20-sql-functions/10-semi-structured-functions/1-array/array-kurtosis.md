---
title: ARRAY_KURTOSIS
---

返回数组中数值的超峰度（excess kurtosis）。NULL 元素会被忽略，若存在非数值类型则报错。

## 语法

```sql
ARRAY_KURTOSIS(<array>)
```

## 返回类型

浮点型。

## 示例

```sql
SELECT ARRAY_KURTOSIS([1, 2, 3, 4]) AS kurt;
```

```
+------------------+
| kurt             |
+------------------+
| -1.200000000000001 |
+------------------+
```

```sql
SELECT ARRAY_KURTOSIS([NULL, 2, 3, 4]) AS kurt_null;
```

```
+-----------+
| kurt_null |
+-----------+
| 0         |
+-----------+
```
