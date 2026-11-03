---
title: OPTIMIZE TABLE
sidebar_position: 8
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.952"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

OPTIMIZE TABLE compacts small segments and blocks to improve query performance. To reclaim storage occupied by eligible historical data after compaction, use [VACUUM TABLE](91-vacuum-table.md).

<DetailsWrap>

<details>
  <summary>Why Optimize?</summary>
    <div>Databend stores data in tables using the Parquet format, which is organized into blocks. Additionally, Databend supports time travel functionality, where each operation that modifies a table generates a Parquet file that captures and reflects the changes made to the table.</div><br/>

   <div>As a table accumulates small blocks and segments, queries may need to read more files and metadata. Compaction merges them into larger units to reduce this overhead. Historical files are retained until they become eligible for cleanup by VACUUM TABLE.</div>
</details>

</DetailsWrap>

## Databend Data Storage: Snapshot, Segment, and Block

Snapshot, segment, and block are the concepts Databend uses for data storage. Databend uses them to construct a hierarchical structure for storing table data.

![](/img/sql/storage-structure.PNG)

Databend automatically creates table snapshots upon data updates. A snapshot represents a version of the table's segment metadata.

When working with Databend, you're most likely to access a snapshot with the snapshot ID when you retrieve and query a previous version of the table's data with the [AT](../../20-query-syntax/03-query-at.md) clause.

A snapshot is a JSON file that does not save the table's data but indicate the segments the snapshot links to. If you run [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) against a table, you can find the saved snapshots for the table.

A segment is a JSON file that organizes the storage blocks (at least 1, at most 1,000) where the data is stored. If you run [FUSE_SEGMENT](../../../20-sql-functions/16-system-functions/fuse_segment.md) against a snapshot with the snapshot ID, you can find which segments are referenced by the snapshot.

Databends saves actual table data in parquet files and considers each parquet file as a block. If you run [FUSE_BLOCK](../../../20-sql-functions/16-system-functions/fuse_block.md) against a snapshot with the snapshot ID, you can find which blocks are referenced by the snapshot.

Databend creates a unique ID for each database and table for storing the snapshot, segment, and block files and saves them to your object storage in the path `<bucket_name>/<tenant_id>/<db_id>/<table_id>/`. Each snapshot, segment, and block file is named with a UUID (32-character lowercase hexadecimal string).

| File     | Format  | Filename                        | Storage Folder                                      |
|----------|---------|---------------------------------|-----------------------------------------------------|
| Snapshot | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_ss/` |
| Segment  | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_sg/` |
| Block    | parquet | `<32bitUUID>_<version>.parquet` | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_b/`  |

## Table Optimizations

In Databend, it's advisable to aim for an ideal block size of either 100MB (uncompressed) or 1,000,000 rows, with each segment consisting of 1,000 blocks. To maximize table optimization, it's crucial to gain a clear understanding of when and how to apply various optimization techniques, such as [Segment Compaction](#segment-compaction) and [Block Compaction](#block-compaction).
- When using the COPY INTO or REPLACE INTO command to write data into a table that includes a cluster key, Databend will automatically initiate a re-clustering process, as well as a segment and block compact process.

- Segment & block compactions support distributed execution in cluster environments. You can enable them by setting ENABLE_DISTRIBUTED_COMPACT to 1. This helps enhance data query performance and scalability in cluster environments.

  ```sql
  SET enable_distributed_compact = 1;
  ```

### Segment Compaction

Compact segments when a table has too many small segments (less than `100 blocks` per segment).
```sql
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('your-database', 'your-table')
    LIMIT 1;
