---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

Creates a warehouse with specified size or by assigning nodes from specific node groups.

## Syntax

```sql
CREATE WAREHOUSE <warehouse_name>
[WITH warehouse_size = <size> | ( ASSIGN <node_count> NODES FROM <node_group>[, <node_count> NODES FROM <node_group> ... ] ) ]
```

## Examples

This example creates a warehouse with a size of 10:

```sql
CREATE WAREHOUSE test_warehouse WITH warehouse_size = 10;
```

This example creates a warehouse by assigning specific nodes from node groups:

```sql
CREATE WAREHOUSE test_warehouse (ASSIGN 1 NODES FROM log_node, ASSIGN 2 NODES FROM infra_node);
```
