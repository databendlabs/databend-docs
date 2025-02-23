---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.697"/>

Retrieves the designated portion of a date, timestamp, or interval.

See also: [DATE_PART](date-part.md)

## Syntax

```sql
-- Extract from a date or timestamp
EXTRACT( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY | EPOCH FROM <date_or_timestamp> )

-- Extract from an interval
EXTRACT( YEAR | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | EPOCH FROM <interval> )
```

- `DOW`: Day of the Week.
- `DOY`: Day of the Year.
- `EPOCH`: The number of seconds since 1970-01-01 00:00:00.

## Return Type

The return type depends on the field being extracted:

- Returns Integer: When extracting discrete date or time components (e.g., YEAR, MONTH, DAY, DOY, HOUR, MINUTE, SECOND), the function returns an Integer.

    ```sql
    SELECT EXTRACT(DAY FROM now());  -- Returns Integer
    SELECT EXTRACT(DOY FROM now());  -- Returns Integer
    ```

- Returns Float: When extracting EPOCH (the number of seconds since 1970-01-01 00:00:00 UTC), the function returns a Float, as it may include fractional seconds.

    ```sql
    SELECT EXTRACT(EPOCH FROM now());  -- Returns Float
    ```

## Examples

This example extracts various fields from the current timestamp:

```sql
SELECT NOW(), EXTRACT(DAY FROM NOW()), EXTRACT(DOY FROM NOW()), EXTRACT(EPOCH FROM NOW());

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            now()           │ EXTRACT(DAY FROM now()) │ EXTRACT(DOY FROM now()) │ EXTRACT(EPOCH FROM now()) │
├────────────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────────┤
│ 2025-02-08 03:51:51.991167 │                       8 │                      39 │         1738986711.991167 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This example extracts the number of days from an interval:

```sql
SELECT EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL);

┌─────────────────────────────────────────────────────────────────┐
│ EXTRACT(DAY FROM '1 day 2 hours 3 minutes 4 seconds'::INTERVAL) │
├─────────────────────────────────────────────────────────────────┤
│                                                               1 │
└─────────────────────────────────────────────────────────────────┘
```