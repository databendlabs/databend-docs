---
title: 位图（Bitmap）函数
---

本页面全面介绍 Databend 中的位图函数，按功能分类以便查阅。

## 位图操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [BITMAP_AND](bitmap-and.md) | 对两个位图执行按位与 | `BITMAP_AND(BUILD_BITMAP([1,4,5]), BUILD_BITMAP([4,5]))` → `{4,5}` |
| [BITMAP_OR](bitmap-or.md) | 对两个位图执行按位或 | `BITMAP_OR(BUILD_BITMAP([1,2]), BUILD_BITMAP([2,3]))` → `{1,2,3}` |
| [BITMAP_XOR](bitmap-xor.md) | 对两个位图执行按位异或 | `BITMAP_XOR(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3,4]))` → `{1,4}` |
| [BITMAP_NOT](bitmap-not.md) | 对位图执行按位非 | `BITMAP_NOT(BUILD_BITMAP([1,2,3]), 5)` → `{0,4}` |
| [BITMAP_AND_NOT](bitmap-and-not.md) | 返回第一个位图存在但第二个位图不存在的元素 | `BITMAP_AND_NOT(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3]))` → `{1}` |
| [BITMAP_UNION](bitmap-union.md) | 合并多个位图 | `BITMAP_UNION([BUILD_BITMAP([1,2]), BUILD_BITMAP([2,3])])` → `{1,2,3}` |
| [BITMAP_INTERSECT](bitmap-intersect.md) | 返回多个位图的交集 | `BITMAP_INTERSECT([BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3,4])])` → `{2,3}` |

## 位图信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [BITMAP_COUNT](bitmap-count.md) | 返回位图元素数量 | `BITMAP_COUNT(BUILD_BITMAP([1,2,3]))` → `3` |
| [BITMAP_CONTAINS](bitmap-contains.md) | 检查位图是否包含特定元素 | `BITMAP_CONTAINS(BUILD_BITMAP([1,2,3]), 2)` → `true` |
| [BITMAP_HAS_ANY](bitmap-has-any.md) | 检查位图是否包含另一位图的任意元素 | `BITMAP_HAS_ANY(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([3,4]))` → `true` |
| [BITMAP_HAS_ALL](bitmap-has-all.md) | 检查位图是否包含另一位图的所有元素 | `BITMAP_HAS_ALL(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3]))` → `true` |
| [BITMAP_MIN](bitmap-min.md) | 返回位图最小元素 | `BITMAP_MIN(BUILD_BITMAP([1,2,3]))` → `1` |
| [BITMAP_MAX](bitmap-max.md) | 返回位图最大元素 | `BITMAP_MAX(BUILD_BITMAP([1,2,3]))` → `3` |
| [BITMAP_CARDINALITY](bitmap-cardinality.md) | 返回位图元素数量 | `BITMAP_CARDINALITY(BUILD_BITMAP([1,2,3]))` → `3` |

## 位图计数操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [BITMAP_AND_COUNT](bitmap-and-count.md) | 返回两个位图按位与的元素数量 | `BITMAP_AND_COUNT(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3,4]))` → `2` |
| [BITMAP_OR_COUNT](bitmap-or-count.md) | 返回两个位图按位或的元素数量 | `BITMAP_OR_COUNT(BUILD_BITMAP([1,2]), BUILD_BITMAP([2,3]))` → `3` |
| [BITMAP_XOR_COUNT](bitmap-xor-count.md) | 返回两个位图按位异或的元素数量 | `BITMAP_XOR_COUNT(BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3,4]))` → `2` |
| [BITMAP_NOT_COUNT](bitmap-not-count.md) | 返回位图按位非的元素数量 | `BITMAP_NOT_COUNT(BUILD_BITMAP([1,2,3]), 5)` → `2` |
| [INTERSECT_COUNT](intersect-count.md) | 返回多个位图交集的元素数量 | `INTERSECT_COUNT([BUILD_BITMAP([1,2,3]), BUILD_BITMAP([2,3,4])])` → `2` |

## 位图子集操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [SUB_BITMAP](sub-bitmap.md) | 提取位图子集 | `SUB_BITMAP(BUILD_BITMAP([1,2,3,4,5]), 1, 3)` → `{2,3,4}` |
| [BITMAP_SUBSET_IN_RANGE](bitmap-subset-in-range.md) | 返回指定范围内的位图子集 | `BITMAP_SUBSET_IN_RANGE(BUILD_BITMAP([1,2,3,4,5]), 2, 4)` → `{2,3}` |
| [BITMAP_SUBSET_LIMIT](bitmap-subset-limit.md) | 返回带数量限制的位图子集 | `BITMAP_SUBSET_LIMIT(BUILD_BITMAP([1,2,3,4,5]), 2, 2)` → `{3,4}` |