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
    [ WITH size = '<size_value>']
    [ WITH auto_suspend = '<suspend_seconds>']
    [ WITH auto_resume = '<true|false>']
    [ WITH max_cluster_count = '<count>']
    [ WITH min_cluster_count = '<count>']
```

| Parameter       | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `IF NOT EXISTS` | Optional. If specified, the command succeeds without changes if the worker already exists.    |
| worker_name     | The name of the worker to create. Corresponds to a UDF name.                                  |

## Options

| Option                | Type / Values                          | Default       | Description                                                                 |
| --------------------- | -------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| `size`                | String (e.g., 'small', 'medium')       | Platform default | Controls the compute size of the worker                                    |
| `auto_suspend`        | String (seconds)                       | Platform default | Idle timeout before automatic suspend                                      |
| `auto_resume`         | String ('true' or 'false')             | Platform default | Controls whether incoming requests wake the worker automatically           |
| `max_cluster_count`   | String (count)                         | Platform default | Upper bound for auto-scaling clusters                                      |
| `min_cluster_count`   | String (count)                         | Platform default | Lower bound for auto-scaling clusters                                      |

- Options are specified as key-value pairs using the `WITH` keyword
- All option values are passed as strings and must be enclosed in single quotes
- Options may appear in any order
- Option names are case-insensitive but shown here in lowercase for consistency

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
CREATE WORKER read_env WITH size='small', auto_suspend='300', auto_resume='true', max_cluster_count='3', min_cluster_count='1';
```

## Notes

1. **UDF Association**: Each worker corresponds to a single UDF. The worker name should match the UDF name.
2. **Environment Variables**: Environment variables for UDFs are managed separately in the cloud console for security reasons.
3. **Resource Management**: Workers manage the execution environment and resources for their associated UDFs.
4. **Cloud Integration**: Workers are integrated with Databend Cloud's control plane for lifecycle management.

## Related Topics

- [ALTER WORKER](alter-worker.md) - Modify worker settings
- [SHOW WORKERS](show-workers.md) - List available workers
- [DROP WORKER](drop-worker.md) - Remove a worker
- [User-Defined Functions](../../../../guides/60-udf/index.md) - Learn about UDFs in Databend