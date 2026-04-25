---
title: ALTER WAREHOUSE UNASSIGN NODES
sidebar_position: 7
---

从某个计算集群中的一个或多个 cluster 移除已分配节点。

:::note
此命令依赖 system management 功能，并需要企业版许可证。
:::

## 语法

```sql
ALTER WAREHOUSE <warehouse_name> UNASSIGN NODES
(
    UNASSIGN <node_count> NODES [ FROM '<node_group>' ] FOR <cluster_name>
    [ , UNASSIGN <node_count> NODES [ FROM '<node_group>' ] FOR <cluster_name> , ... ]
)
```

## 参数

| 参数 | 说明 |
|-----------|-------------|
| `<warehouse_name>` | 目标计算集群。 |
| `<node_count>` | 要移除的节点数量。 |
| `FROM '<node_group>'` | 可选的节点组选择器。 |
| `<cluster_name>` | 计算集群内部的目标 cluster。 |

## 示例

```sql
ALTER WAREHOUSE etl_wh UNASSIGN NODES
(
    UNASSIGN 1 NODES FOR c1,
    UNASSIGN 1 NODES FROM 'default' FOR c2
);
```
