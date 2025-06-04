---
title: 系统函数 (System Functions)
---

本页面提供 Databend 中系统相关函数的参考信息，这些函数可帮助分析和监控 Databend 部署的内部存储与性能情况。

## 表元数据函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [CLUSTERING_INFORMATION](clustering_information.md) | 返回表的聚类信息 | `CLUSTERING_INFORMATION('default', 'mytable')` |

## 存储层函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [FUSE_SNAPSHOT](fuse_snapshot.md) | 返回表的快照信息 | `FUSE_SNAPSHOT('default', 'mytable')` |
| [FUSE_SEGMENT](fuse_segment.md) | 返回表的段信息 | `FUSE_SEGMENT('default', 'mytable')` |
| [FUSE_BLOCK](fuse_block.md) | 返回表的块信息 | `FUSE_BLOCK('default', 'mytable')` |
| [FUSE_COLUMN](fuse_column.md) | 返回表的列信息 | `FUSE_COLUMN('default', 'mytable')` |

## 存储优化函数

| 函数 | 描述 | 示例 |
|----------|-------------|--------|
| [FUSE_STATISTIC](fuse_statistic.md) | 返回表的统计信息 | `FUSE_STATISTIC('default', 'mytable')` |
| [FUSE_ENCODING](fuse_encoding.md) | 返回表的编码信息 | `FUSE_ENCODING('default', 'mytable')` |
| [FUSE_VIRTUAL_COLUMN](fuse_virtual_column.md) | 返回虚拟列信息 | `FUSE_VIRTUAL_COLUMN('default', 'mytable')` |
| [FUSE_TIME_TRAVEL_SIZE](fuse_time_travel_size.md) | 返回 Time Travel 存储信息 | `FUSE_TIME_TRAVEL_SIZE('default', 'mytable')` |