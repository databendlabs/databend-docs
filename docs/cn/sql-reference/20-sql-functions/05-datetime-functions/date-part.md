---
title: DATE_PART
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.723"/>

检索日期或时间戳的指定部分。

另请参阅：[EXTRACT](extract.md)

## 语法

```sql
DATE_PART(
  YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND |
  DOW | DOY | EPOCH | ISODOW | YEARWEEK | MILLENNIUM,
  <date_or_timestamp_expr>
)
```

| 关键字      | 描述                                                                  |
|--------------|-----------------------------------------------------------------------|
| `DOW`        | 星期几。 星期日 (0) 到星期六 (6)。                                       |
| `DOY`        | 一年中的第几天。 1 到 366。                                            |
| `EPOCH`      | 自 1970-01-01 00:00:00 以来的秒数。                                  |
| `ISODOW`     | ISO 星期几。 星期一 (1) 到星期日 (7)。                                 |
| `YEARWEEK`   | 遵循 ISO 8601 的年份和周数组合（例如，202415）。                       |
| `MILLENNIUM` | 日期的千年（1 表示 1-1000 年，2 表示 1001-2000 年，依此类推）。 |

## 返回类型

整数。

## 示例

此示例演示如何使用 DATE_PART 从当前时间戳中提取各种组成部分，例如年、月、ISO 星期几、年-周组合和千年：

```sql
SELECT
  DATE_PART(YEAR, NOW())        AS year_part,
  DATE_PART(QUARTER, NOW())     AS quarter_part,
  DATE_PART(MONTH, NOW())       AS month_part,
  DATE_PART(WEEK, NOW())        AS week_part,
  DATE_PART(DAY, NOW())         AS day_part,
  DATE_PART(HOUR, NOW())        AS hour_part,
  DATE_PART(MINUTE, NOW())      AS minute_part,
  DATE_PART(SECOND, NOW())      AS second_part,
  DATE_PART(DOW, NOW())         AS dow_part,
  DATE_PART(DOY, NOW())         AS doy_part,
  DATE_PART(EPOCH, NOW())       AS epoch_part,
  DATE_PART(ISODOW, NOW())      AS isodow_part,
  DATE_PART(YEARWEEK, NOW())    AS yearweek_part,
  DATE_PART(MILLENNIUM, NOW())  AS millennium_part;
```

```sql
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ year_part │ quarter_part │ month_part │ week_part │ day_part │ hour_part │ minute_part │ second_part │ dow_part │ doy_part │     epoch_part    │ isodow_part │ yearweek_part │ millennium_part │
├───────────┼──────────────┼────────────┼───────────┼──────────┼───────────┼─────────────┼─────────────┼──────────┼──────────┼───────────────────┼─────────────┼───────────────┼─────────────────┤
│      2025 │            2 │          4 │        16 │       16 │        18 │          10 │          10 │        3 │      106 │ 1744827010.257671 │           3 │        202516 │               3 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```