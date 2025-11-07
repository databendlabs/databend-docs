---
title: ARRAY
---

根据给定表达式按顺序构造数组。所有参数必须可以转换为同一数据类型。

## 语法

```sql
ARRAY(<expr1>, <expr2>, ...)
```

## 返回类型

`ARRAY`

## 示例

```sql
SELECT ARRAY(1, 2, 3) AS arr_int;
```

```
+---------+
| arr_int |
+---------+
| [1,2,3] |
+---------+
```

```sql
SELECT ARRAY('alpha', UPPER('beta')) AS arr_text;
```

```
+----------+
| arr_text |
+----------+
| ["alpha","BETA"] |
+----------+
```

```sql
SELECT ARRAY(1, NULL, 3) AS arr_with_null;
```

```
+--------------+
| arr_with_null|
+--------------+
| [1,NULL,3]   |
+--------------+
```
