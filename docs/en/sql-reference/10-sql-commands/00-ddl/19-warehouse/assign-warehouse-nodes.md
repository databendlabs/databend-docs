---
title: ALTER WAREHOUSE ASSIGN NODES
sidebar_position: 7
---

Assigns nodes to one or more clusters in a warehouse.

:::note
This command requires system management support and an enterprise license.
:::

## Syntax

```sql
ALTER WAREHOUSE <warehouse_name> ASSIGN NODES
(
    ASSIGN <node_count> NODES [ FROM '<node_group>' ] FOR <cluster_name>
    [ , ASSIGN <node_count> NODES [ FROM '<node_group>' ] FOR <cluster_name> , ... ]
)
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `<warehouse_name>` | The target warehouse. |
| `<node_count>` | Number of nodes to assign. |
| `FROM '<node_group>'` | Optional node group selector. |
| `<cluster_name>` | The target cluster inside the warehouse. |

## Example

```sql
ALTER WAREHOUSE etl_wh ASSIGN NODES
(
    ASSIGN 2 NODES FOR c1,
    ASSIGN 1 NODES FROM 'default' FOR c2
);
```
