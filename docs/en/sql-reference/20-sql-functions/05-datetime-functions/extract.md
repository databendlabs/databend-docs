---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.153"/>

Retrieves the designated portion of a date, time, or timestamp.

See also: [DATE_PART](date-part.md)

## Syntax

```sql
EXTRACT( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY FROM <date_or_time_expr> )
```

- DOW: Day of the Week.
- DOY: Day of Year.

## Return Type

Integer.

## Examples

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