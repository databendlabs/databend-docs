---
title: ARRAY_SIZE
---

返回数组长度，包含 NULL 元素。别名：`ARRAY_LENGTH`。

## 语法

```sql
ARRAY_SIZE(<array>)
```

## 返回类型

`BIGINT`

## 示例

```sql
SELECT ARRAY_SIZE([1, 2, 3]) AS size_plain;
```

```
+-------------+
| size_plain  |
+-------------+
|           3 |
+-------------+
```

```sql
SELECT ARRAY_SIZE([1, NULL, 3]) AS size_with_null;
```

```
+---------------+
| size_with_null|
+---------------+
|             3 |
+---------------+
```
