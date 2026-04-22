---
title: ALTER WORKER
sidebar_position: 2
---

Modifies a worker's tags, options, or state.

:::note
This command requires cloud control to be enabled.
:::

## Syntax

```sql
ALTER WORKER <worker_name> SET TAG <tag_name> = '<tag_value>' [ , <tag_name> = '<tag_value>' , ... ]

ALTER WORKER <worker_name> UNSET TAG <tag_name> [ , <tag_name> , ... ]

ALTER WORKER <worker_name> SET <option_name> = '<option_value>' [ , <option_name> = '<option_value>' , ... ]

ALTER WORKER <worker_name> UNSET <option_name> [ , <option_name> , ... ]

ALTER WORKER <worker_name> SUSPEND

ALTER WORKER <worker_name> RESUME
```

## Parameters

| Form | Description |
|------|-------------|
| `SET TAG` | Adds or updates worker tags. |
| `UNSET TAG` | Removes one or more worker tags. |
| `SET` | Adds or updates worker options. Option names are normalized to lowercase. |
| `UNSET` | Removes one or more worker options. |
| `SUSPEND` | Suspends the worker. |
| `RESUME` | Resumes the worker. |

## Examples

Set tags on a worker:

```sql
ALTER WORKER ingest_worker
SET TAG environment = 'prod', team = 'data-platform';
```

Update worker options:

```sql
ALTER WORKER ingest_worker
SET region = 'us-west-2', pool = 'streaming';
```

Remove a tag and an option:

```sql
ALTER WORKER ingest_worker UNSET TAG team;
ALTER WORKER ingest_worker UNSET pool;
```

Change worker state:

```sql
ALTER WORKER ingest_worker SUSPEND;
ALTER WORKER ingest_worker RESUME;
```
