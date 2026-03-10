---
title: '窗口函数（Window Function）'
---

## 概述

窗口函数（Window Function）对一组相关行进行计算，同时为每个输入行返回一个结果。与聚合函数（Aggregate Function）不同，窗口函数不会将多行折叠为单个输出。

**主要特点：**
- 对与当前行相关的行“窗口”进行操作
- 为每个输入行返回一个值（不进行分组/折叠）
- 可以访问窗口中其他行的值
- 支持分区（Partitioning）和排序（Ordering），以实现灵活的计算

## 窗口函数类别

Databend 支持两大类窗口函数：

### 1. 专用窗口函数

这些函数专为窗口操作而设计。

**排名函数：**

| 函数 | 描述 | 并列处理 | 示例输出 |
|----------|-------------|---------------|----------------|
| [ROW_NUMBER](row-number.md) | 顺序编号 | 始终唯一 | `1, 2, 3, 4, 5` |
| [RANK](rank.md) | 带间隙排名 | 相同排名，后续有间隙 | `1, 2, 2, 4, 5` |
| [DENSE_RANK](dense-rank.md) | 无间隙排名 | 相同排名，无间隙 | `1, 2, 2, 3, 4` |

**分布函数：**

| 函数 | 描述 | 范围 | 示例输出 |
|----------|-------------|-------|----------------|
| [PERCENT_RANK](percent_rank.md) | 相对排名的百分比 | 0.0 到 1.0 | `0.0, 0.25, 0.5, 0.75, 1.0` |
| [CUME_DIST](cume-dist.md) | 累积分布 | 0.0 到 1.0 | `0.2, 0.4, 0.6, 0.8, 1.0` |
| [NTILE](ntile.md) | 划分为 N 个桶 | 1 到 N | `1, 1, 2, 2, 3, 3` |

**值访问函数：**

| 函数 | 描述 | 用例 |
|----------|-------------|----------|
| [FIRST_VALUE](first-value.md) | 窗口中的第一个值 | 获取最高/最早的值 |
| [LAST_VALUE](last-value.md) | 窗口中的最后一个值 | 获取最低/最晚的值 |
| [NTH_VALUE](nth-value.md) | 窗口中的第 N 个值 | 获取特定位置的值 |
| [LAG](lag.md) | 上一行的值 | 与上一行比较 |
| [LEAD](lead.md) | 下一行的值 | 与下一行比较 |

**别名：**

| 函数 | 别名 |
|----------|----------|
| [FIRST](first.md) | FIRST_VALUE |
| [LAST](last.md) | LAST_VALUE |

### 2. 用作窗口函数的聚合函数

这些是标准的聚合函数，可以与 OVER 子句一起使用以执行窗口操作。

| 函数 | 描述 | 窗口框架支持 | 示例 |
|----------|-------------|---------------------|---------|  
| [SUM](../07-aggregate-functions/aggregate-sum.md) | 计算窗口内的总和 | ✓ | `SUM(sales) OVER (PARTITION BY region ORDER BY date)` |
| [AVG](../07-aggregate-functions/aggregate-avg.md) | 计算窗口内的平均值 | ✓ | `AVG(score) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)` |
| [COUNT](../07-aggregate-functions/aggregate-count.md) | 计算窗口内的行数 | ✓ | `COUNT(*) OVER (PARTITION BY department)` |
| [MIN](../07-aggregate-functions/aggregate-min.md) | 返回窗口内的最小值 | ✓ | `MIN(price) OVER (PARTITION BY category)` |
| [MAX](../07-aggregate-functions/aggregate-max.md) | 返回窗口内的最大值 | ✓ | `MAX(price) OVER (PARTITION BY category)` |
| [ARRAY_AGG](../07-aggregate-functions/aggregate-array-agg.md) | 将值收集到数组中 | | `ARRAY_AGG(product) OVER (PARTITION BY category)` |
| [STDDEV_POP](../07-aggregate-functions/aggregate-stddev-pop.md) | 总体标准差 | ✓ | `STDDEV_POP(value) OVER (PARTITION BY group)` |
| [STDDEV_SAMP](../07-aggregate-functions/aggregate-stddev-samp.md) | 样本标准差 | ✓ | `STDDEV_SAMP(value) OVER (PARTITION BY group)` |
| [MEDIAN](../07-aggregate-functions/aggregate-median.md) | 中位数 | ✓ | `MEDIAN(response_time) OVER (PARTITION BY server)` |

**条件变体**

| 函数 | 描述 | 窗口框架支持 | 示例 |
|----------|-------------|---------------------|---------|  
| [COUNT_IF](../07-aggregate-functions/aggregate-count-if.md) | 条件计数 | ✓ | `COUNT_IF(status = 'complete') OVER (PARTITION BY dept)` |
| [SUM_IF](../07-aggregate-functions/aggregate-sum-if.md) | 条件求和 | ✓ | `SUM_IF(amount, status = 'paid') OVER (PARTITION BY customer)` |
| [AVG_IF](../07-aggregate-functions/aggregate-avg-if.md) | 条件平均值 | ✓ | `AVG_IF(score, passed = true) OVER (PARTITION BY class)` |
| [MIN_IF](../07-aggregate-functions/aggregate-min-if.md) | 条件最小值 | ✓ | `MIN_IF(temp, location = 'outside') OVER (PARTITION BY day)` |
| [MAX_IF](../07-aggregate-functions/aggregate-max-if.md) | 条件最大值 | ✓ | `MAX_IF(speed, vehicle = 'car') OVER (PARTITION BY test)` |

## 基本语法

所有窗口函数都遵循以下模式：

```sql
FUNCTION() OVER (
    [ PARTITION BY column ]
    [ ORDER BY column ]
    [ window_frame ]
)
```

- **PARTITION BY**：将数据划分为组
- **ORDER BY**：对每个分区内的行进行排序
- **window_frame**：定义要包含的行（可选）

## 常见用例

- **排名**：创建排行榜和 Top-N 列表
- **分析**：计算累计总和、移动平均值、百分位数
- **比较**：比较当前值与前一个/后一个值
- **分组**：在不丢失细节的情况下将数据划分为桶

有关详细的语法和示例，请参阅上面各个函数的文档。