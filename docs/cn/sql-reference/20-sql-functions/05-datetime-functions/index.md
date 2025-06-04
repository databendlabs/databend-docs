---
title: 日期与时间函数（Date & Time Functions）
---

本页面提供 Databend 中日期与时间函数的全面概览，按功能分类以便参考。

## 当前日期与时间函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [NOW](now.md) | 返回当前日期和时间 | `NOW()` → `2024-06-04 17:42:31.123456` |
| [CURRENT_TIMESTAMP](current-timestamp.md) | 返回当前日期和时间 | `CURRENT_TIMESTAMP()` → `2024-06-04 17:42:31.123456` |
| [TODAY](today.md) | 返回当前日期 | `TODAY()` → `2024-06-04` |
| [TOMORROW](tomorrow.md) | 返回明日日期 | `TOMORROW()` → `2024-06-05` |
| [YESTERDAY](yesterday.md) | 返回昨日日期 | `YESTERDAY()` → `2024-06-03` |

## 日期与时间提取函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [YEAR](year.md) | 提取日期中的年份 | `YEAR('2024-06-04')` → `2024` |
| [MONTH](month.md) | 提取日期中的月份 | `MONTH('2024-06-04')` → `6` |
| [DAY](day.md) | 提取日期中的天数 | `DAY('2024-06-04')` → `4` |
| [QUARTER](quarter.md) | 提取日期中的季度 | `QUARTER('2024-06-04')` → `2` |
| [WEEK](week.md) / [WEEKOFYEAR](weekofyear.md) | 提取日期中的周数 | `WEEK('2024-06-04')` → `23` |
| [EXTRACT](extract.md) | 提取日期的指定部分 | `EXTRACT(MONTH FROM '2024-06-04')` → `6` |
| [DATE_PART](date-part.md) | 提取日期的指定部分 | `DATE_PART('month', '2024-06-04')` → `6` |
| [YEARWEEK](yearweek.md) | 返回年份和周数组合值 | `YEARWEEK('2024-06-04')` → `202423` |
| [MILLENNIUM](millennium.md) | 返回日期所属的千禧年 | `MILLENNIUM('2024-06-04')` → `3` |

## 日期与时间转换函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [DATE](date.md) | 转换值为 DATE 类型 | `DATE('2024-06-04')` → `2024-06-04` |
| [TO_DATE](to-date.md) | 转换字符串为 DATE 类型 | `TO_DATE('2024-06-04')` → `2024-06-04` |
| [TO_DATETIME](to-datetime.md) | 转换字符串为 DATETIME 类型 | `TO_DATETIME('2024-06-04 12:30:45')` → `2024-06-04 12:30:45` |
| [TO_TIMESTAMP](to-timestamp.md) | 转换字符串为 TIMESTAMP 类型 | `TO_TIMESTAMP('2024-06-04 12:30:45')` → `2024-06-04 12:30:45` |
| [TO_UNIX_TIMESTAMP](to-unix-timestamp.md) | 转换日期为 Unix 时间戳 | `TO_UNIX_TIMESTAMP('2024-06-04')` → `1717516800` |
| [TO_YYYYMM](to-yyyymm.md) | 格式化日期为 YYYYMM | `TO_YYYYMM('2024-06-04')` → `202406` |
| [TO_YYYYMMDD](to-yyyymmdd.md) | 格式化日期为 YYYYMMDD | `TO_YYYYMMDD('2024-06-04')` → `20240604` |
| [TO_YYYYMMDDHH](to-yyyymmddhh.md) | 格式化日期为 YYYYMMDDHH | `TO_YYYYMMDDHH('2024-06-04 12:30:45')` → `2024060412` |
| [TO_YYYYMMDDHHMMSS](to-yyyymmddhhmmss.md) | 格式化日期为 YYYYMMDDHHMMSS | `TO_YYYYMMDDHHMMSS('2024-06-04 12:30:45')` → `20240604123045` |
| [DATE_FORMAT](date-format.md) | 按格式字符串格式化日期 | `DATE_FORMAT('2024-06-04', '%Y-%m-%d')` → `'2024-06-04'` |

