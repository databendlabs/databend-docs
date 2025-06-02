---
title: Date & Time
description: Databend's Date and Time data type supports standardization and compatibility with various SQL standards, making it easier for users migrating from other database systems.
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.745"/>

## Date and Time Data Types

| Name      | Aliases  | Storage Size | Resolution  | Min Value                  | Max Value                      | Format                                                                         |
|-----------|----------|--------------|-------------|----------------------------|--------------------------------|--------------------------------------------------------------------------------|
| DATE      |          | 4 bytes      | Day         | 0001-01-01                 | 9999-12-31                     | `YYYY-MM-DD`                                                                   |
| TIMESTAMP | DATETIME | 8 bytes      | Microsecond | 0001-01-01 00:00:00.000000 | 9999-12-31 23:59:59.999999 UTC | `YYYY-MM-DD hh:mm:ss[.fraction]`, supports up to 6-digit microsecond precision |


## Examples

```sql
CREATE TABLE test_dt
  (
     date DATE,
     ts   TIMESTAMP
  );
```

```sql
DESC test_dt;
```

Result:

```
┌────────────────────────────────────────────────┐
│  Field │    Type   │  Null  │ Default │  Extra │
├────────┼───────────┼────────┼─────────┼────────┤
│ date   │ DATE      │ YES    │ NULL    │        │
│ ts     │ TIMESTAMP │ YES    │ NULL    │        │
└────────────────────────────────────────────────┘
```

A TIMESTAMP value can optionally include a trailing fractional seconds part in up to microseconds (6 digits) precision.

```sql
-- Inserting values into the table
INSERT INTO test_dt
VALUES
  ('2022-04-07', '2022-04-07 01:01:01.123456'),
  ('2022-04-08', '2022-04-08 01:01:01');

SELECT *
FROM test_dt;
```

Result:

```
┌─────────────────────────────────────────────┐
│      date      │             ts             │
├────────────────┼────────────────────────────┤
│ 2022-04-07     │ 2022-04-07 01:01:01.123456 │
│ 2022-04-08     │ 2022-04-08 01:01:01        │
└─────────────────────────────────────────────┘
```

Databend recognizes TIMESTAMP values in several formats.

```sql
-- Create a table to test different timestamp formats
CREATE TABLE test_formats (
    id INT,
    a TIMESTAMP
);

-- Insert values with different timestamp formats
INSERT INTO test_formats
VALUES
    (1, '2022-01-01 02:00:11'),
    (2, '2022-01-02T02:00:22'),
    (3, '2022-02-02T04:00:03+00:00'),
    (4, '2022-02-03');
```

```sql
SELECT *
FROM test_formats;

```

Result:

```
┌───────────────────────────────────────┐
│        id       │          a          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-01-01 02:00:11 │
│               2 │ 2022-01-02 02:00:22 │
│               3 │ 2022-02-02 04:00:03 │
│               4 │ 2022-02-03 00:00:00 │
└───────────────────────────────────────┘
```

Databend automatically adjusts and shows TIMESTAMP values based on your current timezone.

```sql
-- Create a table to test timestamp values with timezone adjustments
CREATE TABLE test_tz (
    id INT,
    t TIMESTAMP
);

-- Set timezone to UTC
SET timezone = 'UTC';

-- Insert timestamp values considering different timezones
INSERT INTO test_tz
VALUES
    (1, '2022-02-03T03:00:00'),
    (2, '2022-02-03T03:00:00+08:00'),
    (3, '2022-02-03T03:00:00-08:00'),
    (4, '2022-02-03'),
    (5, '2022-02-03T03:00:00+09:00'),
    (6, '2022-02-03T03:00:00+06:00');
```

```
SELECT *
FROM test_tz;
```

Result:

```
┌───────────────────────────────────────┐
│        id       │          t          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-02-03 03:00:00 │
│               2 │ 2022-02-02 19:00:00 │
│               3 │ 2022-02-03 11:00:00 │
│               4 │ 2022-02-03 00:00:00 │
│               5 │ 2022-02-02 18:00:00 │
│               6 │ 2022-02-02 21:00:00 │
└───────────────────────────────────────┘
```

```sql
-- Change the timezone to Asia/Shanghai
SET timezone = 'Asia/Shanghai';

-- Select data from the table with the new timezone setting
SELECT *
FROM test_tz;
```

Result:

```
┌───────────────────────────────────────┐
│        id       │          t          │
├─────────────────┼─────────────────────┤
│               1 │ 2022-02-03 11:00:00 │
│               2 │ 2022-02-03 03:00:00 │
│               3 │ 2022-02-03 19:00:00 │
│               4 │ 2022-02-03 08:00:00 │
│               5 │ 2022-02-03 02:00:00 │
│               6 │ 2022-02-03 05:00:00 │
└───────────────────────────────────────┘
```

