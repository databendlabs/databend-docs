---
title: 聚合索引（Aggregating Index）
---
本页面全面概述了 Databend 中的聚合索引操作，按功能组织以便参考。

## 聚合索引管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE AGGREGATING INDEX](create-aggregating-index.md) | 为表创建新的聚合索引 |
| [DROP AGGREGATING INDEX](drop-aggregating-index.md) | 删除聚合索引 |
| [REFRESH AGGREGATING INDEX](refresh-aggregating-index.md) | 使用最新数据更新聚合索引 |

## 相关主题

- [聚合索引](/guides/performance/aggregating-index)

:::note
Databend 中的聚合索引通过预计算和存储聚合结果，提高聚合查询的性能。
:::