## 日期与时间算术函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [DATE_ADD](date-add.md) | 为日期添加时间间隔 | `DATE_ADD(DAY, 7, '2024-06-04')` → `2024-06-11` |
| [DATE_SUB](date-sub.md) | 从日期减去时间间隔 | `DATE_SUB(MONTH, 1, '2024-06-04')` → `2024-05-04` |
| [ADD INTERVAL](addinterval.md) | 为日期添加间隔 | `'2024-06-04' + INTERVAL 1 DAY` → `2024-06-05` |
| [SUBTRACT INTERVAL](subtractinterval.md) | 从日期减去间隔 | `'2024-06-04' - INTERVAL 1 MONTH` → `2024-05-04` |
| [DATE_DIFF](date-diff.md) | 计算两个日期的差值 | `DATE_DIFF(DAY, '2024-06-01', '2024-06-04')` → `3` |
| [TIMESTAMP_DIFF](timestamp-diff.md) | 计算两个时间戳的差值 | `TIMESTAMP_DIFF(HOUR, '2024-06-04 10:00:00', '2024-06-04 15:00:00')` → `5` |
| [MONTHS_BETWEEN](months-between.md) | 计算两个日期间的月份数 | `MONTHS_BETWEEN('2024-06-04', '2024-01-04')` → `5` |
| [DATE_BETWEEN](date-between.md) | 判断日期是否在指定范围内 | `DATE_BETWEEN('2024-06-04', '2024-06-01', '2024-06-10')` → `true` |

## 日期与时间截断函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [DATE_TRUNC](date-trunc.md) | 按精度截断时间戳 | `DATE_TRUNC('month', '2024-06-04')` → `2024-06-01` |
| [TO_START_OF_DAY](to-start-of-day.md) | 返回某日的起始时刻 | `TO_START_OF_DAY('2024-06-04 12:30:45')` → `2024-06-04 00:00:00` |
| [TO_START_OF_HOUR](to-start-of-hour.md) | 返回某小时的起始时刻 | `TO_START_OF_HOUR('2024-06-04 12:30:45')` → `2024-06-04 12:00:00` |
| [TO_START_OF_MINUTE](to-start-of-minute.md) | 返回某分钟的起始时刻 | `TO_START_OF_MINUTE('2024-06-04 12:30:45')` → `2024-06-04 12:30:00` |
| [TO_START_OF_MONTH](to-start-of-month.md) | 返回某月的起始日期 | `TO_START_OF_MONTH('2024-06-04')` → `2024-06-01` |
| [TO_START_OF_QUARTER](to-start-of-quarter.md) | 返回某季度的起始日期 | `TO_START_OF_QUARTER('2024-06-04')` → `2024-04-01` |
| [TO_START_OF_YEAR](to-start-of-year.md) | 返回某年的起始日期 | `TO_START_OF_YEAR('2024-06-04')` → `2024-01-01` |
| [TO_START_OF_WEEK](to-start-of-week.md) | 返回某周的起始日期 | `TO_START_OF_WEEK('2024-06-04')` → `2024-06-03` |

## 日期与时间导航函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [LAST_DAY](last-day.md) | 返回月份的最后一天 | `LAST_DAY('2024-06-04')` → `2024-06-30` |
| [NEXT_DAY](next-day.md) | 返回下个指定星期的日期 | `NEXT_DAY('2024-06-04', 'SUNDAY')` → `2024-06-09` |
| [PREVIOUS_DAY](previous-day.md) | 返回上个指定星期的日期 | `PREVIOUS_DAY('2024-06-04', 'MONDAY')` → `2024-06-03` |

## 其他日期与时间函数

| 函数 | 描述 | 示例 |
|------|------|------|
| [TIMEZONE](timezone.md) | 返回当前时区 | `TIMEZONE()` → `'UTC'` |
| [TIME_SLOT](time-slot.md) | 生成时间槽 | `TIME_SLOT('2024-06-04 12:30:45', 15, 'MINUTE')` → `2024-06-04 12:30:00` |