---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新于：v1.2.687"/>

创建一个具有指定大小的计算集群（Warehouse），或通过从特定节点组分配节点来创建。

## 语法

```sql
CREATE WAREHOUSE <warehouse_name>
[WITH warehouse_size = <size> | ( ASSIGN <node_count> NODES FROM <node_group>[, <node_count> NODES FROM <node_group> ... ] ) ]
```

## 示例

此示例创建一个大小为 10 的计算集群（Warehouse）：

```sql
CREATE WAREHOUSE test_warehouse WITH warehouse_size = 10;
```

此示例通过从特定节点组分配节点来创建一个计算集群（Warehouse）：

```sql
CREATE WAREHOUSE test_warehouse (ASSIGN 1 NODES FROM log_node, ASSIGN 2 NODES FROM infra_node);
```