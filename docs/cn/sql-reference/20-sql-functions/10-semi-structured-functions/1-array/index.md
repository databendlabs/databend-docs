---
title: 数组函数
---

本节提供了 Databend 中数组函数 (Array Functions) 的相关参考信息。数组函数能够创建、操作、搜索和转换数组数据结构。

## 数组创建与构造

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY](array) | 直接根据表达式构造数组 | `ARRAY(1, 2, 3)` → `[1,2,3]` |
| [ARRAY_CONSTRUCT](array-construct) | 根据单个值创建数组 | `ARRAY_CONSTRUCT(1, 2, 3)` → `[1,2,3]` |
| [RANGE](range) | 生成连续数字序列数组 | `RANGE(1, 5)` → `[1,2,3,4]` |
| [ARRAY_GENERATE_RANGE](array-generate-range) | 带步长地生成整数序列 | `ARRAY_GENERATE_RANGE(0, 6, 2)` → `[0,2,4]` |

## 数组访问与信息

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [GET](get) | 通过索引获取数组元素 | `GET([1,2,3], 1)` → `1` |
| [ARRAY_GET](array-get) | GET 函数的别名 | `ARRAY_GET([1,2,3], 1)` → `1` |
| [CONTAINS](contains) | 检查数组是否包含特定值 | `CONTAINS([1,2,3], 2)` → `true` |
| [ARRAY_CONTAINS](array-contains) | 检查数组是否包含特定值 | `ARRAY_CONTAINS([1,2,3], 2)` → `true` |
| [ARRAY_SIZE](array-size) | 返回数组长度（别名：`ARRAY_LENGTH`） | `ARRAY_SIZE([1,2,3])` → `3` |
| [ARRAY_COUNT](array-count) | 统计非 NULL 元素个数 | `ARRAY_COUNT([1,NULL,2])` → `2` |
| [ARRAY_ANY](array-any) | 返回首个非 NULL 元素 | `ARRAY_ANY([NULL,'a','b'])` → `'a'` |

## 数组修改

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_APPEND](array-append) | 在数组末尾追加元素 | `ARRAY_APPEND([1,2], 3)` → `[1,2,3]` |
| [ARRAY_PREPEND](array-prepend) | 在数组开头添加元素 | `ARRAY_PREPEND(0, [1,2])` → `[0,1,2]` |
| [ARRAY_INSERT](array-insert) | 在指定位置插入元素 | `ARRAY_INSERT([1,3], 1, 2)` → `[1,2,3]` |
| [ARRAY_REMOVE](array-remove) | 移除所有指定元素 | `ARRAY_REMOVE([1,2,2,3], 2)` → `[1,3]` |
| [ARRAY_REMOVE_FIRST](array-remove-first) | 移除数组首个元素 | `ARRAY_REMOVE_FIRST([1,2,3])` → `[2,3]` |
| [ARRAY_REMOVE_LAST](array-remove-last) | 移除数组末尾元素 | `ARRAY_REMOVE_LAST([1,2,3])` → `[1,2]` |

## 数组组合与操作

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_CONCAT](array-concat) | 连接多个数组 | `ARRAY_CONCAT([1,2], [3,4])` → `[1,2,3,4]` |
| [ARRAY_SLICE](array-slice) | 提取数组子集 | `ARRAY_SLICE([1,2,3,4], 1, 2)` → `[1,2]` |
| [SLICE](slice) | ARRAY_SLICE 函数的别名 | `SLICE([1,2,3,4], 1, 2)` → `[1,2]` |
| [ARRAYS_ZIP](arrays-zip) | 按元素组合多个数组 | `ARRAYS_ZIP([1,2], ['a','b'])` → `[(1,'a'),(2,'b')]` |

