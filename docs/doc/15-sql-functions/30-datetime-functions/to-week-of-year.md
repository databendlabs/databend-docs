---
title: TO_WEEK_OF_YEAR
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.151"/>

Calculates the week number within a year for a given date.

ISO week numbering works as follows: January 4th is always considered part of the first week. If January 1st is a Thursday, then the week that spans from Monday, December 29th, to Sunday, January 4th, is designated as ISO week 1. If January 1st falls on a Friday, then the week that goes from Monday, January 4th, to Sunday, January 10th, is marked as ISO week 1.

## Syntax

```sql
TO_WEEK_OF_YEAR(<expr>)
```

## Arguments

| Arguments | Description    |
|-----------|----------------|
| `<expr>`  | date/timestamp |

## Return Type

Returns an integer that represents the week number within a year, with numbering ranging from 1 to 53.

## Examples

```sql
SELECT
  to_week_of_year('2023-11-12 09:38:18.165575')

┌───────────────────────────────────────────────┐
│ to_week_of_year('2023-11-12 09:38:18.165575') │
│                     UInt8                     │
├───────────────────────────────────────────────┤
│                                            45 │
└───────────────────────────────────────────────┘
```
