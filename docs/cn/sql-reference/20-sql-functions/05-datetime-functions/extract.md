---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.697"/>

从日期、时间戳或时间间隔中提取指定的部分。

另请参阅：[DATE_PART](date-part.md)

## 语法

```sql
-- 从日期或时间戳中提取
EXTRACT( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY | EPOCH FROM <date_or_timestamp> )

-- 从时间间隔中提取
EXTRACT( YEAR | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | MICROSECOND ｜ EPOCH FROM <interval> )
```

- `DOW`: 星期几。
- `DOY`: 一年中的第几天。
- `EPOCH`: 自 1970-01-01 00:00:00 以来的秒数。

## 返回类型

返回类型取决于提取的字段：

- 返回整数：当提取离散的日期或时间组件（例如 YEAR、MONTH、DAY、DOY、HOUR、MINUTE、SECOND）时，函数返回一个整数。

    ```sql
    SELECT EXTRACT(DAY FROM now());  -- 返回整数
    SELECT EXTRACT(DOY FROM now());  -- 返回整数
    ```

- 返回浮点数：当提取 EPOCH（自 1970-01-01 00:00:00 UTC 以来的秒数）时，函数返回一个浮点数，因为它可能包括小数秒。

    ```sql
    SELECT EXTRACT(EPOCH FROM now());  -- 返回浮点数
    ```

## 示例

此示例从当前时间戳中提取各种字段：

```sql
SELECT NOW(), EXTRACT(DAY FROM NOW()), EXTRACT(DOY FROM NOW()), EXTRACT(EPOCH FROM NOW());

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            now()           │ EXTRACT(DAY FROM now()) │ EXTRACT(DOY FROM now()) │ EXTRACT(EPOCH FROM now()) │
├────────────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────────┤
│ 2025-02-08 03:51:51.991167 │                       8 │                      39 │         1738986711.991167 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

此示例从时间间隔中提取天数：

```sql
SELECT EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL);

┌─────────────────────────────────────────────────────────────────┐
│ EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL) │
├─────────────────────────────────────────────────────────────────┤
│                                                               1 │
└─────────────────────────────────────────────────────────────────┘
```