---
title: RECLUSTER TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced: v1.2.25"/>

Re-clusters a table. For why and when to re-cluster a table, see [Re-clustering Table](index.md#re-clustering-table).

<h3 id="optimize-recluster">Unified re-clustering syntax</h3>

<FunctionDescription description="Introduced or updated: Unreleased"/>

New scripts can use the canonical `OPTIMIZE TABLE` form:

```sql
OPTIMIZE TABLE [catalog.][database.]table_name RECLUSTER [FINAL] [WHERE condition] [LIMIT <segment_count>];
```

The `ALTER TABLE` syntax and examples below remain compatibility aliases. Both forms use the same re-clustering operation. The legacy `IF EXISTS` clause is accepted, but it does not skip a missing target in this operation. Check that the target exists before running maintenance.

For materialized views, use the same `OPTIMIZE TABLE` form without `WHERE`. See [Materialized Views](../05-view/materialized-view.md#optimize-mv-recluster). For catalog-qualified compaction, see [OPTIMIZE TABLE](../01-table/60-optimize-table.md#recluster-syntax).

### Distributed Execution

<FunctionDescription description="Introduced or updated: Unreleased"/>

In a cluster, Databend schedules re-clustering across nodes automatically. `enable_distributed_recluster` is deprecated and has no effect. Setting it to `0` does not force local execution. Remove dependencies on this switch when you upgrade.

For the supported range of `auto_compaction_segments_limit` after writes, see [Distributed Execution and Upgrade Compatibility](../01-table/60-optimize-table.md#distributed-execution-and-upgrade-compatibility). That setting does not control the `LIMIT` clause below.

### Syntax

```sql
ALTER TABLE [ IF EXISTS ] <table_name> RECLUSTER [ FINAL ] [ WHERE condition ] [ LIMIT <segment_count> ]
```

The command has a limitation on the number of segments it can process, with the default value being "max_thread * 4". You can modify this limit by using the **LIMIT** option. Alternatively, you have two options to cluster your data in the table further:

- Run the command multiple times against the table.
- Use the **FINAL** option to continuously optimize the table until it is fully clustered.

:::note

Re-clustering a table consumes time (even longer if you include the **FINAL** option) and credits (when you are in Databend Cloud). During the optimizing process, do NOT perform DML actions to the table.
:::

The command does not cluster the table from the ground up. Instead, it selects and reorganizes the most chaotic existing storage blocks from the latest **LIMIT** segments using a clustering algorithm.

### Examples

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