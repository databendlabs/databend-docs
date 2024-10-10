---
title: DATE_ADD
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.641"/>

Adds a specified time interval to a DATE or TIMESTAMP value.

## Syntax

```sql
DATE_ADD(<unit>, <interval>,  <date_or_time_expr>)
```

| Parameter             | Description                                                                                        |
|-----------------------|----------------------------------------------------------------------------------------------------|
| `<unit>`              | Specifies the time unit: `YEAR`, `QUARTER`, `MONTH`, `WEEK`, `DAY`, `HOUR`, `MINUTE` and `SECOND`. |
| `<interval>`          | The interval to add, e.g., 2 for 2 days if the unit is `DAY`.                                      |
| `<date_or_time_expr>` | A value of `DATE` or `TIMESTAMP` type.                                                             |

## Return Type

DATE or TIMESTAMP (depending on the type of `<date_or_time_expr>`).

## Examples

This example adds different time intervals (year, quarter, month, week, and day) to the current date:

```sql
SELECT
    TODAY(),
    DATE_ADD(YEAR, 1, TODAY()),
    DATE_ADD(QUARTER, 1, TODAY()),
    DATE_ADD(MONTH, 1, TODAY()),
    DATE_ADD(WEEK, 1, TODAY()),
    DATE_ADD(DAY, 1, TODAY());

-[ RECORD 1 ]-----------------------------------
                      today(): 2024-10-10
   DATE_ADD(YEAR, 1, today()): 2025-10-10
DATE_ADD(QUARTER, 1, today()): 2025-01-10
  DATE_ADD(MONTH, 1, today()): 2024-11-10
   DATE_ADD(WEEK, 1, today()): 2024-10-17
    DATE_ADD(DAY, 1, today()): 2024-10-11
```

This example adds different time intervals (hour, minute, and second) to the current timestamp:

```sql
SELECT
    NOW(),
    DATE_ADD(HOUR, 1, NOW()),
    DATE_ADD(MINUTE, 1, NOW()),
    DATE_ADD(SECOND, 1, NOW());

-[ RECORD 1 ]-----------------------------------
                     now(): 2024-10-10 01:35:33.601312
  DATE_ADD(HOUR, 1, now()): 2024-10-10 02:35:33.601312
DATE_ADD(MINUTE, 1, now()): 2024-10-10 01:36:33.601312
DATE_ADD(SECOND, 1, now()): 2024-10-10 01:35:34.601312
```