## 数组集合运算

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_DISTINCT](array-distinct) | 返回数组唯一元素 | `ARRAY_DISTINCT([1,2,2,3])` → `[1,2,3]` |
| [ARRAY_UNIQUE](array-unique) | ARRAY_DISTINCT 函数的别名 | `ARRAY_UNIQUE([1,2,2,3])` → `[1,2,3]` |
| [ARRAY_INTERSECTION](array-intersection) | 返回数组交集元素 | `ARRAY_INTERSECTION([1,2,3], [2,3,4])` → `[2,3]` |
| [ARRAY_EXCEPT](array-except) | 返回数组差集元素 | `ARRAY_EXCEPT([1,2,3], [2,4])` → `[1,3]` |
| [ARRAY_OVERLAP](array-overlap) | 检查数组是否存在交集 | `ARRAY_OVERLAP([1,2,3], [3,4,5])` → `true` |
| [ARRAY_SORT](array-sort) | 排序数组；可控制顺序与 NULL 位置 | `ARRAY_SORT([3,1,2])` → `[1,2,3]` |

## 数组处理与转换

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_TRANSFORM](array-transform) | 对每个元素应用函数 | `ARRAY_TRANSFORM([1,2,3], x -> x * 2)` → `[2,4,6]` |
| [ARRAY_FILTER](array-filter) | 按条件筛选数组元素 | `ARRAY_FILTER([1,2,3,4], x -> x > 2)` → `[3,4]` |
| [ARRAY_REDUCE](array-reduce) | 使用聚合函数归约数组 | `ARRAY_REDUCE([1,2,3], 0, (acc,x) -> acc + x)` → `6` |
| [ARRAY_AGGREGATE](array-aggregate) | 使用函数聚合数组元素 | `ARRAY_AGGREGATE([1,2,3], 'sum')` → `6` |

## 数组统计函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_SUM](array-sum) | 求和 | `ARRAY_SUM([1,2,3])` → `6` |
| [ARRAY_AVG](array-avg) | 求平均值 | `ARRAY_AVG([1,2,3])` → `2` |
| [ARRAY_MEDIAN](array-median) | 求中位数 | `ARRAY_MEDIAN([1,3,2])` → `2` |
| [ARRAY_MIN](array-min) | 最小值 | `ARRAY_MIN([3,1,2])` → `1` |
| [ARRAY_MAX](array-max) | 最大值 | `ARRAY_MAX([3,1,2])` → `3` |
| [ARRAY_STDDEV_POP](array-stddev-pop) | 总体标准差（别名：`ARRAY_STD`） | `ARRAY_STDDEV_POP([1,2,3])` |
| [ARRAY_STDDEV_SAMP](array-stddev-samp) | 样本标准差（别名：`ARRAY_STDDEV`） | `ARRAY_STDDEV_SAMP([1,2,3])` |
| [ARRAY_KURTOSIS](array-kurtosis) | 超峰度 | `ARRAY_KURTOSIS([1,2,3,4])` |
| [ARRAY_SKEWNESS](array-skewness) | 偏度 | `ARRAY_SKEWNESS([1,2,3,10])` |
| [ARRAY_APPROX_COUNT_DISTINCT](array-approx-count-distinct) | 近似去重计数 | `ARRAY_APPROX_COUNT_DISTINCT([1,1,2])` → `2` |

## 数组工具函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_COMPACT](array-compact) | 移除数组中的空值（null） | `ARRAY_COMPACT([1,null,2,null,3])` → `[1,2,3]` |
| [ARRAY_FLATTEN](array-flatten) | 展平嵌套数组 | `ARRAY_FLATTEN([[1,2],[3,4]])` → `[1,2,3,4]` |
| [ARRAY_REVERSE](array-reverse) | 反转数组元素顺序 | `ARRAY_REVERSE([1,2,3])` → `[3,2,1]` |
| [ARRAY_INDEXOF](array-indexof) | 返回元素首次出现的索引 | `ARRAY_INDEXOF([1,2,3,2], 2)` → `1` |
| [ARRAY_TO_STRING](array-to-string) | 将字符串数组拼接为文本 | `ARRAY_TO_STRING(['a','b'], ',')` → `'a,b'` |
| [UNNEST](unnest) | 将数组展开为独立行 | `UNNEST([1,2,3])` → `1, 2, 3` (作为独立行) |
