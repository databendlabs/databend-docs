---
title: DATE_DIFF
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.723"/>

计算两个日期或时间戳之间基于指定时间单位的差值。如果 `<end_date>` 在 `<start_date>` 之后，结果为正；如果 `<end_date>` 在 `<start_date>` 之前，结果为负。

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
| `DOW`        | 星期几。 星期日 (0) 到星期六 (6)。                                      |
| `DOY`        | 一年中的第几天。 1 到 366。                                           |
| `EPOCH`      | 自 1970-01-01 00:00:00 以来的秒数。                                  |
| `ISODOW`     | ISO 星期几。 星期一 (1) 到星期日 (7)。                                 |
| `YEARWEEK`   | 年和周数的组合，遵循 ISO 8601 标准（例如，202415）。                  |
| `MILLENNIUM` | 日期的千年（1 代表 1-1000 年，2 代表 1001-2000 年，依此类推）。 |

## 示例

此示例计算固定时间戳 (`2020-01-01 00:00:00`) 与当前时间戳 (`NOW()`) 之间的差值，涵盖各种单位，如年、ISO 星期几、年-周和千年：

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