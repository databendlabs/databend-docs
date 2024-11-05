---
title: SETTINGS Clause
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.652"/>

The SETTINGS clause configures specific settings that influence the execution behavior of the SQL statement it precedes. To view the available settings in Databend and their values, use [SHOW SETTINGS](../50-administration-cmds/03-show-settings.md).

See also: [SET](../50-administration-cmds/02-set-global.md)

## Syntax

```sql
SETTINGS ( <setting> = <value> [, <setting> = <value>, ...] ) <statement>
```

## Supported Statements

The SETTINGS clause can be used with the following SQL statements:

- [SELECT](01-query-select.md)
- [INSERT](../10-dml/dml-insert.md)
- [INSERT (multi-table)](../10-dml/dml-insert-multi.md)
- [MERGE](../10-dml/dml-merge.md)
- [`COPY INTO <table>`](../10-dml/dml-copy-into-table.md)
- [`COPY INTO <location>`](../10-dml/dml-copy-into-location.md)
- [UPDATE](../10-dml/dml-update.md)
- [DELETE](../10-dml/dml-delete-from.md)
- [CREATE TABLE](../00-ddl/01-table/10-ddl-create-table.md)
- [EXPLAIN](../40-explain-cmds/explain.md)

## Examples

This example demonstrates how the SETTINGS clause can be used to adjust the timezone parameter in a SELECT query, impacting the displayed result of `now()`:

```sql
-- When no timezone is set, Databend defaults to UTC, so now() returns the current UTC timestamp
SELECT timezone(), now();

┌─────────────────────────────────────────┐
│ timezone() │            now()           │
│   String   │          Timestamp         │
├────────────┼────────────────────────────┤
│ UTC        │ 2024-11-04 19:42:28.424925 │
└─────────────────────────────────────────┘

-- By setting the timezone to Asia/Shanghai, the now() function returns the local time in Shanghai, which is 8 hours ahead of UTC.
SETTINGS (timezone = 'Asia/Shanghai') SELECT timezone(), now();

┌────────────────────────────────────────────┐
│   timezone()  │            now()           │
├───────────────┼────────────────────────────┤
│ Asia/Shanghai │ 2024-11-05 03:42:42.209404 │
└────────────────────────────────────────────┘

--  Setting the timezone to America/Toronto adjusts the now() output to the local time in Toronto, reflecting the Eastern Time Zone (UTC-5 or UTC-4 during daylight saving time).
SETTINGS (timezone = 'America/Toronto') SELECT timezone(), now();

┌──────────────────────────────────────────────┐
│    timezone()   │            now()           │
│      String     │          Timestamp         │
├─────────────────┼────────────────────────────┤
│ America/Toronto │ 2024-11-04 14:42:48.353577 │
└──────────────────────────────────────────────┘
```

This example allows the COPY INTO operation to utilize up to 100 threads for parallel processing:

```sql
SETTINGS (max_threads = 100) COPY INTO ...
```