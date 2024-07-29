---
title: '聚合函数'
---

聚合函数是 SQL 中的基本工具，允许您对一组值进行计算并返回单个结果。

这些函数帮助您从数据库中提取和汇总数据，以获得有价值的洞察。

| 函数名称                                                            | 功能描述                                                                 | 
|---------------------------------------------------------------------|------------------------------------------------------------------------------|
| [ANY](aggregate-any.md)                                             | 检查是否有任何行满足指定条件                              | 
| [APPROX_COUNT_DISTINCT](aggregate-approx-count-distinct.md)         | 使用 HyperLogLog 估计不同值的数量                     | 
| [ARG_MAX](aggregate-arg-max.md)                                     | 找到最大值对应的 arg 值                                | 
| [ARG_MIN](aggregate-arg-min.md)                                     | 找到最小值对应的 arg 值                                | 
| [AVG_IF](aggregate-avg-if.md)                                       | 计算满足条件的行的平均值                          | 
| [ARRAY_AGG](aggregate-array-agg.md)                                 | 将列的所有值转换为数组                              |
| [AVG](aggregate-avg.md)                                             | 计算特定列的平均值                            | 
| [COUNT_DISTINCT](aggregate-count-distinct.md)                       | 计算列中不同值的数量                             | 
| [COUNT_IF](aggregate-count-if.md)                                   | 计算满足指定条件的行数                                    | 
| [COUNT](aggregate-count.md)                                         | 计算满足某些条件的行数                         | 
| [COVAR_POP](aggregate-covar-pop.md)                                 | 返回一组数值对的总体协方差                   | 
| [COVAR_SAMP](aggregate-covar-samp.md)                               | 返回一组数值对的样本协方差                       | 
| [GROUP_ARRAY_MOVING_AVG](aggregate-group-array-moving-avg.md)       | 返回一个数组，其元素计算输入值的移动平均值 |
| [GROUP_ARRAY_MOVING_SUM](aggregate-group-array-moving-sum.md)       | 返回一个数组，其元素计算输入值的移动总和     |
| [KURTOSIS](aggregate-kurtosis.md)                                   | 计算一组值的峰度                            | 
| [MAX_IF](aggregate-max-if.md)                                       | 找到满足条件的行的最大值                         | 
| [MAX](aggregate-max.md)                                             | 找到特定列中的最大值                                 | 
| [MEDIAN](aggregate-median.md)                                       | 计算特定列的中位数                             | 
| [MEDIAN_TDIGEST](aggregate-median-tdigest.md)                       | 使用 t-digest 算法计算特定列的中位数    | 
| [MIN_IF](aggregate-min-if.md)                                       | 找到满足条件的行的最小值                         | 
| [MIN](aggregate-min.md)                                             | 找到特定列中的最小值                                | 
| [QUANTILE_CONT](aggregate-quantile-cont.md)                         | 计算特定列的插值分位数                   |
| [QUANTILE_DISC](aggregate-quantile-disc.md)                         | 计算特定列的分位数                                | 
| [QUANTILE_TDIGEST](aggregate-quantile-tdigest.md)                   | 使用 t-digest 算法计算分位数                             |
| [QUANTILE_TDIGEST_WEIGHTED](aggregate-quantile-tdigest-weighted.md) | 使用 t-digest 算法计算加权分位数       |
| [RETENTION](aggregate-retention.md)                                 | 计算一组事件的留存率                                     | 
| [SKEWNESS](aggregate-skewness.md)                                   | 计算一组值的偏度                                   | 
| [STDDEV_POP](aggregate-stddev-pop.md)                               | 计算列的总体标准差                     | 
| [STDDEV_SAMP](aggregate-stddev-samp.md)                             | 计算列的样本标准差                         | 
| [STRING_AGG](aggregate-string-agg.md)                               | 将所有非 NULL 值转换为字符串，由分隔符分隔       |
| [SUM_IF](aggregate-sum-if.md)                                       | 对满足条件的特定列的值求和                  | 
| [SUM](aggregate-sum.md)                                             | 对特定列的值求和                                      | 
| [WINDOW_FUNNEL](aggregate-windowfunnel.md)                          | 分析按时间顺序排列的事件序列中的用户行为                  | 
| [HISTOGRAM](aggregate-histogram.md)                                 | 分析特定列的值分布                 |