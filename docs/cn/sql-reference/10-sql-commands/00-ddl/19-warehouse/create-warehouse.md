---
title: CREATE WAREHOUSE
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.687"/>

创建具有指定大小或通过从特定节点组分配节点的计算集群。

## Syntax

```sql
CREATE WAREHOUSE <warehouse_name>  
[WITH warehouse_size = <size> | ( ASSIGN <node_count> NODES FROM <node_group>[, <node_count> NODES FROM <node_group> ... ] ) ]
```

## Examples

此示例创建一个大小为 10 的计算集群：

```sql
CREATE WAREHOUSE test_warehouse WITH warehouse_size = 10；
```

此示例通过从节点组分配特定节点来创建计算集群：

```sql
CREATE WAREHOUSE test_warehouse (ASSIGN 1 NODES FROM log_node, ASSIGN 2 NODES FROM infra_node);
```