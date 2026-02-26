---
title: DROP WORKER
sidebar_position: 4
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.3.0"/>

Removes a worker from the system.

## Syntax

```sql
DROP WORKER [ IF EXISTS ] <worker_name>
```

| Parameter       | Description                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------- |
| `IF EXISTS`     | Optional. If specified, the command succeeds without errors if the worker does not exist.     |
| worker_name     | The name of the worker to remove.                                                             |

## Examples

Remove a worker:

```sql
DROP WORKER read_env;
```

Remove a worker only if it exists (avoids errors if the worker doesn't exist):

```sql
DROP WORKER IF EXISTS read_env;
```

## Behavior

1. **Resource Cleanup**: When a worker is dropped, all associated resources are released.
2. **UDF Association**: Dropping a worker does not automatically drop the associated UDF. The UDF can still exist but will not have an execution environment.
3. **Irreversible Operation**: Dropping a worker cannot be undone. The worker must be recreated if needed.
4. **Dependencies**: Ensure no active executions are using the worker before dropping it.

## Error Conditions

- `UnknownWorker`: If the worker does not exist and `IF EXISTS` is not specified.
- `WorkerInUse`: If the worker is currently executing UDFs or has pending operations.

## Notes

1. **Safety First**: Use `IF EXISTS` to make your scripts idempotent and avoid unnecessary errors.
2. **Check State**: Consider checking the worker's state with `SHOW WORKERS` before dropping it.
3. **Cleanup Order**: If you're cleaning up a UDF and its worker, drop the worker first, then the UDF if desired.
4. **Cloud Integration**: Worker deletion is coordinated with Databend Cloud's control plane to ensure proper resource cleanup.

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a new worker
- [SHOW WORKERS](show-workers.md) - List available workers
- [ALTER WORKER](alter-worker.md) - Modify worker settings
- [User-Defined Functions](../../../../guides/60-udf/index.md) - Learn about UDFs in Databend