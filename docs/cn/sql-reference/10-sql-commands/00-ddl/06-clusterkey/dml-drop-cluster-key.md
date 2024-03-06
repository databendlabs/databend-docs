---
title: 删除聚类键
sidebar_position: 4
---

删除表的聚类键。

另请参阅：
[修改聚类键](./dml-alter-cluster-key.md)

## 语法

```sql
ALTER TABLE [ IF EXISTS ] <name> DROP CLUSTER KEY
```

## 示例

此命令删除表 *test* 的聚类键：

```sql
ALTER TABLE test DROP CLUSTER KEY
```