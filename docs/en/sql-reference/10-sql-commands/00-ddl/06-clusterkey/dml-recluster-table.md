---
title: RECLUSTER TABLE
sidebar_position: 2
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Re-clusters a table. For why and when to re-cluster a table, see [Re-clustering Table](index.md#re-clustering-table).

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

## Streaming Multiway Merge

Streaming multiway merge for horizontal reclustering was introduced in v1.2.952. It merges sorted source blocks in bounded full-row batches and can spill through the existing sort-spill path.

| Setting | Default | Scope |
|---------|---------|-------|
| `enable_recluster_multiway_merge` | `0` since v1.2.957; previously `1` | Enables streaming execution for eligible horizontal `MergeBlocks` tasks. |
| `enable_recluster_inverted_index_merge` | `1` | Allows compatible inverted indexes to be reused during streaming merge. It has no effect on this path when multiway merge is disabled. |

The multiway setting changed to default-off in v1.2.957 because of performance concerns in some recluster workloads. The previous sort-based path is now the default. Enable streaming only after evaluating your workload; it is not a guaranteed speedup.

```sql
SET enable_recluster_multiway_merge = 1;
SET enable_recluster_inverted_index_merge = 1;
ALTER TABLE my_table RECLUSTER FINAL;
```

Both settings accept `0` or `1`. Enabling them does not force every task to use streaming merge:

- The task must be an ordered linear `MergeBlocks` task on Parquet data.
- `SortBlocks`, Hilbert/vector clustering, non-Parquet data, and tables with virtual computed columns do not use this executor.
- Inverted-index reuse is selected separately for each index. All source indexes for that definition must be present and compatible in definition and format. Missing or incompatible source indexes use the normal rebuild path for that index.
- Aggregate-state columns disable inverted-index reuse. They do not by themselves disable streaming data merge.
- An error after an index has been selected for merging fails the task. It does not silently fall back to rebuilding that index.

Disable only index reuse while keeping streaming enabled:

```sql
SET enable_recluster_inverted_index_merge = 0;
```

Use the previous executor regardless of index-reuse settings:

```sql
SET enable_recluster_multiway_merge = 0;
```

To remove session overrides and use the configured defaults again:

```sql
UNSET enable_recluster_multiway_merge;
UNSET enable_recluster_inverted_index_merge;
```

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