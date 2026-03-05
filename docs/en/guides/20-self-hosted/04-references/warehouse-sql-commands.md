---
title: Warehouse SQL Commands
---

This page lists warehouse-related SQL commands for self-hosted deployments with system-managed resources management enabled.

## SHOW ONLINE NODES

Lists online query nodes in the tenant.

```sql
SHOW ONLINE NODES
```

```sql
SHOW ONLINE NODES;
```

## CREATE WAREHOUSE

Creates a system-managed warehouse by specifying the number of nodes.

```sql
CREATE WAREHOUSE <warehouse_name>
    WITH warehouse_size = <node_count>
```

```sql
CREATE WAREHOUSE wh1 WITH warehouse_size = 2;
```

## ALTER WAREHOUSE

Manages clusters in a warehouse.

```sql
ALTER WAREHOUSE <warehouse_name>
    ADD CLUSTER <cluster_name> WITH CLUSTER_SIZE = <node_count>

ALTER WAREHOUSE <warehouse_name>
    RENAME CLUSTER <old_cluster_name> TO <new_cluster_name>

ALTER WAREHOUSE <warehouse_name>
    DROP CLUSTER <cluster_name>
```

```sql
ALTER WAREHOUSE wh1 ADD CLUSTER c1 WITH CLUSTER_SIZE = 2;
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

## See Also

- [USE WAREHOUSE](/sql/sql-commands/ddl/warehouse/use-warehouse)
- [DROP WAREHOUSE](/sql/sql-commands/ddl/warehouse/drop-warehouse)
