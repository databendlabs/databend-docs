---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.153"/>

提取日期、时间或时间戳的指定部分。

另请参阅：[DATE_PART](date-part.md)

## 语法

```sql
EXTRACT( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY FROM <date_or_time_expr> )
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
│ 2024-05-22 03:00:35.977589 │
└────────────────────────────┘

SELECT EXTRACT(DAY FROM NOW());

┌─────────────────────────┐
│ extract(day from now()) │
├─────────────────────────┤
│                      22 │
└─────────────────────────┘

SELECT EXTRACT(DOW FROM NOW());

┌─────────────────────────┐
│ extract(dow from now()) │
├─────────────────────────┤
│                       3 │
└─────────────────────────┘

SELECT EXTRACT(DOY FROM NOW());

┌─────────────────────────┐
│ extract(doy from now()) │
├─────────────────────────┤
│                     143 │
└─────────────────────────┘

SELECT EXTRACT(MONTH FROM TO_DATE('2022-05-13'));

┌───────────────────────────────────────────┐
│ extract(month from to_date('2022-05-13')) │
│                   UInt8                   │
├───────────────────────────────────────────┤
│                                         5 │
└───────────────────────────────────────────┘
```