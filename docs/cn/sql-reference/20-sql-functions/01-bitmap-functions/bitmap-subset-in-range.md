---
title: BITMAP_SUBSET_IN_RANGE
---

生成源位图在指定范围内的子位图。

## 语法

```sql
BITMAP_SUBSET_IN_RANGE( <bitmap>, <start>, <end> )
```

## 示例

```sql
SELECT BITMAP_SUBSET_IN_RANGE(BUILD_BITMAP([5,7,9]), 6, 9)::String;

┌───────────────────────────────────────────────────────────────┐
│ bitmap_subset_in_range(build_bitmap([5, 7, 9]), 6, 9)::string │
├───────────────────────────────────────────────────────────────┤
│ 7                                                             │
└───────────────────────────────────────────────────────────────┘
```