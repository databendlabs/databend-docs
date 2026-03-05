---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.723"/>

检索日期、时间戳或间隔的指定部分。

另请参阅：[DATE_PART](date-part.md)

## 语法

```sql
-- 从日期或时间戳中提取
EXTRACT(
  YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND |
  DOW | DOY | EPOCH | ISODOW | YEARWEEK | MILLENNIUM
  FROM <date_or_timestamp>
)

-- 从间隔中提取
EXTRACT( YEAR | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | MICROSECOND ｜ EPOCH FROM <interval> )
```

| 关键字      | 描述                                                                  |
|--------------|-----------------------------------------------------------------------|
| `DOW`        | 星期几。 星期日 (0) 到星期六 (6)。                                      |
| `DOY`        | 一年中的第几天。 1 到 366。                                          |
| `EPOCH`      | 自 1970-01-01 00:00:00 以来的秒数。                                   |
| `ISODOW`     | ISO 星期几。 星期一 (1) 到星期日 (7)。                                |
| `YEARWEEK`   | 遵循 ISO 8601 的年份和周数组合（例如，202415）。                       |
| `MILLENNIUM` | 日期的千年（1 表示 1-1000 年，2 表示 1001-2000 年，依此类推）。 |

## 返回类型

返回类型取决于要提取的字段：

- 返回 Integer：当提取离散的日期或时间分量（例如，YEAR、MONTH、DAY、DOY、HOUR、MINUTE、SECOND）时，该函数返回一个 Integer。

    ```sql
    SELECT EXTRACT(DAY FROM now());  -- 返回 Integer
    SELECT EXTRACT(DOY FROM now());  -- 返回 Integer
    ```

- 返回 Float：当提取 EPOCH（自 1970-01-01 00:00:00 UTC 以来的秒数）时，该函数返回一个 Float，因为它可能包含小数秒。

    ```sql
    SELECT EXTRACT(EPOCH FROM now());  -- 返回 Float
    ```

## 示例

此示例从当前时间戳中提取各种字段：

```sql
SELECT 
  NOW(), 
  EXTRACT(DAY FROM NOW()), 
  EXTRACT(DOY FROM NOW()), 
  EXTRACT(EPOCH FROM NOW()), 
  EXTRACT(ISODOW FROM NOW()), 
  EXTRACT(YEARWEEK FROM NOW()), 
  EXTRACT(MILLENNIUM FROM NOW());

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            now()           │ EXTRACT(DAY FROM now()) │ EXTRACT(DOY FROM now()) │ EXTRACT(EPOCH FROM now()) │ EXTRACT(ISODOW FROM now()) │ EXTRACT(YEARWEEK FROM now()) │ EXTRACT(MILLENNIUM FROM now()) │
├────────────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────────┼────────────────────────────┼──────────────────────────────┼────────────────────────────────┤
│ 2025-04-16 18:04:22.773888 │                      16 │                     106 │         1744826662.773888 │                          3 │                       202516 │                              3 │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例从间隔中提取天数：

```sql
SELECT EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL);

┌─────────────────────────────────────────────────────────────────┐
│ EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL) │
├─────────────────────────────────────────────────────────────────┤
│                                                               1 │
└─────────────────────────────────────────────────────────────────┘
```