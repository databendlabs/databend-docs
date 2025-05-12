---
title: RECLUSTER TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.2.25"/>

对表进行重新聚类。有关为什么以及何时重新聚类表，请参见 [重新聚类表](index.md#re-clustering-table)。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] <table_name> RECLUSTER [ FINAL ] [ WHERE condition ] [ LIMIT <segment_count> ]
```

该命令对可以处理的 segment 数量有限制，默认值为“max_thread * 4”。您可以使用 **LIMIT** 选项修改此限制。或者，您有两种选择可以进一步对表中的数据进行聚类：

- 多次对表运行该命令。
- 使用 **FINAL** 选项持续优化表，直到完全聚类。

:::note

重新聚类表会消耗时间（如果包含 **FINAL** 选项，则时间会更长）和 credits（当您在 Databend Cloud 中时）。在优化过程中，请勿对表执行 DML 操作。
:::

该命令不会从头开始聚类表。相反，它使用聚类算法从最新的 **LIMIT** segments 中选择和重组最混乱的现有存储块。

### 示例

```sql
-- create table
create table t(a int, b int) cluster by(a+1);

-- insert some data to t
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

-- alter table recluster
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