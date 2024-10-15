---
title: DATE_DIFF
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.645"/>

Calculates the difference between two dates or timestamps based on a specified time unit. The result is positive if the `<end_date>` is after the `<start_date>`, and negative if it's before.

## Syntax

```sql
DATE_DIFF(<unit>, <start_date>, <end_date>)
```

| Parameter      | Description                                                                                                 |
|----------------|-------------------------------------------------------------------------------------------------------------|
| `<unit>`       | The time unit for the difference: `YEAR`, `QUARTER`, `MONTH`, `WEEK`, `DAY`, `HOUR`, `MINUTE`, or `SECOND`. |
| `<start_date>` | The starting date or timestamp.                                                                             |
| `<end_date>`   | The ending date or timestamp.                                                                               |

## Examples

This example calculates the difference in hours between **yesterday** and **today**:

```sql
SELECT DATE_DIFF(HOUR, YESTERDAY(), TODAY());

-[ RECORD 1 ]-----------------------------------
DATE_DIFF(HOUR, yesterday(), today()): 24
```

This example calculates the difference in years between the current date and January 1, 2000;

```sql
SELECT NOW(), DATE_DIFF(YEAR, NOW(), TO_DATE('2000-01-01'));

-[ RECORD 1 ]-----------------------------------
                                        now(): 2024-10-15 03:06:37.202434
DATE_DIFF(YEAR, now(), to_date('2000-01-01')): -24
```