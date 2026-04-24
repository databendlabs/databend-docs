---
title: DROP WORKER
sidebar_position: 3
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.3.0"/>

Removes a worker.

:::note
This command requires cloud control to be enabled.
:::

## Syntax

```sql
DROP WORKER [ IF EXISTS ] <worker_name>
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `IF EXISTS` | Optional. Suppresses the error if the worker does not exist. |
| `<worker_name>` | The worker name. |

## Examples

```sql
DROP WORKER read_env;
```

```sql
DROP WORKER IF EXISTS read_env;
```

## Related Topics

- [CREATE WORKER](create-worker.md) - Create a worker
- [ALTER WORKER](alter-worker.md) - Modify worker tags, options, or state
- [SHOW WORKERS](show-workers.md) - List workers and their metadata
