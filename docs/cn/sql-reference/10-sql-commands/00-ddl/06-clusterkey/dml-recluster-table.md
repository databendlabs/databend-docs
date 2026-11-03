---
title: RECLUSTER TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

对表进行重新聚类。有关为什么以及何时重新聚类表，请参阅 [重新聚类表](index.md#re-clustering-table)。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] <table_name> RECLUSTER [ FINAL ] [ WHERE condition ] [ LIMIT <segment_count> ]
```

该命令对可以处理的 segment 数量有限制，默认值为“max_thread * 4”。您可以使用 **LIMIT** 选项修改此限制。或者，您有两个选项可以进一步聚类表中的数据：

- 对表多次运行该命令。
- 使用 **FINAL** 选项持续优化表，直到完全聚类。

:::note

重新聚类表会消耗时间（如果包含 **FINAL** 选项，则时间会更长）和 credits（当您在 Databend Cloud 中时）。在优化过程中，请勿对表执行 DML 操作。
:::

该命令不会从头开始聚类表。相反，它使用聚类算法从最新的 **LIMIT** segments 中选择和重组最混乱的现有存储块。

<a id="streaming-multiway-merge"></a>

## 流式多路归并

水平重聚类的流式多路归并在 v1.2.952 中引入。它以有界的整行批次合并已排序的源 Block，并可通过现有排序溢出路径将数据溢出到存储。

| 设置 | 默认值 | 范围 |
|---------|---------|-------|
| `enable_recluster_multiway_merge` | 从 v1.2.957 开始为 `0`；此前为 `1` | 为符合条件的水平 `MergeBlocks` 任务启用流式执行。 |
| `enable_recluster_inverted_index_merge` | `1` | 允许在流式归并期间复用兼容的倒排索引。多路归并关闭时，它不会启用此路径。 |

由于部分重聚类工作负载存在性能问题，多路归并设置从 v1.2.957 开始默认关闭。现在默认使用原有的排序路径。请先评估工作负载，再启用流式执行；它不保证加速。

```sql
SET enable_recluster_multiway_merge = 1;
SET enable_recluster_inverted_index_merge = 1;
ALTER TABLE my_table RECLUSTER FINAL;
```

两个设置都接受 `0` 或 `1`。启用它们不代表每个任务都会使用流式归并：

- 任务必须是 Parquet 数据上有序的线性 `MergeBlocks` 任务。
- `SortBlocks`、Hilbert/向量聚类、非 Parquet 数据和包含虚拟计算列的表不使用此执行器。
- 倒排索引复用按索引分别选择。该定义的所有源索引都必须存在，且定义和格式兼容。源索引缺失或不兼容时，该索引使用普通重建路径。
- 聚合状态列会禁用倒排索引复用，但其本身不会禁用流式数据归并。
- 某个索引被选中进行归并后，若发生错误，任务会失败，而不是静默退回索引重建。

仅关闭索引复用，保留流式执行：

```sql
SET enable_recluster_inverted_index_merge = 0;
```

不论索引复用设置如何，都使用原有执行器：

```sql
SET enable_recluster_multiway_merge = 0;
```

移除会话覆盖，重新使用配置的默认值：

```sql
UNSET enable_recluster_multiway_merge;
UNSET enable_recluster_inverted_index_merge;
```

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