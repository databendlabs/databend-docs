---
title: DATE_TRUNC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Truncates a date or timestamp to a specified precision. For example, if you truncate `2022-07-07` to `MONTH`, the result will be `2022-07-01`; if you truncate `2022-07-07 01:01:01.123456` to `SECOND`, the result will be `2022-07-07 01:01:01.000000`.

## Syntax

```sql
DATE_TRUNC(<precision>, <date_or_timestamp>)
```

| Parameter             | Description                                                                                                |
|-----------------------|------------------------------------------------------------------------------------------------------------|
| `<precision>`         | Must be of the following values: `YEAR`, `QUARTER`, `MONTH`, `WEEK`, `DAY`, `HOUR`, `MINUTE` and `SECOND`. |
| `<date_or_timestamp>` | A value of `DATE` or `TIMESTAMP` type.                                                                     |

## Return Type

Same as `<date_or_timestamp>`.

## Examples

```sql
SELECT
    DATE_TRUNC(MONTH, to_date('2022-07-07')),
    DATE_TRUNC(WEEK, to_date('2022-07-07'));

┌────────────────────────────────────────────────────────────────────────────────────┐
│ DATE_TRUNC(MONTH, to_date('2022-07-07')) │ DATE_TRUNC(WEEK, to_date('2022-07-07')) │
├──────────────────────────────────────────┼─────────────────────────────────────────┤
│ 2022-07-01                               │ 2022-07-04                              │
└────────────────────────────────────────────────────────────────────────────────────┘
```
