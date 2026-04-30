---
title: SHOW ONLINE NODES
sidebar_position: 7
---

Lists online query nodes visible to the current tenant.

:::note
This command requires system management support and an enterprise license.
:::

## Syntax

```sql
SHOW ONLINE NODES
```

## Output

`SHOW ONLINE NODES` returns the following columns:

| Column | Description |
|--------|-------------|
| `id` | Node identifier |
| `type` | Node type, such as `SelfManaged` or `SystemManaged` |
| `group` | Node group |
| `warehouse` | Warehouse identifier |
| `cluster` | Cluster identifier |
| `version` | Binary version |

## Example

```sql
SHOW ONLINE NODES;
```
