---
title: CREATE WORKER
sidebar_position: 1
---

Creates a worker.

:::note
This command requires cloud control to be enabled.
:::

## Syntax

```sql
CREATE WORKER [ IF NOT EXISTS ] <worker_name>
    [ WITH <option_name> = '<option_value>' [ , <option_name> = '<option_value>' , ... ] ]
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `IF NOT EXISTS` | Optional. Succeeds without changes if the worker already exists. |
| `<worker_name>` | The worker name. |
| `WITH ...` | Optional comma-separated key-value options. Option names are normalized to lowercase. |

## Examples

Create a worker without options:

```sql
CREATE WORKER ingest_worker;
```

Create a worker with custom options:

```sql
CREATE WORKER IF NOT EXISTS ingest_worker
WITH region = 'us-east-1', pool = 'etl';
```
