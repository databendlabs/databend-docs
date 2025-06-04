---
title: 间隔函数（Interval Functions）
---

本节提供 Databend 中间隔函数（Interval Functions）的参考信息。这些函数允许您创建各种时间单位的间隔值，用于日期和时间计算。

## 时间单位转换函数

### 基于天的间隔

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [TO_DAYS](to-days) | 将数字转换为天数间隔 | `TO_DAYS(2)` → `2 days` |
| [TO_WEEKS](to-weeks) | 将数字转换为周数间隔 | `TO_WEEKS(3)` → `21 days` |
| [TO_MONTHS](to-months) | 将数字转换为月数间隔 | `TO_MONTHS(2)` → `2 months` |
| [TO_YEARS](to-years) | 将数字转换为年数间隔 | `TO_YEARS(1)` → `1 year` |

### 基于小时的间隔

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [TO_HOURS](to-hours) | 将数字转换为小时间隔 | `TO_HOURS(5)` → `5:00:00` |
| [TO_MINUTES](to-minutes) | 将数字转换为分钟间隔 | `TO_MINUTES(90)` → `1:30:00` |
| [TO_SECONDS](to-seconds) | 将数字转换为秒数间隔 | `TO_SECONDS(3600)` → `1:00:00` |
| [EPOCH](epoch) | TO_SECONDS 的别名 | `EPOCH(60)` → `00:01:00` |

### 更小的时间单位

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [TO_MILLISECONDS](to-milliseconds) | 将数字转换为毫秒间隔 | `TO_MILLISECONDS(2000)` → `00:00:02` |
| [TO_MICROSECONDS](to-microseconds) | 将数字转换为微秒间隔 | `TO_MICROSECONDS(2000000)` → `00:00:02` |

### 更大的时间单位

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [TO_DECADES](to-decades) | 将数字转换为十年间隔 | `TO_DECADES(2)` → `20 years` |
| [TO_CENTRIES](to-centries) | 将数字转换为世纪间隔 | `TO_CENTRIES(1)` → `100 years` |
| [TO_MILLENNIA](to-millennia) | 将数字转换为千年间隔 | `TO_MILLENNIA(1)` → `1000 years` |