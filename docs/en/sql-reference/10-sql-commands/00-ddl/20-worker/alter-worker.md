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
ALTER WORKER <worker_name> SET <option_name> = <option_value> [ , <option_name> = <option_value> ... ]
ALTER WORKER <worker_name> UNSET <option_name> [, <option_name> ...]

-- Modify worker tags
ALTER WORKER <worker_name> SET TAG <tag_name> = '<tag_value>' [, <tag_name> = '<tag_value>' ...]
ALTER WORKER <worker_name> UNSET TAG <tag_name> [, <tag_name> ...]

-- Change worker state
ALTER WORKER <worker_name> SUSPEND
ALTER WORKER <worker_name> RESUME
```

| Parameter         | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `<worker_name>`   | The name of the worker to modify.                                           |
| `<option_name>`   | Worker option key.                                                          |
| `<option_value>`  | Worker option value.                                                        |
| `<tag_name>`      | The name of the tag to set or unset.                                        |
| `<tag_value>`     | The string literal value for the tag.                                       |

## Options

`SET` accepts the same option list format as [`CREATE WORKER`](create-worker.md). Common option keys include:

| Option                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `size`                | Compute size of the worker, for example `'small'` or `'medium'`.            |
| `auto_suspend`        | Idle timeout before automatic suspend.                                      |
| `auto_resume`         | Whether auto-resume is enabled.                                             |
| `max_cluster_count`   | Upper bound for auto-scaling clusters.                                      |
| `min_cluster_count`   | Lower bound for auto-scaling clusters.                                      |

- `SET` takes a comma-separated option list.
- `UNSET` takes a comma-separated list of option names.
- Option names are normalized to lowercase before the request is sent.
- Tag values in `SET TAG` must be string literals.

## Examples

### Modify Worker Options

Change the size and auto-suspend settings of a worker:

```sql
ALTER WORKER read_env SET size = 'medium', auto_suspend = '600';
```

Reset specific options to their default values:

```sql
ALTER WORKER read_env UNSET size, auto_suspend;
```

### Manage Worker Tags

Add or update tags on a worker:

```sql
ALTER WORKER read_env SET TAG purpose = 'sandbox', owner = 'ci';
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

1. **Multiple options**: You can modify multiple options in a single `SET` statement.
2. **Separate actions**: `SET`, `UNSET`, `SET TAG`, `UNSET TAG`, `SUSPEND`, and `RESUME` are separate `ALTER WORKER` forms.
3. **Tag management**: Tags are managed through `SET TAG` and `UNSET TAG`, not through `SET`.

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a new worker
- [SHOW WORKERS](show-workers.md) - List workers and their current settings
- [DROP WORKER](drop-worker.md) - Remove a worker