```

**Syntax**

```sql
OPTIMIZE TABLE [database.]table_name COMPACT SEGMENT [LIMIT <segment_count>]    
```

Merges small segments into larger segments without rewriting data blocks.

Since v1.2.952, `COMPACT SEGMENT LIMIT n` selects the newest input window before it reads segment metadata:

- The window contains `min(max(n, 2), segment_count)` segments from the current snapshot, newest first. `LIMIT 0` and `LIMIT 1` still select up to two segments.
- The limit bounds the input segments inspected. It does not specify how many segments must merge or how many output segments the operation creates.
- Databend does not inspect older segments outside this window for merge candidates. It can leave some selected segments unchanged if they do not need compaction.
- Without `LIMIT`, Databend considers all segments in the current snapshot. This is not a scan of historical snapshots.

Repeated limited runs can leave older fragments untouched. Run `COMPACT SEGMENT` without `LIMIT` periodically when older segments also need compaction. These rules apply to `COMPACT SEGMENT`, not to block compaction.

**Example**

```sql
-- Check whether need segment compact
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits');

+-------------+---------------+-------------------------------------+
| block_count | segment_count | advice                              |
+-------------+---------------+-------------------------------------+
|         751 |            32 | The table needs segment compact now |
+-------------+---------------+-------------------------------------+
    
-- Compact segment
OPTIMIZE TABLE hits COMPACT SEGMENT;
    
-- Check again
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits')
    LIMIT 1;

+-------------+---------------+---------------------------------------------+
| block_count | segment_count | advice                                      |
+-------------+---------------+---------------------------------------------+
|         751 |             1 | The table does not need segment compact now |
+-------------+---------------+---------------------------------------------+
```

**Limited compaction example**

Each separate insert below creates a segment. The first compaction considers only the newest two segments. The unrestricted compaction can then merge the remaining older fragments.

```sql
CREATE TABLE compact_segment_latest_limit(a INT) BLOCK_PER_SEGMENT = 4;
INSERT INTO compact_segment_latest_limit VALUES (1);
INSERT INTO compact_segment_latest_limit VALUES (2);
INSERT INTO compact_segment_latest_limit VALUES (3);
INSERT INTO compact_segment_latest_limit VALUES (4);

OPTIMIZE TABLE compact_segment_latest_limit COMPACT SEGMENT LIMIT 2;

-- Expected counts: 3 segments, 4 blocks, 4 rows.
SELECT segment_count, block_count, row_count
FROM fuse_snapshot('default', 'compact_segment_latest_limit') LIMIT 1;

OPTIMIZE TABLE compact_segment_latest_limit COMPACT SEGMENT;

-- Expected counts: 1 segment, 4 blocks, 4 rows.
SELECT segment_count, block_count, row_count
FROM fuse_snapshot('default', 'compact_segment_latest_limit') LIMIT 1;

DROP TABLE compact_segment_latest_limit;
```

### Block Compaction

Compact blocks when a table has a large number of small blocks or when the table has a high percentage of inserted, deleted, or updated rows.

You can check it with if the uncompressed size of each block is close to the perfect size of `100MB`. 

If the size is less than `50MB`, we suggest doing block compaction, as it indicates too many small blocks:

```sql
SELECT
  block_count,
  humanize_size(bytes_uncompressed / block_count) AS per_block_uncompressed_size,
  IF(
              bytes_uncompressed / block_count / 1024 / 1024 < 50,
              'The table needs block compact now',
              'The table does not need block compact now'
    ) AS advice
FROM
  fuse_snapshot('your-database', 'your-table')
    LIMIT 1;
```

:::info
We recommend performing segment compaction first, followed by block compaction.
:::

**Syntax**
```sql
OPTIMIZE TABLE [database.]table_name COMPACT [LIMIT <segment_count>]    
```
Compacts the table data by merging small blocks and segments into larger ones.

- This command creates a new snapshot (along with compacted segments and blocks) of the most recent table data without affecting the existing storage files, so reclaim storage from eligible historical data with [VACUUM TABLE](91-vacuum-table.md) after compaction.

- Depending on the size of the given table, it may take quite a while to complete the execution.

- The option LIMIT sets the maximum number of segments to be compacted. In this case, Databend will select and compact the latest segments.

- Databend will automatically re-cluster a clustered table after the compacting process.

**Example**
```sql
OPTIMIZE TABLE my_database.my_table COMPACT LIMIT 50;
```

To compact and then clean up eligible historical files:

```sql
OPTIMIZE TABLE my_database.my_table COMPACT;
VACUUM TABLE my_database.my_table;
```
