---
title: Warehouse
---

This page provides a comprehensive overview of Warehouse operations in Databend, organized by functionality for easy reference.

## Warehouse Management

| Command | Description |
|---------|-------------|
| [CREATE WAREHOUSE](create-warehouse.md) | Creates a new warehouse for compute resources |
| [ALTER WAREHOUSE](alter-warehouse.md) | Modifies an existing warehouse configuration |
| [DROP WAREHOUSE](drop-warehouse.md) | Removes a warehouse |
| [RENAME WAREHOUSE](rename-warehouse.md) | Changes the name of a warehouse |
| [SUSPEND WAREHOUSE](suspend-warehouse.md) | Temporarily stops a warehouse to save resources |
| [RESUME WAREHOUSE](resume-warehouse.md) | Restarts a suspended warehouse |
| [USE WAREHOUSE](use-warehouse.md) | Sets the current warehouse for the session |

## Warehouse Information

| Command | Description |
|---------|-------------|
| [SHOW WAREHOUSES](show-warehouses.md) | Lists all warehouses |
| [SHOW ONLINE NODES](show-online-nodes.md) | Displays active compute nodes in the current warehouse |

:::note
Warehouses in Databend represent compute resources that execute queries. They can be scaled up or down based on workload requirements and can be suspended when not in use to optimize costs.
:::