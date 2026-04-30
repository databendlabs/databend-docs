---
title: INSPECT WAREHOUSE
sidebar_position: 7
---

Shows the nodes currently assigned to a warehouse.

:::note
This command requires system management support and an enterprise license.
:::

## Syntax

```sql
INSPECT WAREHOUSE <warehouse_name>
```

## Output

`INSPECT WAREHOUSE` returns the following columns:

| Column | Description |
|--------|-------------|
| `cluster` | Cluster identifier inside the warehouse |
| `node` | Node identifier |
| `type` | Node type, such as `SelfManaged` or `SystemManaged` |

## Example

```sql
INSPECT WAREHOUSE etl_wh;
```