## Functions

See [Date & Time Functions](/sql/sql-functions/datetime-functions).

## Handling Daylight Saving Time Adjustments

In certain regions, daylight saving time is observed. On the day daylight saving time begins, the clock is set forward by one hour. Databend manages daylight saving time adjustments with the `enable_dst_hour_fix` setting. When enabled, Databend automatically advances the time by one hour (e.g., 2:10 AM will be processed as 3:10 AM).

For example, daylight saving time in Toronto began on March 10, 2024, at 2:00 AM. As a result, the time between 2:00 AM and 3:00 AM on that day does not exist. Databend relies on [Chrono](https://github.com/chronotope/chrono) to determine daylight saving time for each timezone. If a time within this range is provided, Databend will return an error:

```sql
SET timezone = 'America/Toronto';

SELECT to_datetime('2024-03-10 02:01:00');
error: APIError: ResponseError with 1006: cannot parse to type `TIMESTAMP`. BadArguments. Code: 1006, Text = unexpected argument. while evaluating function `to_timestamp('2024-03-10 02:01:00')` in expr `to_timestamp('2024-03-10 02:01:00')`
```

To fix such errors, you can enable the `enable_dst_hour_fix` setting to advance the time by one hour:

```sql
SET enable_dst_hour_fix = 1;

SELECT to_datetime('2024-03-10 02:01:00');

┌────────────────────────────────────┐
│ to_datetime('2024-03-10 02:01:00') │
├────────────────────────────────────┤
│ 2024-03-10 03:01:00                │
└────────────────────────────────────┘
```

## Handling Invalid Values

Databend automatically converts invalid Date or Timestamp values to their minimum valid equivalents, `1000-01-01` for dates and `1000-01-01 00:00:00` for timestamps, ensuring consistency when working with out-of-range or incorrectly formatted dates and timestamps. 

Examples:

```sql
-- Attempts to add one day to the maximum date, exceeding the valid range.
-- Result: Returns DateMIN (1000-01-01) instead of an error.
SELECT ADD_DAYS(TO_DATE('9999-12-31'), 1);

┌────────────────────────────────────┐
│ add_days(to_date('9999-12-31'), 1) │
├────────────────────────────────────┤
│ 1000-01-01                         │
└────────────────────────────────────┘
```

```sql
-- Attempts to subtract one minute from the minimum date, which would be invalid.
-- Result: Returns DateMIN (1000-01-01 00:00:00), ensuring stability in results.
SELECT SUBTRACT_MINUTES(TO_DATE('1000-01-01'), 1);

┌────────────────────────────────────────────┐
│ subtract_minutes(to_date('1000-01-01'), 1) │
├────────────────────────────────────────────┤
│ 1000-01-01 00:00:00                        │
└────────────────────────────────────────────┘
```

## Formatting Date and Time

In Databend, certain date and time functions like [TO_DATE](../../20-sql-functions/05-datetime-functions/to-date.md) and [TO_TIMESTAMP](../../20-sql-functions/05-datetime-functions/to-timestamp.md) require you to specify the desired format for date and time values. 

### Date Format Styles

Databend supports two date format styles that can be selected using the `date_format_style` setting:

- **MySQL** (default): Uses MySQL-compatible format specifiers like `%Y`, `%m`, `%d`, etc.
- **Oracle**: Uses format specifiers like `YYYY`, `MM`, `DD`, etc., which follow a standardized format to ensure compatibility with common SQL standards.

To switch between format styles, use the `date_format_style` setting:

```sql
-- Set Oracle-style date format
SETTINGS (date_format_style = 'Oracle') SELECT to_string('2024-04-05'::DATE, 'YYYY-MM-DD');

-- Set MySQL date format style (default)
SETTINGS (date_format_style = 'MySQL') SELECT to_string('2024-04-05'::DATE, '%Y-%m-%d');
```

### Week Start Configuration

Databend provides a `week_start` setting that defines which day is considered the first day of the week:

- `week_start = 1` (default): Monday is considered the first day of the week
- `week_start = 0`: Sunday is considered the first day of the week

This setting affects week-related date functions like `DATE_TRUNC` and `TRUNC` when using `WEEK` as the precision parameter:

```sql
-- Set Sunday as the first day of the week
SETTINGS (week_start = 0) SELECT DATE_TRUNC(WEEK, to_date('2024-04-05'));

-- Set Monday as the first day of the week (default)
SETTINGS (week_start = 1) SELECT DATE_TRUNC(WEEK, to_date('2024-04-05'));
```

### MySQL Format Specifiers

To handle date and time formatting, Databend makes use of the chrono::format::strftime module, which is a standard module provided by the chrono library in Rust. This module enables precise control over the formatting of dates and times. The following content is excerpted from [https://docs.rs/chrono/latest/chrono/format/strftime/index.html](https://docs.rs/chrono/latest/chrono/format/strftime/index.html):

| Spec. | Example                          | Description                                                                                                                                                                                                                                                                                                                     |
| ----- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|       |                                  | DATE SPECIFIERS:                                                                                                                                                                                                                                                                                                                |
| %Y    | 2001                             | The full proleptic Gregorian year, zero-padded to 4 digits. chrono supports years from -262144 to 262143. Note: years before 1 BCE or after 9999 CE, require an initial sign (+/-).                                                                                                                                             |
| %C    | 20                               | The proleptic Gregorian year divided by 100, zero-padded to 2 digits.                                                                                                                                                                                                                                                           |
| %y    | 01                               | The proleptic Gregorian year modulo 100, zero-padded to 2 digits.                                                                                                                                                                                                                                                               |
| %m    | 07                               | Month number (01–12), zero-padded to 2 digits.                                                                                                                                                                                                                                                                                  |
| %b    | Jul                              | Abbreviated month name. Always 3 letters.                                                                                                                                                                                                                                                                                       |
| %B    | July                             | Full month name. Also accepts corresponding abbreviation in parsing.                                                                                                                                                                                                                                                            |
| %h    | Jul                              | Same as %b.                                                                                                                                                                                                                                                                                                                     |
| %d    | 08                               | Day number (01–31), zero-padded to 2 digits.                                                                                                                                                                                                                                                                                    |
| %e    | 8                                | Same as %d but space-padded. Same as %\_d.                                                                                                                                                                                                                                                                                      |
| %a    | Sun                              | Abbreviated weekday name. Always 3 letters.                                                                                                                                                                                                                                                                                     |
| %A    | Sunday                           | Full weekday name. Also accepts corresponding abbreviation in parsing.                                                                                                                                                                                                                                                          |
| %w    | 0                                | Sunday = 0, Monday = 1, …, Saturday = 6.                                                                                                                                                                                                                                                                                        |
| %u    | 7                                | Monday = 1, Tuesday = 2, …, Sunday = 7. (ISO 8601)                                                                                                                                                                                                                                                                              |
| %U    | 28                               | Week number starting with Sunday (00–53), zero-padded to 2 digits.                                                                                                                                                                                                                                                              |
| %W    | 27                               | Same as %U, but week 1 starts with the first Monday in that year instead.                                                                                                                                                                                                                                                       |
| %G    | 2001                             | Same as %Y but uses the year number in ISO 8601 week date.                                                                                                                                                                                                                                                                      |
| %g    | 01                               | Same as %y but uses the year number in ISO 8601 week date.                                                                                                                                                                                                                                                                      |
| %V    | 27                               | Same as %U but uses the week number in ISO 8601 week date (01–53).                                                                                                                                                                                                                                                              |
| %j    | 189                              | Day of the year (001–366), zero-padded to 3 digits.                                                                                                                                                                                                                                                                             |
| %D    | 07/08/01                         | Month-day-year format. Same as %m/%d/%y.                                                                                                                                                                                                                                                                                        |
| %x    | 07/08/01                         | Locale’s date representation (e.g., 12/31/99).                                                                                                                                                                                                                                                                                  |
| %F    | 2001-07-08                       | Year-month-day format (ISO 8601). Same as %Y-%m-%d.                                                                                                                                                                                                                                                                             |
| %v    | 8-Jul-2001                       | Day-month-year format. Same as %e-%b-%Y.                                                                                                                                                                                                                                                                                        |
|       |                                  | TIME SPECIFIERS:                                                                                                                                                                                                                                                                                                                |
| %H    | 00                               | Hour number (00–23), zero-padded to 2 digits.                                                                                                                                                                                                                                                                                   |
| %k    | 0                                | Same as %H but space-padded. Same as %\_H.                                                                                                                                                                                                                                                                                      |
| %I    | 12                               | Hour number in 12-hour clocks (01–12), zero-padded to 2 digits.                                                                                                                                                                                                                                                                 |
| %l    | 12                               | Same as %I but space-padded. Same as %\_I.                                                                                                                                                                                                                                                                                      |
| %P    | am                               | am or pm in 12-hour clocks.                                                                                                                                                                                                                                                                                                     |
| %p    | AM                               | AM or PM in 12-hour clocks.                                                                                                                                                                                                                                                                                                     |
| %M    | 34                               | Minute number (00–59), zero-padded to 2 digits.                                                                                                                                                                                                                                                                                 |
| %S    | 60                               | Second number (00–60), zero-padded to 2 digits.                                                                                                                                                                                                                                                                                 |
| %f    | 026490000                        | The fractional seconds (in nanoseconds) since last whole second. Databend recommends converting the Integer string into an Integer first, other than using this specifier. See [Converting Integer to Timestamp](/sql/sql-functions/datetime-functions/to-timestamp#example-2-converting-integer-to-timestamp) for an example. |
| %.f   | .026490                          | Similar to .%f but left-aligned. These all consume the leading dot.                                                                                                                                                                                                                                                             |
| %.3f  | .026                             | Similar to .%f but left-aligned but fixed to a length of 3.                                                                                                                                                                                                                                                                     |
| %.6f  | .026490                          | Similar to .%f but left-aligned but fixed to a length of 6.                                                                                                                                                                                                                                                                     |
| %.9f  | .026490000                       | Similar to .%f but left-aligned but fixed to a length of 9.                                                                                                                                                                                                                                                                     |
| %3f   | 026                              | Similar to %.3f but without the leading dot.                                                                                                                                                                                                                                                                                    |
| %6f   | 026490                           | Similar to %.6f but without the leading dot.                                                                                                                                                                                                                                                                                    |
| %9f   | 026490000                        | Similar to %.9f but without the leading dot.                                                                                                                                                                                                                                                                                    |
| %R    | 00:34                            | Hour-minute format. Same as %H:%M.                                                                                                                                                                                                                                                                                              |
| %T    | 00:34:60                         | Hour-minute-second format. Same as %H:%M:%S.                                                                                                                                                                                                                                                                                    |
| %X    | 00:34:60                         | Locale’s time representation (e.g., 23:13:48).                                                                                                                                                                                                                                                                                  |
| %r    | 12:34:60 AM                      | Hour-minute-second format in 12-hour clocks. Same as %I:%M:%S %p.                                                                                                                                                                                                                                                               |
|       |                                  | TIME ZONE SPECIFIERS:                                                                                                                                                                                                                                                                                                           |
| %Z    | ACST                             | Local time zone name. Skips all non-whitespace characters during parsing.                                                                                                                                                                                                                                                       |
| %z    | +0930                            | Offset from the local time to UTC (with UTC being +0000).                                                                                                                                                                                                                                                                       |
| %:z   | +09:30                           | Same as %z but with a colon.                                                                                                                                                                                                                                                                                                    |
| %::z  | +09:30:00                        | Offset from the local time to UTC with seconds.                                                                                                                                                                                                                                                                                 |
| %:::z | +09                              | Offset from the local time to UTC without minutes.                                                                                                                                                                                                                                                                              |
| %#z   | +09                              | Parsing only: Same as %z but allows minutes to be missing or present.                                                                                                                                                                                                                                                           |
|       |                                  | DATE & TIME SPECIFIERS:                                                                                                                                                                                                                                                                                                         |
| %c    | Sun Jul 8 00:34:60 2001          | Locale’s date and time (e.g., Thu Mar 3 23:05:25 2005).                                                                                                                                                                                                                                                                         |
| %+    | 2001-07-08T00:34:60.026490+09:30 | ISO 8601 / RFC 3339 date & time format.                                                                                                                                                                                                                                                                                         |
| %s    | 994518299                        | UNIX timestamp, the number of seconds since 1970-01-01 00:00 UTC. Databend recommends converting the Integer string into an Integer first, other than using this specifier. See [Converting Integer to Timestamp](/sql/sql-functions/datetime-functions/to-timestamp#example-2-converting-integer-to-timestamp) for an example. |
|       |                                  | SPECIAL SPECIFIERS:                                                                                                                                                                                                                                                                                                             |
| %t    |                                  | Literal tab (\t).                                                                                                                                                                                                                                                                                                               |
| %n    |                                  | Literal newline (\n).                                                                                                                                                                                                                                                                                                           |
| %%    |                                  | Literal percent sign.                                                                                                                                                                                                                                                                                                           |

It is possible to override the default padding behavior of numeric specifiers %?. This is not allowed for other specifiers and will result in the BAD_FORMAT error.

| Modifier | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| %-?      | Suppresses any padding including spaces and zeroes. (e.g. %j = 012, %-j = 12) |
| %\_?     | Uses spaces as a padding. (e.g. %j = 012, %\_j = 12)                          |
| %0?      | Uses zeroes as a padding. (e.g. %e = 9, %0e = 09)                             |

- %C, %y: This is floor division, so 100 BCE (year number -99) will print -1 and 99 respectively.

- %U: Week 1 starts with the first Sunday in that year. It is possible to have week 0 for days before the first Sunday.

- %G, %g, %V: Week 1 is the first week with at least 4 days in that year. Week 0 does not exist, so this should be used with %G or %g.

- %S: It accounts for leap seconds, so 60 is possible.

- %f, %.f, %.3f, %.6f, %.9f, %3f, %6f, %9f:
  The default %f is right-aligned and always zero-padded to 9 digits for the compatibility with glibc and others, so it always counts the number of nanoseconds since the last whole second. E.g. 7ms after the last second will print 007000000, and parsing 7000000 will yield the same.

  The variant %.f is left-aligned and print 0, 3, 6 or 9 fractional digits according to the precision. E.g. 70ms after the last second under %.f will print .070 (note: not .07), and parsing .07, .070000 etc. will yield the same. Note that they can print or read nothing if the fractional part is zero or the next character is not ..

  The variant %.3f, %.6f and %.9f are left-aligned and print 3, 6 or 9 fractional digits according to the number preceding f. E.g. 70ms after the last second under %.3f will print .070 (note: not .07), and parsing .07, .070000 etc. will yield the same. Note that they can read nothing if the fractional part is zero or the next character is not . however will print with the specified length.

  The variant %3f, %6f and %9f are left-aligned and print 3, 6 or 9 fractional digits according to the number preceding f, but without the leading dot. E.g. 70ms after the last second under %3f will print 070 (note: not 07), and parsing 07, 070000 etc. will yield the same. Note that they can read nothing if the fractional part is zero.

- %Z: Offset will not be populated from the parsed data, nor will it be validated. Timezone is completely ignored. Similar to the glibc strptime treatment of this format code.

  It is not possible to reliably convert from an abbreviation to an offset, for example CDT can mean either Central Daylight Time (North America) or China Daylight Time.

- %+: Same as %Y-%m-%dT%H:%M:%S%.f%:z, i.e. 0, 3, 6 or 9 fractional digits for seconds and colons in the time zone offset.

  This format also supports having a Z or UTC in place of %:z. They are equivalent to +00:00.

  Note that all T, Z, and UTC are parsed case-insensitively.

  The typical strftime implementations have different (and locale-dependent) formats for this specifier. While Chrono's format for %+ is far more stable, it is best to avoid this specifier if you want to control the exact output.

- %s: This is not padded and can be negative. For the purpose of Chrono, it only accounts for non-leap seconds so it slightly differs from ISO C strftime behavior.

### Oracle Format Specifiers

When `date_format_style` is set to 'Oracle', the following format specifiers are supported:

| Oracle Format | Description                                  | Example Output (for '2024-04-05 14:30:45.123456') |
|---------------|----------------------------------------------|---------------------------------------------------|
| YYYY          | 4-digit year                                 | 2024                                              |
| YY            | 2-digit year                                 | 24                                                |
| MMMM          | Full month name                              | April                                             |
| MON           | Abbreviated month name                       | Apr                                               |
| MM            | Month number (01-12)                         | 04                                                |
| DD            | Day of month (01-31)                         | 05                                                |
| DY            | Abbreviated day name                         | Fri                                               |
| HH24          | Hour of day (00-23)                          | 14                                                |
| HH12          | Hour of day (01-12)                          | 02                                                |
| AM/PM         | Meridian indicator                           | PM                                                |
| MI            | Minute (00-59)                               | 30                                                |
| SS            | Second (00-59)                               | 45                                                |
| FF            | Fractional seconds                           | 123456                                            |
| UUUU          | ISO week-numbering year                      | 2024                                              |
| TZH:TZM       | Time zone hour and minute with colon         | +08:00                                            |
| TZH           | Time zone hour                               | +08                                               |

Examples comparing MySQL and Oracle format styles with the same data:

```sql
-- MySQL format style (default)
SELECT to_string('2022-12-25'::DATE, '%m/%d/%Y');

┌────────────────────────────────┐
│ to_string('2022-12-25', '%m/%d/%Y') │
├────────────────────────────────┤
│ 12/25/2022                     │
└────────────────────────────────┘

-- Oracle format style (same data as MySQL example above)
SETTINGS (date_format_style = 'Oracle')
SELECT to_string('2022-12-25'::DATE, 'MM/DD/YYYY');

┌────────────────────────────────┐
│ to_string('2022-12-25', 'MM/DD/YYYY') │
├────────────────────────────────┤
│ 12/25/2022                     │
└────────────────────────────────┘
```
