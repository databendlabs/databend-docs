---
title: BITMAP_TO_ARRAY
---

将位图（Bitmap）转换为数组（Array）。

## 语法

```sql
BITMAP_TO_ARRAY( <bitmap> )
```

## 返回类型

`Array(UInt64)`

## 示例

```sql
SELECT BITMAP_TO_ARRAY(TO_BITMAP('1, 3, 5'));

╭───────────────────────────────────────╮
│ bitmap_to_array(to_bitmap('1, 3, 5')) │
├───────────────────────────────────────┤
│ [1,3,5]                               │
╰───────────────────────────────────────╯
```