---
title: Warehouse SQL Commands
---

This page documents warehouse-related SQL commands for self-hosted deployments that use system-managed resources management.

## SHOW ONLINE NODES

Lists online query nodes in the tenant.

```sql
SHOW ONLINE NODES
```

```sql
SHOW ONLINE NODES;
```

## CREATE WAREHOUSE

Creates a warehouse by either specifying the number of nodes, or assigning nodes from node groups.

```sql
-- Create a warehouse with a node count
CREATE WAREHOUSE <warehouse_name>
    WITH warehouse_size = <node_count>

-- Create a warehouse by assigning nodes
CREATE WAREHOUSE <warehouse_name>
    (ASSIGN <node_count> NODES [FROM <node_group>] [, ASSIGN <node_count> NODES [FROM <node_group>] ... ])
```

```sql
CREATE WAREHOUSE wh1 WITH warehouse_size = 2;
```

```sql
CREATE WAREHOUSE wh2 (ASSIGN 1 NODES FROM group_a, ASSIGN 1 NODES);
```

## ALTER WAREHOUSE

Manages clusters and nodes in a warehouse.

```sql
ALTER WAREHOUSE <warehouse_name>
    ADD CLUSTER <cluster_name> WITH CLUSTER_SIZE = <node_count>

ALTER WAREHOUSE <warehouse_name>
    ADD CLUSTER <cluster_name>
    (ASSIGN <node_count> NODES [FROM <node_group>] [, ASSIGN <node_count> NODES [FROM <node_group>] ... ])

ALTER WAREHOUSE <warehouse_name>
    RENAME CLUSTER <old_cluster_name> TO <new_cluster_name>

ALTER WAREHOUSE <warehouse_name>
    DROP CLUSTER <cluster_name>

ALTER WAREHOUSE <warehouse_name>
    ASSIGN NODES (ASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name> [, ...])

ALTER WAREHOUSE <warehouse_name>
    UNASSIGN NODES (UNASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name> [, ...])
```

```sql
ALTER WAREHOUSE wh1 ADD CLUSTER c1 WITH CLUSTER_SIZE = 2;
```

```sql
ALTER WAREHOUSE wh1 ASSIGN NODES (ASSIGN 1 NODES FOR default);
```

## USE WAREHOUSE

Sets the current warehouse for the session.

```sql
USE WAREHOUSE <warehouse_name>
```

```sql
USE WAREHOUSE wh1;
```

## RENAME WAREHOUSE

Renames a warehouse.

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

```sql
RENAME WAREHOUSE wh1 TO wh1_new;
```

## SUSPEND WAREHOUSE

Suspends a warehouse.

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

```sql
SUSPEND WAREHOUSE wh1;
```

## RESUME WAREHOUSE

Resumes a suspended warehouse.

```sql
RESUME WAREHOUSE <warehouse_name>
```

```sql
RESUME WAREHOUSE wh1;
```

## DROP WAREHOUSE

Drops a warehouse.

```sql
DROP WAREHOUSE <warehouse_name>
```

```sql
DROP WAREHOUSE wh1;
```
