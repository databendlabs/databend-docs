---
title: 日期与时间函数
---

本页面按功能分类，全面梳理 Databend 中的日期与时间函数，便于快速查阅。

## 当前日期与时间函数

| 函数                                      | 描述                     | 示例                                                 |
|-------------------------------------------|--------------------------|------------------------------------------------------|
| [NOW](now.md)                             | 返回当前日期和时间       | `NOW()` → `2024-06-04 17:42:31.123456`               |
| [CURRENT_TIMESTAMP](current-timestamp.md) | 返回当前日期和时间       | `CURRENT_TIMESTAMP()` → `2024-06-04 17:42:31.123456` |
| [TODAY](today.md)                         | 返回当前日期             | `TODAY()` → `2024-06-04`                             |
| [TOMORROW](tomorrow.md)                   | 返回明天的日期           | `TOMORROW()` → `2024-06-05`                          |
| [YESTERDAY](yesterday.md)                 | 返回昨天的日期           | `YESTERDAY()` → `2024-06-03`                         |

## 日期与时间提取函数

| 函数                                      | 描述                     | 示例                                     |
|-------------------------------------------|--------------------------|------------------------------------------|
| [YEAR](year.md)                           | 提取日期中的年份         | `YEAR('2024-06-04')` → `2024`            |
| [MONTH](month.md)                         | 提取日期中的月份         | `MONTH('2024-06-04')` → `6`              |
| [DAY](day.md)                             | 提取日期中的日           | `DAY('2024-06-04')` → `4`                |
| [QUARTER](quarter.md)                     | 提取日期中的季度         | `QUARTER('2024-06-04')` → `2`            |
| [WEEK](week.md) / [WEEKOFYEAR](weekofyear.md) | 提取日期中的周数         | `WEEK('2024-06-04')` → `23`              |
| [EXTRACT](extract.md)                     | 提取日期的指定部分       | `EXTRACT(MONTH FROM '2024-06-04')` → `6` |
| [DATE_PART](date-part.md)                 | 提取日期的指定部分       | `DATE_PART('month', '2024-06-04')` → `6` |
| [YEARWEEK](yearweek.md)                   | 返回年份和周数           | `YEARWEEK('2024-06-04')` → `202423`      |
| [MILLENNIUM](millennium.md)               | 返回日期所在的千年       | `MILLENNIUM('2024-06-04')` → `3`         |

## 日期与时间转换函数

| 函数                                      | 描述                               | 示例                                                          |
|-------------------------------------------|------------------------------------|---------------------------------------------------------------|
| [DATE](date.md)                           | 将值转换为 DATE 类型               | `DATE('2024-06-04')` → `2024-06-04`                           |
| [TO_DATE](to-date.md)                     | 将字符串转换为 DATE 类型           | `TO_DATE('2024-06-04')` → `2024-06-04`                        |
| [TO_DATETIME](to-datetime.md)             | 将字符串转换为 DATETIME 类型       | `TO_DATETIME('2024-06-04 12:30:45')` → `2024-06-04 12:30:45`  |
| [TO_TIMESTAMP](to-timestamp.md)           | 将字符串转换为 TIMESTAMP 类型      | `TO_TIMESTAMP('2024-06-04 12:30:45')` → `2024-06-04 12:30:45` |
| [TO_UNIX_TIMESTAMP](to-unix-timestamp.md) | 将日期转换为 Unix 时间戳           | `TO_UNIX_TIMESTAMP('2024-06-04')` → `1717516800`              |
| [TO_YYYYMM](to-yyyymm.md)                 | 将日期格式化为 YYYYMM              | `TO_YYYYMM('2024-06-04')` → `202406`                          |
| [TO_YYYYMMDD](to-yyyymmdd.md)             | 将日期格式化为 YYYYMMDD            | `TO_YYYYMMDD('2024-06-04')` → `20240604`                      |
| [TO_YYYYMMDDHH](to-yyyymmddhh.md)         | 将日期格式化为 YYYYMMDDHH          | `TO_YYYYMMDDHH('2024-06-04 12:30:45')` → `2024060412`         |
| [TO_YYYYMMDDHHMMSS](to-yyyymmddhhmmss.md) | 将日期格式化为 YYYYMMDDHHMMSS      | `TO_YYYYMMDDHHMMSS('2024-06-04 12:30:45')` → `20240604123045` |
| [DATE_FORMAT](date-format.md)             | 按格式字符串格式化日期             | `DATE_FORMAT('2024-06-04', '%Y-%m-%d')` → `'2024-06-04'`      |

## 日期与时间算术函数

