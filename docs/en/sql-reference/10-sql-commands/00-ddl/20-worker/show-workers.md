---
title: SHOW WORKERS
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.3.0"/>

Lists all workers available in the current tenant.

## Syntax

```sql
SHOW WORKERS
```

## Output

The command returns a table with the following columns:

| Column Name     | Data Type | Description                                      |
| --------------- | --------- | ------------------------------------------------ |
| name            | String    | The name of the worker                           |
| size            | String    | The compute size of the worker                   |
| auto_suspend    | String    | Auto-suspend timeout in seconds                  |
| auto_resume     | String    | Whether auto-resume is enabled ('true'/'false')  |
| max_cluster_count | String  | Maximum cluster count for auto-scaling           |
| min_cluster_count | String  | Minimum cluster count for auto-scaling           |
| tags            | Map       | Key-value tags associated with the worker        |
| created_at      | Timestamp | When the worker was created                      |
| updated_at      | Timestamp | When the worker was last updated                 |
| state           | String    | Current state of the worker (e.g., ACTIVE, SUSPENDED) |

## Examples

List all workers:

```sql
SHOW WORKERS;
```

Sample output:

```
name       | size  | auto_suspend | auto_resume | max_cluster_count | min_cluster_count | tags                           | created_at          | updated_at          | state
-----------+-------+--------------+-------------+-------------------+-------------------+--------------------------------+---------------------+---------------------+--------
read_env   | small | 300          | true        | 3                 | 1                 | {purpose: sandbox, owner: ci} | 2024-01-15 10:30:00 | 2024-01-15 10:30:00 | ACTIVE
process_csv| medium| 600          | true        | 5                 | 2                 | {environment: production}      | 2024-01-14 09:15:00 | 2024-01-15 08:45:00 | ACTIVE
```

## Notes

1. **Tenant Scope**: The command shows workers for the current tenant only.
2. **State Information**: The state column indicates whether the worker is active, suspended, or in another state.
3. **Tag Display**: Tags are displayed as a map of key-value pairs.
4. **Time Zones**: Timestamps are displayed in UTC.

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a new worker
- [ALTER WORKER](alter-worker.md) - Modify worker settings
- [DROP WORKER](drop-worker.md) - Remove a worker