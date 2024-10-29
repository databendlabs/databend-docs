---
title: ARRAY_LENGTH
---

返回数组的长度。

## 语法

```sql
ARRAY_LENGTH( <array> )
```

## 别名

- [ARRAY_SIZE](array-size.md)

## 示例

```sql
SELECT 
    ARRAY_LENGTH(['apple', 'banana', 'cherry']) AS item_count,
    ARRAY_SIZE(['apple', 'banana', 'cherry']) AS item_count_alias;

┌───────────────────────────────┐
│ item_count │ item_count_alias │
├────────────┼──────────────────┤
│          3 │                3 │
└───────────────────────────────┘
```