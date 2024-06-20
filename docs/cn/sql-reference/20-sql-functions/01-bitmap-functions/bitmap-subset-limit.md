---
title: BITMAP_SUBSET_LIMIT
---

生成源位图的一个子位图，从起始值开始，并设置大小限制。

## 语法

```sql
BITMAP_SUBSET_LIMIT( <bitmap>, <start>, <limit> )
```

## 示例

```sql
SELECT BITMAP_SUBSET_LIMIT(BUILD_BITMAP([1,4,5]), 2, 2)::String;

┌────────────────────────────────────────────────────────────┐
│ bitmap_subset_limit(build_bitmap([1, 4, 5]), 2, 2)::string │
├────────────────────────────────────────────────────────────┤
│ 4,5                                                        │
└────────────────────────────────────────────────────────────┘
```