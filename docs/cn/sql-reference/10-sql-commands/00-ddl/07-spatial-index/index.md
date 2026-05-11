---
title: 空间索引（Spatial Index）
---

Databend 中的空间索引可加速 `GEOMETRY` 列上的空间谓词过滤。它面向 Fuse 表设计，能够在执行精确空间函数前帮助优化器先做 block pruning。

:::tip[关键特性：自动索引构建]
空间索引会在索引创建后的新数据写入过程中自动维护。如果你是在表中已有数据后再创建索引，可以使用 `REFRESH SPATIAL INDEX` 对历史数据进行回填。
:::

## 空间索引管理

| 命令 | 描述 |
|---------|-------------|
| [CREATE SPATIAL INDEX](create-spatial-index.md) | 在一个或多个 `GEOMETRY` 列上创建空间索引 |
| [REFRESH SPATIAL INDEX](refresh-spatial-index.md) | 为索引创建前已有的数据回填空间索引 |
| [DROP SPATIAL INDEX](drop-spatial-index.md) | 从表中删除空间索引 |

## 支持的谓词

Databend 可以使用空间索引来加速以下空间谓词构造的查询：

- `ST_CONTAINS`
- `ST_INTERSECTS`
- `ST_WITHIN`
- `ST_DWITHIN`

## 限制

- 空间索引仅支持 Fuse 表。
- 被索引的列必须是 `GEOMETRY` 类型。
- 不支持 `GEOGRAPHY` 列。

## 相关主题

- [地理空间函数](/sql/sql-functions/geospatial-functions)
