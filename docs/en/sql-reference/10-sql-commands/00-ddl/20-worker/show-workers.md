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

| Column Name  | Data Type | Description                                      |
| ------------ | --------- | ------------------------------------------------ |
| `name`       | String    | The worker name.                                 |
| `tags`       | String    | Worker tags serialized as a JSON string.         |
| `options`    | String    | Worker options serialized as a JSON string.      |
| `created_at` | String    | Worker creation timestamp.                       |
| `updated_at` | String    | Worker last update timestamp.                    |

## Examples

List all workers:

```sql
SHOW WORKERS;
```

Sample output:

```
name      | tags                               | options                                                                 | created_at           | updated_at
----------+------------------------------------+-------------------------------------------------------------------------+----------------------+----------------------
read_env  | {"owner":"ci","purpose":"sandbox"} | {"auto_resume":"true","auto_suspend":"300","size":"small"}              | 2024-01-15T10:30:00Z | 2024-01-15T10:30:00Z
csv_job   | {"environment":"production"}       | {"auto_resume":"true","max_cluster_count":"5","min_cluster_count":"2"}  | 2024-01-14T09:15:00Z | 2024-01-15T08:45:00Z
```

## Notes

1. **Tenant scope**: The command shows workers for the current tenant only.
2. **Raw metadata**: Option values are returned in the `options` JSON string instead of expanded columns.
3. **Tag display**: Tags are returned in the `tags` JSON string.

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a new worker
- [ALTER WORKER](alter-worker.md) - Modify worker settings
- [DROP WORKER](drop-worker.md) - Remove a worker
