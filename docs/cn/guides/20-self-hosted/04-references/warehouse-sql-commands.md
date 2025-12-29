---
title: 计算集群 SQL 命令
---

本页介绍在自建部署中启用系统管理（system-managed）资源管理后，可用于管理计算集群的 SQL 命令。

## SHOW ONLINE NODES

列出租户中当前在线的查询节点。

```sql
SHOW ONLINE NODES
```

```sql
SHOW ONLINE NODES;
```

## CREATE WAREHOUSE

创建计算集群：可以指定节点数量，也可以从节点组分配节点。

```sql
-- 通过节点数量创建
CREATE WAREHOUSE <warehouse_name>
    WITH warehouse_size = <node_count>

-- 通过分配节点创建
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

用于管理计算集群中的集群（cluster）与节点。

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
