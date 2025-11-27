---
title: '聚合函数'
---

本页面按功能分类，全面概述了 Databend 中的聚合函数，便于快速查阅。

## 基本聚合

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [COUNT](aggregate-count.md) | 计算行数或非 NULL 值的数量 | `COUNT(*)` → `10` |
| [COUNT_DISTINCT](aggregate-count-distinct.md) | 计算不同值的数量 | `COUNT(DISTINCT city)` → `5` |
| [APPROX_COUNT_DISTINCT](aggregate-approx-count-distinct.md) | 近似计算不同值的数量 | `APPROX_COUNT_DISTINCT(user_id)` → `9955` |
| [SUM](aggregate-sum.md) | 计算值的总和 | `SUM(sales)` → `1250.75` |
| [AVG](aggregate-avg.md) | 计算值的平均值 | `AVG(temperature)` → `72.5` |
| [MIN](aggregate-min.md) | 返回最小值 | `MIN(price)` → `9.99` |
| [MAX](aggregate-max.md) | 返回最大值 | `MAX(price)` → `99.99` |
| [ANY_VALUE](aggregate-any-value.md) | 从分组中返回任意一个值 | `ANY_VALUE(status)` → `'active'` |

## 条件聚合

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [COUNT_IF](aggregate-count-if.md) | 计算满足条件的行数 | `COUNT_IF(price > 100)` → `5` |
| [SUM_IF](aggregate-sum-if.md) | 对满足条件的值求和 | `SUM_IF(amount, status = 'completed')` → `750.25` |
| [AVG_IF](aggregate-avg-if.md) | 对满足条件的值求平均 | `AVG_IF(score, passed = true)` → `85.6` |
| [MIN_IF](aggregate-min-if.md) | 返回条件为真时的最小值 | `MIN_IF(temp, location = 'outside')` → `45.2` |
| [MAX_IF](aggregate-max-if.md) | 返回条件为真时的最大值 | `MAX_IF(speed, vehicle = 'car')` → `120.5` |

## 统计函数

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [VAR_POP](aggregate-var-pop.md) / [VARIANCE_POP](aggregate-variance-pop.md) | 总体方差 | `VAR_POP(height)` → `10.25` |
| [VAR_SAMP](aggregate-var-samp.md) / [VARIANCE_SAMP](aggregate-variance-samp.md) | 样本方差 | `VAR_SAMP(height)` → `12.3` |
| [STDDEV_POP](aggregate-stddev-pop.md) | 总体标准差 | `STDDEV_POP(height)` → `3.2` |
| [STDDEV_SAMP](aggregate-stddev-samp.md) | 样本标准差 | `STDDEV_SAMP(height)` → `3.5` |
| [COVAR_POP](aggregate-covar-pop.md) | 总体协方差 | `COVAR_POP(x, y)` → `2.5` |
| [COVAR_SAMP](aggregate-covar-samp.md) | 样本协方差 | `COVAR_SAMP(x, y)` → `2.7` |
| [KURTOSIS](aggregate-kurtosis.md) | 衡量分布的峰度 | `KURTOSIS(values)` → `2.1` |
| [SKEWNESS](aggregate-skewness.md) | 衡量分布的偏度 | `SKEWNESS(values)` → `0.2` |

## 百分位数与分布

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [MEDIAN](aggregate-median.md) | 计算中位数 | `MEDIAN(response_time)` → `125` |
| [MODE](aggregate-mode.md) | 返回最频繁出现的值 | `MODE(category)` → `'electronics'` |
| [QUANTILE_CONT](aggregate-quantile-cont.md) | 连续插值分位数 | `QUANTILE_CONT(0.95)(response_time)` → `350.5` |
| [QUANTILE_DISC](aggregate-quantile-disc.md) | 离散分位数 | `QUANTILE_DISC(0.5)(age)` → `35` |
| [QUANTILE_TDIGEST](aggregate-quantile-tdigest.md) | 使用 t-digest 算法近似计算分位数 | `QUANTILE_TDIGEST(0.9)(values)` → `95.2` |
| [QUANTILE_TDIGEST_WEIGHTED](aggregate-quantile-tdigest-weighted.md) | 加权 t-digest 分位数 | `QUANTILE_TDIGEST_WEIGHTED(0.5)(values, weights)` → `50.5` |
| [MEDIAN_TDIGEST](aggregate-median-tdigest.md) | 使用 t-digest 算法近似计算中位数 | `MEDIAN_TDIGEST(response_time)` → `124.5` |
| [HISTOGRAM](aggregate-histogram.md) | 创建直方图分桶 | `HISTOGRAM(10)(values)` → `[{...}]` |

## 数组与集合聚合

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARRAY_AGG](aggregate-array-agg.md) | 将值收集到一个数组中 | `ARRAY_AGG(product)` → `['A', 'B', 'C']` |
| [GROUP_ARRAY_MOVING_AVG](aggregate-group-array-moving-avg.md) | 计算数组的移动平均值 | `GROUP_ARRAY_MOVING_AVG(3)(values)` → `[null, null, 3.0, 6.0, 9.0]` |
| [GROUP_ARRAY_MOVING_SUM](aggregate-group-array-moving-sum.md) | 计算数组的移动总和 | `GROUP_ARRAY_MOVING_SUM(2)(values)` → `[null, 3, 7, 11, 15]` |

## 字符串聚合

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [GROUP_CONCAT](aggregate-group-concat.md) | 使用分隔符连接值 | `GROUP_CONCAT(city, ', ')` → `'New York, London, Tokyo'` |
| [STRING_AGG](aggregate-string-agg.md) | 使用分隔符连接字符串 | `STRING_AGG(tag, ',')` → `'red,green,blue'` |
| [LISTAGG](aggregate-listagg.md) | 使用分隔符连接值 | `LISTAGG(name, ', ')` → `'Alice, Bob, Charlie'` |

## JSON 聚合

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [JSON_ARRAY_AGG](aggregate-json-array-agg.md) | 将值聚合为 JSON 数组 | `JSON_ARRAY_AGG(name)` → `'["Alice", "Bob", "Charlie"]'` |
| [JSON_OBJECT_AGG](aggregate-json-object-agg.md) | 从键值对创建 JSON 对象 | `JSON_OBJECT_AGG(name, score)` → `'{"Alice": 95, "Bob": 87}'` |

## 参数选择

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [ARG_MAX](aggregate-arg-max.md) | 返回 expr2 最大时 expr1 的值 | `ARG_MAX(name, score)` → `'Alice'` |
| [ARG_MIN](aggregate-arg-min.md) | 返回 expr2 最小时 expr1 的值 | `ARG_MIN(name, score)` → `'Charlie'` |

## 漏斗分析

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [RETENTION](aggregate-retention.md) | 计算留存率 | `RETENTION(action = 'signup', action = 'purchase')` → `[100, 40]` |
| [WINDOWFUNNEL](aggregate-windowfunnel.md) | 在时间窗口内搜索事件序列 | `WINDOWFUNNEL(1800)(timestamp, event='view', event='click', event='purchase')` → `2` |

## 匿名化

| 函数 | 描述 | 示例 |
|----------|-------------|---------|
| [MARKOV_TRAIN](aggregate-markov-train.md) | 训练马尔可夫模型 | `MARKOV_TRAIN(address)` |
