---
title: BUILD_BITMAP
---

将一个正整数数组转换为 BITMAP 值。

## 语法

```sql
BUILD_BITMAP( <expr> )
```

## 示例

```sql
SELECT BUILD_BITMAP([1,4,5])::String;

┌─────────────────────────────────┐
│ build_bitmap([1, 4, 5])::string │
├─────────────────────────────────┤
│ 1,4,5                           │
└─────────────────────────────────┘
```