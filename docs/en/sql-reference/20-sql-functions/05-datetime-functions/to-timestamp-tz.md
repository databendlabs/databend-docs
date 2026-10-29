---
title: TO_TIMESTAMP_TZ
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: Unreleased"/>

Converts a value to [`TIMESTAMP_TZ`](../../00-sql-reference/10-data-types/datetime.md#timestamp_tz), keeping both the UTC moment and the timezone offset. Use `TRY_TO_TIMESTAMP_TZ` if you prefer `NULL` instead of an error.

## Syntax

```sql
TO_TIMESTAMP_TZ(<expr>)
```

`<expr>` can be a string in ISO-8601 style (`YYYY-MM-DD`, `YYYY-MM-DDTHH:MM:SS[.fraction][±offset]`), a `TIMESTAMP`, or a `DATE`.

## Return Type

`TIMESTAMP_TZ`

## Supported Range

`TIMESTAMP_TZ` uses the same inclusive UTC range as `TIMESTAMP`: `0000-12-31 00:00:00.000000` through `9999-12-31 23:59:59.999999`.

For string input, Databend checks the UTC instant after applying the explicit offset or session timezone. Local year `0000` or a signed extended year such as `+10000` is accepted only if the UTC instant is within range. For example, `+10000-01-01 07:59:59.999999 +0800` represents the UTC maximum. Out-of-range UTC instants cause an error; `TRY_TO_TIMESTAMP_TZ` returns `NULL` for these text conversion errors.

Text output uses minute-only offsets, such as `+0806`. Historical offsets that include seconds can lose precision when converted to text and parsed again. See [Timestamp Range and Timezones](../../00-sql-reference/10-data-types/datetime.md#timestamp-range-and-timezones).

## Examples

### Parse a string with an explicit offset

```sql
SELECT TO_TIMESTAMP_TZ('2021-12-20 17:01:01.000000 +0000')::STRING AS utc_example;

┌──────────────────────────────────────────┐
│ utc_example                              │
├──────────────────────────────────────────┤
│ 2021-12-20 17:01:01.000000 +0000         │
└──────────────────────────────────────────┘
```

### Promote a TIMESTAMP

```sql
SELECT TO_TIMESTAMP_TZ(TO_TIMESTAMP('2021-12-20 17:01:01.000000'))::STRING AS from_timestamp;

┌──────────────────────────────────────────┐
│ from_timestamp                           │
├──────────────────────────────────────────┤
│ 2021-12-20 17:01:01.000000 +0000         │
└──────────────────────────────────────────┘
```

### Convert back to TIMESTAMP

```sql
SELECT TO_TIMESTAMP(TO_TIMESTAMP_TZ('2021-12-20 17:01:01.000000 +0800')) AS back_to_timestamp;

┌────────────────────────┐
│ back_to_timestamp      │
├────────────────────────┤
│ 2021-12-20T09:01:01    │
└────────────────────────┘
```
