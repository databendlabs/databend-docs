---
title: VACUUM TEMPORARY FILES
---

import FunctionDescription from '@site/src/components/FunctionDescription';
import EEFeature from '@site/src/components/EEFeature';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

<EEFeature featureName='VACUUM TEMPORARY FILES'/>

Removes temporary spill files created during query execution and cleans up inactive temporary-table sessions for the tenant.

See also: [system.temp_files](../../00-sql-reference/31-system-tables/system-temp-files.md), [VACUUM ALL](09-vacuum-all.md).

## Syntax

```sql
VACUUM TEMPORARY FILES [RETAIN <number> {SECONDS | DAYS}] [LIMIT <limit>]
```

| Parameter | Description |
|-----------|-------------|
| `RETAIN` | Retention period for temporary spill files. Defaults to 3 days. This is independent of `data_retention_time_in_days` and does not set the lifetime of temporary-table sessions. |
| `LIMIT` | A soft cleanup budget for spill paths first. The remaining allowance limits the number of inactive temporary-table sessions to clean, rather than individual files within those sessions. Concurrent spill tasks can exceed this budget. If omitted, no explicit limit is applied. |

Requires global `SUPER` privilege. The command does not return a result set.

:::note[LIMIT is not an exact deletion cap]
Concurrent cleanup tasks can finish after the budget is exhausted. The number of removed spill paths can exceed `LIMIT`. Check server logs for failed deletions. Run the command again if eligible files remain.
:::

## Examples

Inspect temporary files:

```sql
SELECT * FROM system.temp_files;
```

Clean up using the default retention:

```sql
VACUUM TEMPORARY FILES;
```

Retain spill files for 2 days and limit cleanup:

```sql
VACUUM TEMPORARY FILES RETAIN 2 DAYS LIMIT 1000;
```
