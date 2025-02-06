---
title: ALTER WAREHOUSE
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.687"/>

动态调整集群的配置，包括添加/删除集群、重命名集群以及分配/取消分配节点。

## 语法

```sql
ALTER WAREHOUSE <warehouse_name>
    [ADD CLUSTER <cluster_name> [WITH CLUSTER_SIZE = <size>] | (ASSIGN <node_count> NODES FROM <node_group>) ]
  | [RENAME CLUSTER <old_cluster_name> TO <new_cluster_name>]
  | [DROP CLUSTER <cluster_name>]
  | [ASSIGN NODES (ASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name>)]
  | [UNASSIGN NODES (UNASSIGN <node_count> NODES [FROM <node_group>] FOR <cluster_name>)]

```

## 例子

下面的例子将集群添加到现有的集群中：

```sql
ALTER WAREHOUSE test_warehouse ADD CLUSTER test_cluster WITH CLUSTER_SIZE = 3;
```

下面的示例重命名一个现有集群：

```sql
ALTER WAREHOUSE test_warehouse RENAME CLUSTER default TO test_cluster_2;
```

下面的例子删除一个已经存在的集群：

```sql
ALTER WAREHOUSE test_warehouse DROP CLUSTER test_cluster_2;
```

下面的例子将节点添加到现有的集群中：

```sql
ALTER WAREHOUSE test_warehouse ASSIGN NODES (ASSIGN 2 NODES FOR test_cluster);
```

下面的例子从现有的集群中删除节点：

```sql
ALTER WAREHOUSE test_warehouse UNASSIGN NODES (UNASSIGN 1 NODES FOR test_cluster);
```

下面的例子通过从特定的节点组中选择节点来创建集群：

```sql
ALTER WAREHOUSE test_warehouse ADD CLUSTER test_cluster (ASSIGN 1 NODES FROM dev_node, ASSIGN 1 NODES FROM infra_node);
```

下面的例子将特定节点组中的节点添加到现有的集群中：

```sql
ALTER WAREHOUSE test_warehouse ASSIGN NODES (ASSIGN 1 NODES FROM dev_node FOR default, ASSIGN 1 NODES FROM infra_node FOR default);
```

下面的例子从集群中的特定节点组中删除节点：

```sql
ALTER WAREHOUSE test_warehouse UNASSIGN NODES (UNASSIGN 1 NODES FROM dev_node FOR default, UNASSIGN 2 NODES FROM infra_node FOR default);
```
