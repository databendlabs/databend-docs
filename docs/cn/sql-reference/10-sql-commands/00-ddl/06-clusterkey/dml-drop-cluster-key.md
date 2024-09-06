---
title: DROP CLUSTER KEY
sidebar_position: 4
---

删除表的计算集群键。

另请参阅:
[ALTER CLUSTER KEY](./dml-alter-cluster-key.md) 

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <name> DROP CLUSTER KEY
```

## 示例

此命令删除表 *test* 的计算集群键:

```sql
ALTER TABLE test DROP CLUSTER KEY
```