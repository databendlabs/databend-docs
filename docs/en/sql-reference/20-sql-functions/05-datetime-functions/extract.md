---
title: EXTRACT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.692"/>

Retrieves the designated portion of a date, time, or timestamp.

See also: [DATE_PART](date-part.md)

## Syntax

```sql
EXTRACT( YEAR | QUARTER | MONTH | WEEK | DAY | HOUR | MINUTE | SECOND | DOW | DOY | EPOCH FROM <date_or_time_expr> )
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

```sql
SELECT NOW(), EXTRACT(DAY FROM NOW()), EXTRACT(DOY FROM NOW()), EXTRACT(EPOCH FROM NOW());

┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            now()           │ EXTRACT(DAY FROM now()) │ EXTRACT(DOY FROM now()) │ EXTRACT(EPOCH FROM now()) │
├────────────────────────────┼─────────────────────────┼─────────────────────────┼───────────────────────────┤
│ 2025-02-08 03:51:51.991167 │                       8 │                      39 │         1738986711.991167 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```