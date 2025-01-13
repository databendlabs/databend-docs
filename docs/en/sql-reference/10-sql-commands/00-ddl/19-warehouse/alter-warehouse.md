---
title: ALTER WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Dynamically adjusts the configuration of a warehouse, including adding/removing clusters, renaming clusters, and assigning/unassigning nodes. 

## Syntax

```sql
ALTER WAREHOUSE <warehouse_name>
    [ADD CLUSTER <cluster_name> [WITH CLUSTER_SIZE = <size>] | (ASSIGN <node_count> NODES FROM <node_group>) ]
  | [RENAME CLUSTER <old_cluster_name> TO <new_cluster_name>]
  | [DROP CLUSTER <cluster_name>]
  | [ASSIGN NODES (ASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name>)]
  | [UNASSIGN NODES (UNASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name>)]

```

## Examples

This example adds a cluster to an existing warehouse:

```sql
ALTER WAREHOUSE test_warehouse ADD CLUSTER test_cluster WITH CLUSTER_SIZE = 3;
```

This example renames an existing cluster:

```sql
ALTER WAREHOUSE test_warehouse RENAME CLUSTER default TO test_cluster_2;
```

This example removes an existing cluster:

```sql
ALTER WAREHOUSE test_warehouse DROP CLUSTER test_cluster_2;
```

This example adds nodes to an existing warehouse:

```sql
ALTER WAREHOUSE test_warehouse ASSIGN NODES (ASSIGN 2 NODES FOR test_cluster);
```

This example removes nodes from an existing warehouse:

```sql
ALTER WAREHOUSE test_warehouse UNASSIGN NODES (UNASSIGN 1 NODES FOR test_cluster);
```

This example creates a cluster by selecting nodes from specific node groups:

```sql
ALTER WAREHOUSE test_warehouse ADD CLUSTER test_cluster (ASSIGN 1 NODES FROM dev_node, ASSIGN 1 NODES FROM infra_node);
```

This example adds nodes from specific node groups to an existing warehouse:

```sql
ALTER WAREHOUSE test_warehouse ASSIGN NODES (ASSIGN 1 NODES FROM dev_node FOR default, ASSIGN 1 NODES FROM infra_node FOR default);
```

This example removes nodes from specific node groups in a warehouse:

```sql
ALTER WAREHOUSE test_warehouse UNASSIGN NODES (UNASSIGN 1 NODES FROM dev_node FOR default, UNASSIGN 2 NODES FROM infra_node FOR default);
```