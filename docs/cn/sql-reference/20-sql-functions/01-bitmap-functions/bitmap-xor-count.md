```
---
title: BITMAP_XOR_COUNT
---

计算通过执行逻辑异或（XOR）操作得到的位图中设置为1的位数。

## 语法 {/*syntax*/}

```sql
BITMAP_XOR_COUNT( <bitmap> )
```

## 示例 {/*examples*/}

```sql
SELECT BITMAP_XOR_COUNT(TO_BITMAP('1, 3, 5'));

┌────────────────────────────────────────┐
│ bitmap_xor_count(to_bitmap('1, 3, 5')) │
├────────────────────────────────────────┤
│                                      3 │
└────────────────────────────────────────┘
```
```