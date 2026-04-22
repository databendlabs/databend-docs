---
title: DROP WORKER
sidebar_position: 3
---

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
DROP WORKER ingest_worker;
```

```sql
DROP WORKER IF EXISTS ingest_worker;
```
