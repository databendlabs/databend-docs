---
title: SET_VAR
---

Use `SET_VAR` to change a setting for a single SQL statement.

:::note
SET_VAR will be deprecated in an upcoming release. Consider using the [SETTINGS Clause](../20-query-syntax/settings.md) instead.
:::

The setting does not change the database configuration. For available settings, see [SHOW SETTINGS](03-show-settings.md). For usage, see the examples below:

- [Example 1: Temporarily Set Timezone](#example-1-temporarily-set-timezone)
- [Example 2: Control Parallel Processing for COPY INTO](#example-2-control-parallel-processing-for-copy-into)

See also: 
- [SETTINGS Clause](../20-query-syntax/settings.md)
- [SET](02-set-global.md)

## Syntax

```sql
/*+ SET_VAR(key=value) SET_VAR(key=value) ... */
```

- The hint must immediately follow an [SELECT](../20-query-syntax/01-query-select.md), [INSERT](../10-dml/dml-insert.md), [UPDATE](../10-dml/dml-update.md), [REPLACE](../10-dml/dml-replace.md), [MERGE](../10-dml/dml-merge.md),[DELETE](../10-dml/dml-delete-from.md), or [COPY](../10-dml/dml-copy-into-table.md) (INTO) keyword that begins the SQL statement.
- A SET_VAR can include only one Key=Value pair, which means you can configure only one setting with one SET_VAR. However, you can use multiple SET_VAR hints to configure multiple settings.
    - If multiple SET_VAR hints containing a same key, the first Key=Value pair will be applied.
    - If a key fails to parse or bind, all hints will be ignored.

## Examples

### Example 1: Temporarily Set Timezone

```sql
root@localhost> SELECT TIMEZONE();

SELECT
  TIMEZONE();

┌────────────┐
│ timezone() │
│   String   │
├────────────┤
│ UTC        │
└────────────┘

1 row in 0.011 sec. Processed 1 rows, 1B (91.23 rows/s, 91B/s)

root@localhost> SELECT /*+SET_VAR(timezone='America/Toronto') */ TIMEZONE();

SELECT
  /*+SET_VAR(timezone='America/Toronto') */
  TIMEZONE();

┌─────────────────┐
│    timezone()   │
│      String     │
├─────────────────┤
│ America/Toronto │
└─────────────────┘

1 row in 0.023 sec. Processed 1 rows, 1B (43.99 rows/s, 43B/s)

root@localhost> SELECT TIMEZONE();

SELECT
  TIMEZONE();

┌────────────┐
│ timezone() │
│   String   │
├────────────┤
│ UTC        │
└────────────┘

1 row in 0.010 sec. Processed 1 rows, 1B (104.34 rows/s, 104B/s)
```
### Example 2: Control Parallel Processing for COPY INTO

In Databend, the *max_threads* setting specifies the maximum number of threads that can be utilized to execute a request. By default, this value is typically set to match the number of CPU cores available on the machine.

When loading data into Databend with COPY INTO, you can control the parallel processing capabilities by injecting hints into the COPY INTO command and setting the *max_threads* parameter. For example:

```sql
COPY /*+ set_var(max_threads=6) */ INTO mytable FROM @mystage/ pattern='.*[.]parq' FILE_FORMAT=(TYPE=parquet);
```
