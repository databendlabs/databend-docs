---
title: CREATE WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

创建具有指定大小的集群，或通过从特定节点组分配节点来创建集群。

## 语法

```sql
CREATE WAREHOUSE <warehouse_name>
[WITH warehouse_size = <size> | ( ASSIGN <node_count> NODES FROM <node_group>[, <node_count> NODES FROM <node_group> ... ] ) ]
```

## 例子

下面的例子创建了一个大小为 10 的集群：

```sql
CREATE WAREHOUSE test_warehouse WITH warehouse_size = 10；
```

面的例子通过从节点组中分配特定的节点来创建一个集群：

```sql
CREATE WAREHOUSE test_warehouse (ASSIGN 1 NODES FROM log_node, ASSIGN 2 NODES FROM infra_node);
```
