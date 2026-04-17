---
title: SHOW WORKERS
sidebar_position: 4
---

Lists workers in the current tenant.

:::note
This command requires cloud control to be enabled.
:::

## Syntax

```sql
SHOW WORKERS
```

## Output

`SHOW WORKERS` returns the following columns:

| Column | Description |
|--------|-------------|
| `name` | Worker name |
| `tags` | Worker tags in JSON format |
| `options` | Worker options in JSON format |
| `created_at` | Worker creation timestamp |
| `updated_at` | Worker update timestamp |

## Examples

```sql
SHOW WORKERS;
```
