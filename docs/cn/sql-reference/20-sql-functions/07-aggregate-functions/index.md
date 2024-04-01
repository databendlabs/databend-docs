---
title: '聚合函数'
---

聚合函数是 SQL 中的重要工具，它们允许你对一组值执行计算，并返回单个结果。

这些函数帮助你从数据库中提取和总结数据，以获得有价值的洞察。

| 函数名称                                                           | 功能描述                                                                   | 
|-------------------------------------------------------------------|----------------------------------------------------------------------------|
| [ANY](aggregate-any.md)                                           | 检查是否有任何行满足指定条件                                                | 
| [APPROX_COUNT_DISTINCT](aggregate-approx-count-distinct.md)       | 使用HyperLogLog估计不同值的数量                                             | 
| [ARG_MAX](aggregate-arg-max.md)                                   | 查找最大val值的arg值                                                       | 
| [ARG_MIN](aggregate-arg-min.md)                                   | 查找最小val值的arg值                                                       | 
| [AVG_IF](aggregate-avg-if.md)                                     | 计算满足条件的行的平均值                                                    | 
| [ARRAY_AGG](aggregate-array-agg.md)                               | 将一列的所有值转换为一个数组                                                |
| [AVG](aggregate-avg.md)                                           | 计算特定列的平均值                                                         | 
| [COUNT_DISTINCT](aggregate-count-distinct.md)                     | 计算一列中不同值的数量                                                     | 
| [COUNT_IF](aggregate-count-if.md)                                 | 计算满足指定条件的行数                                                      | 
| [COUNT](aggregate-count.md)                                       | 计算满足某些条件的行数                                                     | 
| [COVAR_POP](aggregate-covar-pop.md)                               | 返回一组数字对的总体协方差                                                  | 
| [COVAR_SAMP](aggregate-covar-samp.md)                             | 返回一组数字对的样本协方差                                                  | 
| [GROUP_ARRAY_MOVING_AVG](aggregate-group-array-moving-avg.md)     | 返回一个数组，元素计算输入值的移动平均值                                    |
| [GROUP_ARRAY_MOVING_SUM](aggregate-group-array-moving-sum.md)     | 返回一个数组，元素计算输入值的移动求和                                      |
| [KURTOSIS](aggregate-kurtosis.md)                                 | 计算一组值的超额峰度                                                       | 
| [MAX_IF](aggregate-max-if.md)                                     | 查找满足条件的行的最大值                                                   | 
| [MAX](aggregate-max.md)                                           | 查找特定列中的最大值                                                       | 
| [MEDIAN](aggregate-median.md)                                     | 计算特定列的中位数                                                         | 
| [MEDIAN_TDIGEST](aggregate-median-tdigest.md)                     | 使用t-digest算法计算特定列的中位数                                          | 
| [MIN_IF](aggregate-min-if.md)                                     | 查找满足条件的行的最小值                                                   | 
| [MIN](aggregate-min.md)                                           | 查找特定列中的最小值                                                       | 
| [QUANTILE_CONT](aggregate-quantile-cont.md)                       | 计算特定列的插值分位数                                                     |
| [QUANTILE_DISC](aggregate-quantile-disc.md)                       | 计算特定列的分位数                                                         | 
| [QUANTILE_TDIGEST](aggregate-quantile-tdigest.md)                 | 使用t-digest算法计算分位数                                                 |
| [QUANTILE_TDIGEST_WEIGHTED](aggregate-quantile-tdigest-weighted.md) | 使用t-digest算法计算加权分位数                                              |
| [RETENTION](aggregate-retention.md)                               | 计算一组事件的保留率                                                       | 
| [SKEWNESS](aggregate-skewness.md)                                 | 计算一组值的偏度                                                           | 
| [STDDEV_POP](aggregate-stddev-pop.md)                             | 计算列的总体标准差                                                         | 
| [STDDEV_SAMP](aggregate-stddev-samp.md)                           | 计算列的样本标准差                                                         | 
| [STRING_AGG](aggregate-string-agg.md)                             | 将所有非NULL值转换为字符串，由分隔符分隔                                    |
| [SUM_IF](aggregate-sum-if.md)                                     | 计算特定列满足条件的值的总和                                                | 
| [SUM](aggregate-sum.md)                                           | 计算特定列的值的总和                                                       | 
| [WINDOW_FUNNEL](aggregate-windowfunnel.md)                        | 分析事件的时间顺序序列中的用户行为                                          | 
| [HISTOGRAM](aggregate-histogram.md)                               | 分析特定列的值分布                                                         |