---
title: RECLUSTER TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.2.25"/>

重新聚簇一个表。关于为什么以及何时重新聚簇一个表，请参见[重新聚簇表](index.md#re-clustering-table)。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] <table_name> RECLUSTER [ FINAL ] [ WHERE condition ] [ LIMIT <segment_count> ]
```

该命令在处理段的数量上有一定的限制，默认值为“max_thread * 4”。您可以通过使用 **LIMIT** 选项来修改此限制。或者，您有两种选择来进一步聚簇表中的数据：

- 多次对表运行该命令。
- 使用 **FINAL** 选项来持续优化表，直到它完全聚簇。

:::note

重新聚簇一个表会消耗时间（如果包含 **FINAL** 选项，时间会更长）和信用点（当您在 Databend Cloud 中时）。在优化过程中，请勿对表执行 DML 操作。
:::

该命令不会从头开始聚簇表。相反，它选择并重新组织来自最新 **LIMIT** 段中最混乱的现有存储块，使用聚簇算法。

### 示例

```sql
-- 创建表
create table t(a int, b int) cluster by(a+1);

-- 向 t 插入一些数据
insert into t values(1,1),(3,3);
insert into t values(2,2),(5,5);
insert into t values(4,4);

select * from clustering_information('default','t')\G
*************************** 1. row ***************************
            cluster_key: ((a + 1))
      total_block_count: 3
   constant_block_count: 1
unclustered_block_count: 0
       average_overlaps: 1.3333
          average_depth: 2.0
  block_depth_histogram: {"00002":3}

-- 重新聚簇表
ALTER TABLE t RECLUSTER FINAL WHERE a != 4;

select * from clustering_information('default','t')\G
*************************** 1. row ***************************
            cluster_key: ((a + 1))
      total_block_count: 2
   constant_block_count: 1
unclustered_block_count: 0
       average_overlaps: 1.0
          average_depth: 2.0
  block_depth_histogram: {"00002":2}
```