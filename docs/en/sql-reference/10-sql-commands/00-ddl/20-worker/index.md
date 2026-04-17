---
title: Worker
---

Worker-related SQL commands for deployments with cloud control enabled.

:::note
Worker management commands require cloud control. If `cloud_control_grpc_server_address` is not configured, Databend returns a `CloudControlNotEnabled` error when you run these commands.
:::

## Supported Statements

| Statement | Purpose |
|-----------|---------|
| `CREATE WORKER` | Creates a worker with an optional key-value option list |
| `ALTER WORKER` | Updates worker tags or options, or changes worker state |
| `DROP WORKER` | Deletes a worker |
| `SHOW WORKERS` | Lists workers in the current tenant |

## Command Reference

| Command | Description |
|---------|-------------|
| [CREATE WORKER](create-worker.md) | Creates a worker definition |
| [ALTER WORKER](alter-worker.md) | Modifies worker tags, options, or state |
| [DROP WORKER](drop-worker.md) | Removes a worker definition |
| [SHOW WORKERS](show-workers.md) | Lists workers and their metadata |

## Notes

- Option names are case-insensitive. Databend normalizes them to lowercase during planning.
- `SHOW WORKERS` returns the columns `name`, `tags`, `options`, `created_at`, and `updated_at`.
- `ALTER WORKER` supports `SET TAG`, `UNSET TAG`, `SET`, `UNSET`, `SUSPEND`, and `RESUME`.
