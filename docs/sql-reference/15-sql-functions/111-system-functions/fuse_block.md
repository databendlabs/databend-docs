---
title: FUSE_BLOCK
---

Returns the block information of the latest or specified snapshot of a table. For more information about what is block in Databend, see [What are Snapshot, Segment, and Block?](../../14-sql-commands/00-ddl/20-table/60-optimize-table.md#what-are-snapshot-segment-and-block).

The command returns the location information of each parquet file referenced by a snapshot. This enables downstream applications to access and consume the data stored in the files.

See Also:

- [FUSE_SNAPSHOT](fuse_snapshot.md)
- [FUSE_SEGMENT](fuse_segment.md)

## Syntax

```sql
FUSE_BLOCK('<database_name>', '<table_name>'[, '<snapshot_id>'])
```

## Examples

```sql
CREATE TABLE mytable(c int);
INSERT INTO mytable values(1);
INSERT INTO mytable values(2); 

SELECT * FROM FUSE_BLOCK('default', 'mytable');

---
+----------------------------------+----------------------------+----------------------------------------------------+------------+----------------------------------------------------+-------------------+
| snapshot_id                      | timestamp                  | block_location                                     | block_size | bloom_filter_location                              | bloom_filter_size |
+----------------------------------+----------------------------+----------------------------------------------------+------------+----------------------------------------------------+-------------------+
| 51e84b56458f44269b05a059b364a659 | 2022-09-15 07:14:14.137268 | 1/7/_b/39a6dbbfd9b44ad5a8ec8ab264c93cf5_v0.parquet |          4 | 1/7/_i/39a6dbbfd9b44ad5a8ec8ab264c93cf5_v1.parquet |               221 |
| 51e84b56458f44269b05a059b364a659 | 2022-09-15 07:14:14.137268 | 1/7/_b/d0ee9688c4d24d6da86acd8b0d6f4fad_v0.parquet |          4 | 1/7/_i/d0ee9688c4d24d6da86acd8b0d6f4fad_v1.parquet |               219 |
+----------------------------------+----------------------------+----------------------------------------------------+------------+----------------------------------------------------+-------------------+
```