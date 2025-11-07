---
title: ARRAY_ANY
---

返回数组中第一个非 NULL 的元素。等价于 `ARRAY_AGGREGATE(array, 'ANY')`。

## 语法

```sql
ARRAY_ANY(<array>)
```

## 返回类型

与数组元素类型相同。

## 示例

```sql
SELECT ARRAY_ANY(['a', 'b', 'c']) AS first_item;
```

结果：

```
+------------+
| first_item |
+------------+
| a          |
+------------+
```

```sql
SELECT ARRAY_ANY([NULL, 'x', 'y']) AS first_non_null;
```

结果：

```
+----------------+
| first_non_null |
+----------------+
| x              |
+----------------+
```

```sql
SELECT ARRAY_ANY([NULL, 10, 20]) AS first_number;
```

结果：

```
+--------------+
| first_number |
+--------------+
|           10 |
+--------------+
```
