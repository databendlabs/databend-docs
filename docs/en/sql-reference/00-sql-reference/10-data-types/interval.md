---
title: Interval
sidebar_position: 7
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

## Overview

`INTERVAL` represents a duration that can be written in natural-language text (`'1 year 2 months'`, `'3 days ago'`) or as an integer number of microseconds. Databend supports units from millennia down to microseconds and allows arithmetic on intervals, dates, and timestamps.

:::note
A fractional quantity is rounded to a whole number of its unit, with halves rounded away from zero. `'1.3 hours'` becomes 1 hour, `'1.5 hours'` becomes 2 hours, and `'-1.5 hours'` becomes -2 hours. To keep the fraction, use a smaller unit (`'90 minutes'`) or clock notation (`'01:30:00'`, `'00:00:01.5'`).
:::

## Examples

### Literals and Numeric Values

```sql
CREATE OR REPLACE TABLE intervals (duration INTERVAL);

INSERT INTO intervals VALUES
  ('1 year 2 months'),       -- positive natural language
  ('1 year 2 months ago'),   -- negative because of "ago"
  ('1000000'),               -- 1 second in microseconds
  ('-1000000');              -- -1 second

SELECT TO_STRING(duration) AS duration_text FROM intervals;
```

Result:
```
┌──────────────────────┐
│ duration_text        │
├──────────────────────┤
│ 1 year 2 months      │
│ -1 year -2 months    │
│ 0:00:01              │
│ -0:00:01             │
└──────────────────────┘
```

```sql
SELECT
  TO_STRING(TO_INTERVAL('1.3 hours'))   AS round_down,
  TO_STRING(TO_INTERVAL('1.5 hours'))   AS round_up,
  TO_STRING(TO_INTERVAL('1.5 days'))    AS days,
  TO_STRING(TO_INTERVAL('90 minutes'))  AS minutes,
  TO_STRING(TO_INTERVAL('00:00:01.5'))  AS clock;
```

Result:
```
┌────────────┬──────────┬────────┬─────────┬───────────┐
│ round_down │ round_up │ days   │ minutes │ clock     │
├────────────┼──────────┼────────┼─────────┼───────────┤
│ 1:00:00    │ 2:00:00  │ 2 days │ 1:30:00 │ 0:00:01.5 │
└────────────┴──────────┴────────┴─────────┴───────────┘
```

Because `'1.5 days'` becomes 2 calendar days, adding it to a TIMESTAMP keeps the wall-clock time even across a daylight saving time change.

### Interval Arithmetic

```sql
SELECT
  TO_STRING(TO_DAYS(3) + TO_DAYS(1)) AS add_interval,
  TO_STRING(TO_DAYS(3) - TO_DAYS(1)) AS subtract_interval;
```

Result:
```
┌──────────────┬──────────────────┐
│ add_interval │ subtract_interval │
├──────────────┼──────────────────┤
│ 4 days       │ 2 days           │
└──────────────┴──────────────────┘
```

### Apply to DATE and TIMESTAMP

```sql
SELECT
  DATE '2024-12-20' + TO_DAYS(2) AS add_days,
  DATE '2024-12-20' - TO_DAYS(2) AS subtract_days,
  TIMESTAMP '2024-12-20 10:00:00' + TO_HOURS(36) AS add_hours,
  TIMESTAMP '2024-12-20 10:00:00' - TO_HOURS(36) AS subtract_hours;
```

Result:
```
┌────────────────────┬────────────────────┬────────────────────┬────────────────────┐
│ add_days           │ subtract_days      │ add_hours          │ subtract_hours     │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ 2024-12-22T00:00:00 │ 2024-12-18T00:00:00 │ 2024-12-21T22:00:00 │ 2024-12-18T22:00:00 │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

Intervals are added or subtracted just like numbers, making it easy to slide windows or compute offsets with precise control down to microseconds.
