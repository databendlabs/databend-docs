---
title: 重新聚类表
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入版本：v1.2.25"/>

重新聚类一个表。关于为什么以及何时重新聚类一个表，请参见[重新聚类表](index.md#re-clustering-table)。

### 语法

```sql
ALTER TABLE [ IF EXISTS ] <table_name> RECLUSTER [ FINAL ] [ WHERE condition ] [ LIMIT <segment_count> ]
```

该命令在可以处理的段数上有限制，默认值为 "max_thread * 4"。您可以通过使用 **LIMIT** 选项来修改此限制。或者，您有两个选项可以进一步聚类表中的数据：

- 对表多次运行命令。
- 使用 **FINAL** 选项，持续优化表，直到完全聚类。

:::note

重新聚类一个表会消耗时间（如果包括 **FINAL** 选项，则时间更长）和积分（当您在 Databend Cloud 中时）。在优化过程中，不要对表执行 DML 操作。
:::

该命令不会从头开始聚类表。相反，它会使用聚类算法选择并重新组织最新 **LIMIT** 段中最混乱的现有存储块。

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

-- 修改表重新聚类
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