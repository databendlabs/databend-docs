---
title: ALTER WORKER
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.3.0"/>

Modifies the settings, tags, or state of an existing worker.

## Syntax

```sql
-- Modify worker options
ALTER WORKER <worker_name> SET <option_name> = '<value>' [, <option_name> = '<value>' ...]
ALTER WORKER <worker_name> UNSET <option_name> [, <option_name> ...]

-- Modify worker tags
ALTER WORKER <worker_name> SET TAG <tag_name> = '<tag_value>' [, <tag_name> = '<tag_value>' ...]
ALTER WORKER <worker_name> UNSET TAG <tag_name> [, <tag_name> ...]

-- Change worker state
ALTER WORKER <worker_name> SUSPEND
ALTER WORKER <worker_name> RESUME
```

| Parameter    | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| worker_name  | The name of the worker to modify                                            |
| option_name  | One of: `size`, `auto_suspend`, `auto_resume`, `max_cluster_count`, `min_cluster_count` |
| value        | The new value for the option (as a string)                                  |
| tag_name     | The name of the tag to set or unset                                         |
| tag_value    | The value for the tag                                                       |

## Options

The same options available in `CREATE WORKER` can be modified using `ALTER WORKER`:

| Option                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `size`                | Compute size of the worker (e.g., 'small', 'medium')                        |
| `auto_suspend`        | Idle timeout before automatic suspend (seconds)                             |
| `auto_resume`         | Whether auto-resume is enabled ('true' or 'false')                          |
| `max_cluster_count`   | Upper bound for auto-scaling clusters                                       |
| `min_cluster_count`   | Lower bound for auto-scaling clusters                                       |

## Examples

### Modify Worker Options

Change the size and auto-suspend settings of a worker:

```sql
ALTER WORKER read_env SET size='medium', auto_suspend='600';
```

Reset specific options to their default values:

```sql
ALTER WORKER read_env UNSET size, auto_suspend;
```

### Manage Worker Tags

Add or update tags on a worker:

```sql
ALTER WORKER read_env SET TAG purpose='sandbox', owner='ci';
```

Remove tags from a worker:

```sql
ALTER WORKER read_env UNSET TAG purpose, owner;
```

### Control Worker State

Suspend a worker (stop its execution environment):

```sql
ALTER WORKER read_env SUSPEND;
```

Resume a suspended worker:

```sql
ALTER WORKER read_env RESUME;
```

## Notes

1. **Atomic Operations**: Multiple options can be modified in a single `ALTER WORKER` statement.
2. **State Changes**: `SUSPEND` and `RESUME` are mutually exclusive with option modifications.
3. **Tag Management**: Tags are useful for categorizing and organizing workers. They can be used for cost allocation, environment identification, or team ownership.
4. **Validation**: Option values are validated according to the same rules as `CREATE WORKER`.

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a new worker
- [SHOW WORKERS](show-workers.md) - List workers and their current settings
- [DROP WORKER](drop-worker.md) - Remove a worker