---
title: 数组函数 (Array Functions)
---

本页面全面概述了 Databend 中的数组函数，按功能分类以便参考。

## 数组创建和操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_APPEND](array-append.md) | 在数组末尾添加元素 | `ARRAY_APPEND([1, 2], 3)` → `[1,2,3]` |
| [ARRAY_CONCAT](array-concat.md) | 连接两个数组 | `ARRAY_CONCAT([1, 2], [3, 4])` → `[1,2,3,4]` |
| [ARRAY_PREPEND](array-prepend.md) | 在数组开头添加元素 | `ARRAY_PREPEND(0, [1, 2])` → `[0,1,2]` |
| [ARRAY_DISTINCT](array-distinct.md) | 移除数组中的重复元素 | `ARRAY_DISTINCT([1, 1, 2, 2])` → `[1,2]` |
| [ARRAY_FLATTEN](array-flatten.md) | 将嵌套数组扁平化为单层数组 | `ARRAY_FLATTEN([[1, 2], [3, 4]])` → `[1,2,3,4]` |
| [ARRAY_REMOVE_FIRST](array-remove-first.md) | 移除数组的首个元素 | `ARRAY_REMOVE_FIRST([1, 2, 3])` → `[2,3]` |
| [ARRAY_REMOVE_LAST](array-remove-last.md) | 移除数组的末尾元素 | `ARRAY_REMOVE_LAST([1, 2, 3])` → `[1,2]` |
| [ARRAY_SORT](array-sort.md) | 对数组元素进行排序 | `ARRAY_SORT([3, 1, 2])` → `[1,2,3]` |
| [ARRAY_UNIQUE](array-unique.md) | 移除数组中的重复元素 | `ARRAY_UNIQUE([1, 1, 2, 2])` → `[1,2]` |
| [ARRAYS_ZIP](arrays-zip.md) | 将多个数组合并为元组数组 | `ARRAYS_ZIP([1, 2], ['a', 'b'])` → `[(1,'a'),(2,'b')]` |
| [RANGE](range.md) | 生成指定范围的整数数组 | `RANGE(1, 5)` → `[1,2,3,4]` |

## 数组访问和信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_GET](array-get.md) / [GET](get.md) | 获取指定位置的元素 | `ARRAY_GET([1, 2, 3], 1)` → `2` |
| [ARRAY_LENGTH](array-length.md) / [ARRAY_SIZE](array-size.md) | 返回数组元素数量 | `ARRAY_LENGTH([1, 2, 3])` → `3` |
| [ARRAY_INDEXOF](array-indexof.md) | 返回元素首次出现的位置 | `ARRAY_INDEXOF([1, 2, 3], 2)` → `1` |
| [ARRAY_CONTAINS](array-contains.md) / [CONTAINS](contains.md) | 检查数组是否包含特定元素 | `CONTAINS([1, 2, 3], 2)` → `true` |
| [SLICE](slice.md) / [ARRAY_SLICE](array-slice.md) | 提取子数组 | `SLICE([1, 2, 3, 4], 1, 2)` → `[2,3]` |

## 数组转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_TRANSFORM](array-transform.md) | 对每个元素应用 lambda 函数 | `ARRAY_TRANSFORM([1, 2, 3], x -> x * 2)` → `[2,4,6]` |
| [ARRAY_FILTER](array-filter.md) | 根据 lambda 条件过滤元素 | `ARRAY_FILTER([1, 2, 3], x -> x > 1)` → `[2,3]` |
| [ARRAY_REDUCE](array-reduce.md) | 使用 lambda 函数将数组归约为单个值 | `ARRAY_REDUCE([1, 2, 3], 0, (s, x) -> s + x)` → `6` |
| [ARRAY_APPLY](array-apply.md) | 对每个元素应用函数 | `ARRAY_APPLY([1, 2, 3], x -> x * x)` → `[1,4,9]` |
| [ARRAY_AGGREGATE](array-aggregate.md) | 对数组元素应用聚合函数 | `ARRAY_AGGREGATE([1, 2, 3], 'sum')` → `6` |
| [ARRAY_TO_STRING](array-to-string.md) | 用分隔符将数组转换为字符串 | `ARRAY_TO_STRING([1, 2, 3], ',')` → `'1,2,3'` |
| [UNNEST](unnest.md) | 将数组展开为行集合 | `SELECT UNNEST([1, 2, 3])` → `1`, `2`, `3` (作为行) |