---
title: "数组函数"
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.225"/>

| 函数                                  | 描述                                                                      | 示例                                                     | 结果                   |
| ------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| **GET(array, index)**                 | 通过索引（基于 1）从数组中返回一个元素                                    | **GET([1, 2], 2)**                                       | 2                      |
| **LENGTH(array)**                     | 返回数组的长度                                                            | **LENGTH([1, 2])**                                       | 2                      |
| **RANGE(start, end)**                 | 返回由 [start, end) 收集的数组                                            | **RANGE(1, 3)**                                          | [1, 2]                 |
| **ARRAY_CONCAT(array1, array2)**      | 连接两个数组                                                              | **ARRAY_CONCAT([1, 2], [3, 4])**                         | [1,2,3,4]              |
| **ARRAY_CONTAINS(array, item)**       | 检查数组是否包含特定元素                                                  | **ARRAY_CONTAINS([1, 2], 1)**                            | 1                      |
| **ARRAY_INDEXOF(array, item)**        | 如果数组包含该元素，则返回元素的索引（基于 1）                            | **ARRAY_INDEXOF([1, 2, 9], 9)**                          | 3                      |
| **ARRAY_SLICE(array, start[, end])**  | 通过索引（基于 1）从数组中提取一个切片                                    | **ARRAY_SLICE([1, 21, 32, 4], 2, 3)**                    | [21,32]                |
| **ARRAY_SORT(array)**                 | 以升序排序数组中的元素                                                    | **ARRAY_SORT([1, 4, 3, 2])**                             | [1,2,3,4]              |
| **ARRAY_AGGREGATE(array, name)**      | 使用聚合函数（sum, count, avg, min, max, any, ...）对数组中的元素进行聚合 | **ARRAY_AGGREGATE([1, 2, 3, 4], 'SUM')**                 | 10                     |
| **ARRAY_UNIQUE(array)**               | 计算数组中唯一元素的数量（NULL 除外）                                     | **ARRAY_UNIQUE([1, 2, 3, 3, 4])**                        | 4                      |
| **ARRAY_DISTINCT(array)**             | 从数组中移除所有重复和 NULL 值，不保留原始顺序                            | **ARRAY_DISTINCT([1, 2, 2, 4])**                         | [1,2,4]                |
| **ARRAY_PREPEND(item, array)**        | 在数组前添加一个元素                                                      | **ARRAY_PREPEND(1, [3, 4])**                             | [1,3,4]                |
| **ARRAY_APPEND(array, item)**         | 在数组后添加一个元素                                                      | **ARRAY_APPEND([3, 4], 5)**                              | [3,4,5]                |
| **ARRAY_REMOVE_FIRST(array)**         | 移除数组的第一个元素                                                      | **ARRAY_REMOVE_FIRST([1, 2, 3])**                        | [2,3]                  |
| **ARRAY_REMOVE_LAST(array)**          | 移除数组的最后一个元素                                                    | **ARRAY_REMOVE_LAST([1, 2, 3])**                         | [1,2]                  |
| **UNNEST(array)**                     | 展开数组并返回元素集                                                      | **UNNEST([1, 2])**                                       | 1<br/>2<br/>**(2 行)** |
| **ARRAY_TRANSFORM(array, lambda)**    | 返回一个数组，该数组是将 lambda 函数应用于输入数组的每个元素的结果        | **ARRAY_TRANSFORM([1, 2, 3], x -> x + 1)**               | [2,3,4]                |
| **ARRAY_APPLY(array, lambda)**        | **ARRAY_TRANSFORM** 的别名                                                | **ARRAY_APPLY([1, 2, 3], x -> x + 1)**                   | [2,3,4]                |
| **ARRAY_FILTER(array, lambda)**       | 从输入数组中构造一个数组，该数组由 lambda 函数返回 true 的那些元素组成    | **ARRAY_FILTER([1, 2, 3], x -> x > 1)**                  | [2,3]                  |
| **ARRAY_REDUCE(array, lambda)**       | 迭代地将 lambda 函数应用于数组的元素，以将数组归约为单个值                | **ARRAY_REDUCE([1, 2, 3, 4], (x,y) -> x + y)**           | 10                     |
| **ARRAY_FLATTEN(array)**              | 展平嵌套数组，将它们转换为单层数组                                        | **ARRAY_FLATTEN([[1,2], [3,4,5]])**                      | [1,2,3,4,5]            |
| **ARRAY_TO_STRING(array, separator)** | 使用指定的分隔符将数组元素连接成单个字符串                                | **ARRAY_TO_STRING(['Apple', 'Banana', 'Cherry'], ', ')** | Apple, Banana, Cherry  |

:::note
**ARRAY_SORT(array)** 可以接受两个可选参数，`order` 和 `nullposition`，可以通过语法 **ARRAY_SORT(array, order, nullposition)** 指定。

- `order` 指定排序顺序，可以是升序（ASC）或降序（DESC）。默认为 ASC。
- `nullposition` 确定在排序结果中 NULL 值的位置，是在排序输出的开始（NULLS FIRST）还是结束（NULLS LAST）。默认为 NULLS FIRST。
:::

:::note
**ARRAY_AGGREGATE(array, name)** 支持以下聚合函数，`avg`, `count`, `max`, `min`, `sum`, `any`, `stddev_samp`, `stddev_pop`, `stddev`, `std`, `median`, `approx_count_distinct`, `kurtosis`, `skewness`。

**ARRAY_AGGREGATE(array, name)** 函数也支持重写为 **ARRAY\_<name\>(array)**。以下是现有重写的列表，`array_avg`, `array_count`, `array_max`, `array_min`, `array_sum`, `array_any`, `array_stddev_samp`, `array_stddev_pop`, `array_stddev`, `array_std`, `array_median`, `array_approx_count_distinct`, `array_kurtosis`, `array_skewness`。
:::

:::note
**UNNEST(array)** 也可以用作表函数。
:::

:::note
Lambda 函数由参数和 lambda 表达式组成，用 `->` 运算符分隔。
Lambda 表达式仅支持标量函数。不支持聚合函数、窗口函数、表函数和子查询。
:::
