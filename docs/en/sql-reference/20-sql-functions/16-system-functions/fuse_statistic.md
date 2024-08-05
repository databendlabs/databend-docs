---
title: FUSE_STATISTIC
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.587"/>

Returns statistical information about each column in a specified table:

- `distinct_count`: Returns the estimated number of distinct values.
- `histogram`: Generates histograms for the column, breaking down the distribution of data into buckets. Each bucket includes information such as:
    - `bucket id`: The identifier for the bucket.
    - `min`: The minimum value within the bucket.
    - `max`: The maximum value within the bucket.
    - `ndv` (number of distinct values): The count of unique values within the bucket.
    - `count`: The total number of values within the bucket.

## Syntax

```sql
FUSE_STATISTIC('<database_name>', '<table_name>')
```

The `enable_analyze_histogram` setting must be set to `1` for the function to generate histograms. By default, this setting is `0`, meaning histograms are not generated unless explicitly enabled.

```sql
SET enable_analyze_histogram = 1;
```

## Examples

You're most likely to use this function together with [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) to check the statistical information of a table. See the [Examples](/sql/sql-commands/ddl/table/analyze-table#examples) section on the [ANALYZE TABLE](/sql/sql-commands/ddl/table/analyze-table) page.