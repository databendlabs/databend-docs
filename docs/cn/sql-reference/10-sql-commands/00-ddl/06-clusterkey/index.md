---
title: 聚簇键（Cluster Key）
---

本页面全面介绍了 Databend 中聚簇键的操作功能，按功能分类便于查阅。

## 集群键管理

| 命令 | 描述 |
|---------|-------------|
| [SET CLUSTER KEY](dml-set-cluster-key.md) | 为表创建或替换聚簇键 |
| [ALTER CLUSTER KEY](dml-alter-cluster-key.md) | 修改现有聚簇键 |
| [DROP CLUSTER KEY](dml-drop-cluster-key.md) | 从表中移除聚簇键 |
| [RECLUSTER TABLE](dml-recluster-table.md) | 基于聚簇键重新组织表数据 |

## 相关主题

- [聚簇键](/guides/performance/cluster-key)

:::note
Databend 中的聚簇键用于在物理层面组织表数据，通过将相关数据集中存储来提升查询性能。
:::