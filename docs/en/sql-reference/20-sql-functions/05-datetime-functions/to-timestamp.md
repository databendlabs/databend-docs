---
title: TO_TIMESTAMP
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.397"/>

Converts an expression to a date with time.

See also: [TO_DATE](to-date)

## Syntax

```sql
-- Convert a string or integer to a timestamp
TO_TIMESTAMP(<expr>)
```

If given an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date format string, the function extracts a date from the string; If given is an integer, the function interprets the integer as the number of seconds, milliseconds, or microseconds before (for a negative number) or after (for a positive number) the Unix epoch (midnight on January 1, 1970):

| Range                                       | Unit                 |
|---------------------------------------------|----------------------|
| x < 31,536,000,000                          | Seconds              |
| 31,536,000,000 ≤ x < 31,536,000,000,000     | Milliseconds         |
| x ≥ 31,536,000,000,000                      | Microseconds         |

```sql
-- Convert a string to a timestamp using the given pattern
TO_TIMESTAMP(<expr>, <pattern>)
```

If given two arguments, the function converts the first string to a timestamp based on the pattern specified in the second string. To specify the pattern, use specifiers. The specifiers allow you to define the desired format for date and time values. For a comprehensive list of supported specifiers, see [Formatting Date and Time](../../00-sql-reference/10-data-types/20-data-type-time-date-types.md#formatting-date-and-time).

## Return Type

Returns a timestamp in the format `YYYY-MM-DD hh:mm:ss.ffffff`: 

- The returned timestamp always reflects your Databend timezone.
    - When timezone information is present in the given string, it converts the timestamp to the time corresponding to the timezone configured in Databend. In other words, it adjusts the timestamp to reflect the timezone set in Databend.

    ```sql
    -- Set timezone to 'America/Toronto' (UTC-5:00, Eastern Standard Time)
    SET timezone = 'America/Toronto';

    SELECT TO_TIMESTAMP('2022-01-02T01:12:00-07:00'), TO_TIMESTAMP('2022/01/02T01:12:00-07:00', '%Y/%m/%dT%H:%M:%S%::z');

    ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │ to_timestamp('2022-01-02t01:12:00-07:00') │ to_timestamp('2022/01/02t01:12:00-07:00', '%y/%m/%dt%h:%m:%s%::z') │
    ├───────────────────────────────────────────┼────────────────────────────────────────────────────────────────────┤
    │ 2022-01-02 03:12:00                       │ 2022-01-02 03:12:00                                                │
    └────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
    ```

    - In the absence of timezone information in the given string, it assumes the timestamp as belonging to the timezone configured in Databend. However, when the timestamp comes along with a pattern, it is assumed to be in the UTC timezone.

    ```sql
    -- Set timezone to 'America/Toronto' (UTC-5:00, Eastern Standard Time)
    SET timezone = 'America/Toronto';
    
    -- The 1st TO_TIMESTAMP interprets the timestamp without a pattern, 
    -- assuming it belongs to the timezone configured in Databend.
    -- The 2nd TO_TIMESTAMP interprets the timestamp with a pattern, 
    -- assuming it belongs to the UTC timezone.
    -- As a result, the timestamps are converted differently, leading to the difference in output.
    SELECT TO_TIMESTAMP('2022-01-02T01:12:00'), TO_TIMESTAMP('2022/01/02T01:12:00', '%Y/%m/%dT%H:%M:%S');

    ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
    │ to_timestamp('2022-01-02t01:12:00') │ to_timestamp('2022/01/02t01:12:00', '%y/%m/%dt%h:%m:%s') │
    ├─────────────────────────────────────┼──────────────────────────────────────────────────────────┤
    │ 2022-01-02 01:12:00                 │ 2022-01-01 20:12:00                                      │
    └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ```

- If the given string matches this format but does not have the time part, it is automatically extended to this pattern. The padding value is 0.

## Aliases

- [TO_DATETIME](to-datetime.md)
- [STR_TO_TIMESTAMP](str-to-timestamp.md)

## Examples

### Example-1: Converting String to Timestamp

```sql
SELECT TO_TIMESTAMP('2022-01-02 02:00:11');

┌─────────────────────────────────────┐
│ to_timestamp('2022-01-02 02:00:11') │
├─────────────────────────────────────┤
│ 2022-01-02 02:00:11                 │
└─────────────────────────────────────┘

SELECT TO_TIMESTAMP('2022-01-02T01');

┌───────────────────────────────┐
│ to_timestamp('2022-01-02t01') │
├───────────────────────────────┤
│ 2022-01-02 01:00:00           │
└───────────────────────────────┘

-- Set timezone to 'America/Toronto' (UTC-5:00, Eastern Standard Time)
SET timezone = 'America/Toronto';
-- Convert provided string to current timezone ('America/Toronto')
SELECT TO_TIMESTAMP('2022-01-02T01:12:00-07:00');

┌───────────────────────────────────────────┐
│ to_timestamp('2022-01-02t01:12:00-07:00') │
├───────────────────────────────────────────┤
│ 2022-01-02 03:12:00                       │
└───────────────────────────────────────────┘
```

### Example-2: Converting Integer to Timestamp

```sql
SELECT TO_TIMESTAMP(1), TO_TIMESTAMP(-1);

┌───────────────────────────────────────────┐
│   to_timestamp(1)   │  to_timestamp(- 1)  │
├─────────────────────┼─────────────────────┤
│ 1969-12-31 19:00:01 │ 1969-12-31 18:59:59 │
└───────────────────────────────────────────┘
```

:::tip

Please note that a Timestamp value ranges from 1000-01-01 00:00:00.000000 to 9999-12-31 23:59:59.999999. Databend would return an error if you run the following statement:

```sql
SELECT TO_TIMESTAMP(9999999999999999999);
```
:::

### Example-3: Converting String with Pattern

```sql
-- Set timezone to 'America/Toronto' (UTC-5:00, Eastern Standard Time)
SET timezone = 'America/Toronto';

-- Convert provided string to current timezone ('America/Toronto')
SELECT TO_TIMESTAMP('2022/01/02T01:12:00-07:00', '%Y/%m/%dT%H:%M:%S%::z');

┌────────────────────────────────────────────────────────────────────┐
│ to_timestamp('2022/01/02t01:12:00-07:00', '%y/%m/%dt%h:%m:%s%::z') │
├────────────────────────────────────────────────────────────────────┤
│ 2022-01-02 03:12:00                                                │
└────────────────────────────────────────────────────────────────────┘

-- When no timezone is provided in the input string, the time is assumed to be in UTC by default
-- The provided string is converted from UTC to the current timezone ('America/Toronto')
SELECT TO_TIMESTAMP('2022/01/02T01:12:00', '%Y/%m/%dT%H:%M:%S');

┌──────────────────────────────────────────────────────────┐
│ to_timestamp('2022/01/02t01:12:00', '%y/%m/%dt%h:%m:%s') │
├──────────────────────────────────────────────────────────┤
│ 2022-01-01 20:12:00                                      │
└──────────────────────────────────────────────────────────┘
```