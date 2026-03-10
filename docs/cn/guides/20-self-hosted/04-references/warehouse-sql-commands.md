---
title: 计算集群 SQL 命令
---

本页列出在自建部署中启用系统管理（system-managed）资源管理后，可用于管理计算集群的 SQL 命令。

## SHOW ONLINE NODES

列出租户中当前在线的查询节点。

```sql
SHOW ONLINE NODES
```

```sql
SHOW ONLINE NODES;
```

## CREATE WAREHOUSE

通过指定节点数量创建系统管理的计算集群。

```sql
CREATE WAREHOUSE <warehouse_name>
    WITH warehouse_size = <node_count>
```

```sql
CREATE WAREHOUSE wh1 WITH warehouse_size = 2;
```

## ALTER WAREHOUSE

用于管理计算集群中的集群（cluster）。

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

重命名计算集群。

```sql
RENAME WAREHOUSE <current_name> TO <new_name>
```

```sql
RENAME WAREHOUSE wh1 TO wh1_new;
```

## SUSPEND WAREHOUSE

暂停计算集群。

```sql
SUSPEND WAREHOUSE <warehouse_name>
```

```sql
SUSPEND WAREHOUSE wh1;
```

## RESUME WAREHOUSE

恢复已暂停的计算集群。

```sql
RESUME WAREHOUSE <warehouse_name>
```

```sql
RESUME WAREHOUSE wh1;
```

## 另请参阅

- [USE WAREHOUSE](/sql/sql-commands/ddl/warehouse/use-warehouse)
- [DROP WAREHOUSE](/sql/sql-commands/ddl/warehouse/drop-warehouse)
