---
title: ARRAY_SORT
---

对数组进行排序。默认情况下结果按升序排列，NULL 位于末尾。可使用下列变体控制顺序和 NULL 位置：

- `ARRAY_SORT_ASC_NULL_FIRST`
- `ARRAY_SORT_ASC_NULL_LAST`
- `ARRAY_SORT_DESC_NULL_FIRST`
- `ARRAY_SORT_DESC_NULL_LAST`

## 语法

```sql
ARRAY_SORT(<array>)
ARRAY_SORT_ASC_NULL_FIRST(<array>)
ARRAY_SORT_ASC_NULL_LAST(<array>)
ARRAY_SORT_DESC_NULL_FIRST(<array>)
ARRAY_SORT_DESC_NULL_LAST(<array>)
```

## 返回类型

`ARRAY`

## 示例

```sql
SELECT ARRAY_SORT([3, 1, 2]) AS sort_default;
```

```
+--------------+
| sort_default |
+--------------+
| [1,2,3]      |
+--------------+
```

```sql
SELECT ARRAY_SORT([NULL, 2, 1]) AS sort_with_nulls;
```

```
+----------------+
| sort_with_nulls|
+----------------+
| [1,2,NULL]     |
+----------------+
```

```sql
SELECT ARRAY_SORT_ASC_NULL_FIRST([NULL, 2, 1]) AS asc_null_first;
```

```
+----------------+
| asc_null_first |
+----------------+
| [NULL,1,2]     |
+----------------+
```

```sql
SELECT ARRAY_SORT_DESC_NULL_LAST([NULL, 2, 1]) AS desc_null_last;
```

```
+----------------+
| desc_null_last |
+----------------+
| [2,1,NULL]     |
+----------------+
```

```sql
SELECT ARRAY_SORT_DESC_NULL_FIRST([NULL, 2, 1]) AS desc_null_first;
```

```
+-----------------+
| desc_null_first |
+-----------------+
| [NULL,2,1]      |
+-----------------+
```
