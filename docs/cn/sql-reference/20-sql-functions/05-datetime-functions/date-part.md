---
title: DATE_PART
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.153"/>

检索日期、时间或时间戳的指定部分。

另请参阅：[EXTRACT](extract.md)

## 语法

```sql
DATE_PART( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY, <date_or_time_expr> )
```

- DOW: Day of Week.
- DOY: Day of Year.

## 返回类型

Integer.

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