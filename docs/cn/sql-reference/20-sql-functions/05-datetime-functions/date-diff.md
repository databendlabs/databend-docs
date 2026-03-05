---
title: DATE_DIFF
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.723"/>

计算基于指定时间单位的两个日期或时间戳之间的差值。如果 `<end_date>` 在 `<start_date>` 之后，则结果为正；如果 `<end_date>` 在 `<start_date>` 之前，则结果为负。

另请参阅：[DATE_BETWEEN](date-between.md)

## 语法

```sql
DATE_DIFF(
  YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND |
  DOW | DOY | EPOCH | ISODOW | YEARWEEK | MILLENNIUM,
  <start_date_or_timestamp>,
  <end_date_or_timestamp>
)
```

| 关键字      | 描述                                                                  |
|--------------|-----------------------------------------------------------------------|
| `DOW`        | Day of the Week. 星期日 (0) 到星期六 (6).                               |
| `DOY`        | Day of the Year. 1 到 366.                                             |
| `EPOCH`      | 自 1970-01-01 00:00:00 以来的秒数。                                     |
| `ISODOW`     | ISO Day of the Week. 星期一 (1) 到星期日 (7).                           |
| `YEARWEEK`   | 遵循 ISO 8601 的年份和周数组合 (例如，202415)。                         |
| `MILLENNIUM` | 日期的千年 (1 表示 1–1000 年，2 表示 1001–2000 年，依此类推)。 |

## DATE_DIFF vs. DATE_BETWEEN

`DATE_DIFF` 函数计算两个日期之间跨越的用户指定单位（如天、月或年）的边界数，而 `DATE_BETWEEN` 计算严格介于它们之间的完整单位数。例如：

```sql
SELECT
    DATE_DIFF(month, '2025-07-31', '2025-10-01'),    -- returns 3
    DATE_BETWEEN(month, '2025-07-31', '2025-10-01'); -- returns 2
```

在此示例中，`DATE_DIFF` 返回 `3`，因为该范围跨越了三个月边界（7 月 → 8 月 → 9 月 → 10 月），而 `DATE_BETWEEN` 返回 `2`，因为日期之间有两个完整的月份：8 月和 9 月。

## 示例

此示例计算固定时间戳 (`2020-01-01 00:00:00`) 与当前时间戳 (`NOW()`) 之间在各种单位（如年、ISO 工作日、年-周和千年）上的差异：

```sql
SELECT
  DATE_DIFF(YEAR,        TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_year,
  DATE_DIFF(QUARTER,     TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_quarter,
  DATE_DIFF(MONTH,       TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_month,
  DATE_DIFF(WEEK,        TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_week,
  DATE_DIFF(DAY,         TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_day,
  DATE_DIFF(HOUR,        TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_hour,
  DATE_DIFF(MINUTE,      TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_minute,
  DATE_DIFF(SECOND,      TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_second,
  DATE_DIFF(DOW,         TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_dow,
  DATE_DIFF(DOY,         TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_doy,
  DATE_DIFF(EPOCH,       TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_epoch,
  DATE_DIFF(ISODOW,      TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_isodow,
  DATE_DIFF(YEARWEEK,    TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_yearweek,
  DATE_DIFF(MILLENNIUM,  TIMESTAMP '2020-01-01 00:00:00', NOW())        AS diff_millennium;
```

```sql
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ diff_year │ diff_quarter │ diff_month │ diff_week │ diff_day │ diff_hour │ diff_minute │ diff_second │ diff_dow │ diff_doy │ diff_epoch │ diff_isodow │ diff_yearweek │ diff_millennium │
├───────────┼──────────────┼────────────┼───────────┼──────────┼───────────┼─────────────┼─────────────┼──────────┼──────────┼────────────┼─────────────┼───────────────┼─────────────────┤
│         5 │           21 │         63 │       276 │     1932 │     46386 │     2783184 │   166991069 │     1932 │     1932 │  166991069 │        1932 │           515 │               0 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```