| 函数                                     | 描述                                                         | 示例                                                                                 |
|------------------------------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------------|
| [DATE_ADD](date-add.md)                  | 向日期添加时间间隔                                           | `DATE_ADD(DAY, 7, '2024-06-04')` → `2024-06-11`                                      |
| [DATE_SUB](date-sub.md)                  | 从日期减去时间间隔                                           | `DATE_SUB(MONTH, 1, '2024-06-04')` → `2024-05-04`                                    |
| [ADD INTERVAL](addinterval.md)           | 向日期添加间隔                                               | `'2024-06-04' + INTERVAL 1 DAY` → `2024-06-05`                                       |
| [SUBTRACT INTERVAL](subtractinterval.md) | 从日期减去间隔                                               | `'2024-06-04' - INTERVAL 1 MONTH` → `2024-05-04`                                     |
| [DATE_DIFF](date-diff.md)                | 返回两个日期之间的差值                                       | `DATE_DIFF(DAY, '2024-06-01', '2024-06-04')` → `3`                                   |
| [TIMESTAMP_DIFF](timestamp-diff.md)      | 返回两个时间戳之间的差值                                     | `TIMESTAMP_DIFF(HOUR, '2024-06-04 10:00:00', '2024-06-04 15:00:00')` → `5`           |
| [MONTHS_BETWEEN](months-between.md)      | 返回两个日期之间的月数                                       | `MONTHS_BETWEEN('2024-06-04', '2024-01-04')` → `5`                                   |
| [DATE_BETWEEN](date-between.md)          | 检查日期是否介于另外两个日期之间                             | `DATE_BETWEEN('2024-06-04', '2024-06-01', '2024-06-10')` → `true`                    |
| [AGE](age.md)                            | 计算两个时间戳或时间戳与当前日期/时间之间的差值              | `AGE('2000-01-01'::TIMESTAMP, '1990-05-15'::TIMESTAMP)` → `9 years 7 months 17 days` |
| [ADD_MONTHS](add-months.md)              | 向日期添加月份，同时保留月末日期                             | `ADD_MONTHS('2025-04-30',1)` → `2025-05-31`                                          |

## 日期与时间截断函数

| 函数                                          | 描述                                                   | 示例                                                                |
|-----------------------------------------------|--------------------------------------------------------|---------------------------------------------------------------------|
| [DATE_TRUNC](date-trunc.md)                   | 将时间戳截断到指定精度                                 | `DATE_TRUNC('month', '2024-06-04')` → `2024-06-01`                  |
| [TIME_SLICE](time-slice.md)                   | 将单个日期/时间戳值映射到日历对齐的间隔                | `TIME_SLICE('2024-06-04', 4, 'MONTH', 'START')` → `2024-05-01`      |
| [TO_START_OF_DAY](to-start-of-day.md)         | 返回当天的起始时间                                     | `TO_START_OF_DAY('2024-06-04 12:30:45')` → `2024-06-04 00:00:00`    |
| [TO_START_OF_HOUR](to-start-of-hour.md)       | 返回当前小时的起始时间                                 | `TO_START_OF_HOUR('2024-06-04 12:30:45')` → `2024-06-04 12:00:00`   |
| [TO_START_OF_MINUTE](to-start-of-minute.md)   | 返回当前分钟的起始时间                                 | `TO_START_OF_MINUTE('2024-06-04 12:30:45')` → `2024-06-04 12:30:00` |
| [TO_START_OF_MONTH](to-start-of-month.md)     | 返回当月的第一天                                       | `TO_START_OF_MONTH('2024-06-04')` → `2024-06-01`                    |
| [TO_START_OF_QUARTER](to-start-of-quarter.md) | 返回当季度的第一天                                     | `TO_START_OF_QUARTER('2024-06-04')` → `2024-04-01`                  |
| [TO_START_OF_YEAR](to-start-of-year.md)       | 返回当年的第一天                                       | `TO_START_OF_YEAR('2024-06-04')` → `2024-01-01`                     |
| [TO_START_OF_WEEK](to-start-of-week.md)       | 返回当周的第一天                                       | `TO_START_OF_WEEK('2024-06-04')` → `2024-06-03`                     |

## 日期与时间导航函数

| 函数                            | 描述                                       | 示例                                                  |
|---------------------------------|--------------------------------------------|-------------------------------------------------------|
| [LAST_DAY](last-day.md)         | 返回月份的最后一天                         | `LAST_DAY('2024-06-04')` → `2024-06-30`               |
| [NEXT_DAY](next-day.md)         | 返回下一个指定星期几的日期                 | `NEXT_DAY('2024-06-04', 'SUNDAY')` → `2024-06-09`     |
| [PREVIOUS_DAY](previous-day.md) | 返回上一个指定星期几的日期                 | `PREVIOUS_DAY('2024-06-04', 'MONDAY')` → `2024-06-03` |

## 其他日期与时间函数

| 函数                      | 描述         | 示例                                                                     |
|---------------------------|--------------|--------------------------------------------------------------------------|
| [TIMEZONE](timezone.md)   | 返回当前时区 | `TIMEZONE()` → `'UTC'`                                                   |
| [TIME_SLOT](time-slot.md) | 返回时间槽   | `TIME_SLOT('2024-06-04 12:30:45', 15, 'MINUTE')` → `2024-06-04 12:30:00` |