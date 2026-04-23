---
title: CREATE WORKER
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.3.0"/>

Creates a new worker for UDF execution in the sandbox environment.

## Syntax

```sql
CREATE WORKER [ IF NOT EXISTS ] <worker_name>
    [ WITH <option_name> = <option_value> [ , <option_name> = <option_value> ... ] ]
```

| Parameter         | Description                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `IF NOT EXISTS`   | Optional. If specified, the command succeeds without changes if the worker already exists.    |
| `<worker_name>`   | The name of the worker to create.                                                             |
| `<option_name>`   | Worker option key.                                                                            |
| `<option_value>`  | Worker option value.                                                                          |

## Options

The SQL parser accepts a single `WITH` clause followed by a comma-separated option list. Common worker options include:

| Option                | Example Value | Description                                 |
| --------------------- | ------------- | ------------------------------------------- |
| `size`                | `'small'`     | Controls the compute size of the worker.    |
| `auto_suspend`        | `'300'`       | Idle timeout before automatic suspend.      |
| `auto_resume`         | `'true'`      | Controls whether the worker resumes automatically. |
| `max_cluster_count`   | `'3'`         | Upper bound for auto-scaling clusters.      |
| `min_cluster_count`   | `'1'`         | Lower bound for auto-scaling clusters.      |

- `WITH` appears at most once.
- Options are separated by commas.
- Option names are normalized to lowercase before the request is sent.
- `option_value` can be written as a string literal, bare identifier, unsigned integer, or boolean. For consistency, the examples on this page use string literals.
- `CREATE WORKER` does not support a `TAG` clause.

## Examples

Create a basic worker for a UDF named `read_env`:

```sql
CREATE WORKER read_env;
```

Create a worker with `IF NOT EXISTS` to avoid errors if it already exists:

```sql
CREATE WORKER IF NOT EXISTS read_env;
```

Create a worker with custom configuration:

```sql
CREATE WORKER read_env
    WITH size = 'small',
         auto_suspend = '300',
         auto_resume = 'true',
         max_cluster_count = '3',
         min_cluster_count = '1';
```

## Notes

1. **Cloud-only feature**: `WORKER` statements require Databend Cloud control-plane support.
2. **UDF association**: A worker is used as the execution environment for sandbox UDFs.
3. **Environment variables**: UDF environment variables are managed separately in the cloud console.

## Related Topics

- [ALTER WORKER](alter-worker.md) - Modify worker settings
- [SHOW WORKERS](show-workers.md) - List available workers
- [DROP WORKER](drop-worker.md) - Remove a worker
- [User-Defined Functions](../10-udf/index.md) - Learn about UDFs in Databend
