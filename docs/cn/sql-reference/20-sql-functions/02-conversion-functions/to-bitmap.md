---
title: TO_BITMAP
---

将一个值转换为 BITMAP 数据类型。

## 语法

```sql
TO_BITMAP( <expr> )
```

## 示例

```sql
SELECT TO_BITMAP('1101');

┌───────────────────┐
│ to_bitmap('1101') │
├───────────────────┤
│ <bitmap 二进制>   │
└───────────────────┘
```