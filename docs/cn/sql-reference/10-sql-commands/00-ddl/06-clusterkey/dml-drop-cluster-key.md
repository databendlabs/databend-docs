---
title: DROP CLUSTER KEY
sidebar_position: 4
---

删除表的 cluster key。

另请参阅：
[ALTER CLUSTER KEY](./dml-alter-cluster-key.md)

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <name> DROP CLUSTER KEY
```

## 示例

以下命令删除表 *test* 的 cluster key：

```sql
ALTER TABLE test DROP CLUSTER KEY
```