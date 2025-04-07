---
title: BITMAP_XOR_COUNT
---

通过执行逻辑异或（XOR）运算，计算 bitmap 中设置为 1 的位数。

## 语法

```sql
BITMAP_XOR_COUNT( <bitmap> )
```

## 示例

```sql
SELECT BITMAP_XOR_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_xor_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```