---
title: DATE_PART
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.153"/>

提取日期、时间或时间戳的指定部分。

另请参阅：[EXTRACT](extract.md)

## 语法

```sql
DATE_PART( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY, <date_or_time_expr> )
```

- DOW：星期几。
- DOY：一年中的第几天。

## 返回类型

整数。

## 示例

```sql
SELECT NOW();

┌────────────────────────────┐
│            now()           │
├────────────────────────────┤
│ 2024-05-22 02:55:52.954761 │
└────────────────────────────┘

SELECT DATE_PART(DAY, NOW());

┌───────────────────────┐
│ date_part(day, now()) │
├───────────────────────┤
│                    22 │
└───────────────────────┘

SELECT DATE_PART(DOW, NOW());

┌───────────────────────┐
│ date_part(dow, now()) │
├───────────────────────┤
│                     3 │
└───────────────────────┘

SELECT DATE_PART(DOY, NOW());

┌───────────────────────┐
│ date_part(doy, now()) │
├───────────────────────┤
│                   143 │
└───────────────────────┘

SELECT DATE_PART(MONTH, TO_DATE('2024-05-21'));

┌─────────────────────────────────────────┐
│ date_part(month, to_date('2024-05-21')) │
│                  UInt8                  │
├─────────────────────────────────────────┤
│                                       5 │
└─────────────────────────────────────────┘
```