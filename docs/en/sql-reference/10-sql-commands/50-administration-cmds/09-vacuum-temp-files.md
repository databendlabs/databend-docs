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

## Cleanup Budget and Progress

Since v1.2.953, spill cleanup runs concurrently. `LIMIT` is a soft bound, not an exact maximum number of deleted files. The scheduler stops starting new tasks when the budget is exhausted. Tasks already in flight can finish and exceed the limit.

Spill cleanup charges successfully deleted paths to the budget. It also charges paths in a failed delete request because the backend might have deleted part of that request. These uncertain deletions do not increase the reported successful-removal count. The remaining temporary-table session allowance uses the charged budget, not just the progress count. An exhausted budget leaves no allowance for session cleanup in that run.

Failed spill deletions are logged. Remaining work can be retried in a later run. A completed command does not guarantee that every eligible spill path was removed.

While the command runs, inspect `system.processes` from another session:

```sql
SELECT current_query_id, status,
       scan_progress_read_rows, scan_progress_read_bytes
FROM system.processes;
```

Identify the row for the running VACUUM statement. During its spill cleanup, `scan_progress_read_rows` reports the running successful-removal count. It can include spill metadata and directory-marker paths. It is not a table-row count or a count of cleaned temporary-table sessions. `scan_progress_read_bytes` does not report deleted byte sizes.

The status can show `[VACUUM] removed <count> temporary files`. Status updates are rate-limited, so the text can lag behind the progress counter. Short runs might finish before this status appears. The command still returns no result set.

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
