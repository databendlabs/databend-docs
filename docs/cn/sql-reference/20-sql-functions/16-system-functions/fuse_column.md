---
title: FUSE_COLUMN
---

返回表的最新或指定快照的列信息。有关 Databend 中块的更多信息，请参阅 [什么是快照、段和块？](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md#what-are-snapshot-segment-and-block)。


另请参阅：

- [FUSE_SNAPSHOT](fuse_snapshot.md)
- [FUSE_SEGMENT](fuse_segment.md)
- [FUSE_BLOCK](fuse_block.md)

## 语法

```sql
FUSE_COLUMN('<database_name>', '<table_name>'[, '<snapshot_id>'])
```

## 示例

```sql
CREATE TABLE mytable(c int);
INSERT INTO mytable values(1);
INSERT INTO mytable values(2);

SELECT * FROM FUSE_COLUMN('default', 'mytable');

---
+----------------------------------+----------------------------+---------------------------------------------------------+------------+-----------+-----------+-------------+-------------+-----------+--------------+------------------+
| snapshot_id                      | timestamp                  | block_location                                          | block_size | file_size | row_count | column_name | column_type | column_id | block_offset | bytes_compressed |
+----------------------------------+----------------------------+---------------------------------------------------------+------------+-----------+-----------+-------------+-------------+-----------+--------------+------------------+
| 3faefc1a9b6a48f388a8b59228dd06c1 | 2023-07-18 03:06:30.276502 | 1/118746/_b/44df130c207745cb858928135d39c1c0_v2.parquet |          4 |       196 |         1 | c           | Int32       |         0 |            8 |               14 |
| 3faefc1a9b6a48f388a8b59228dd06c1 | 2023-07-18 03:06:30.276502 | 1/118746/_b/b6f8496d7e3f4f62a89c09572840cf70_v2.parquet |          4 |       196 |         1 | c           | Int32       |         0 |            8 |               14 |
+----------------------------------+----------------------------+---------------------------------------------------------+------------+-----------+-----------+-------------+-------------+-----------+--------------+------------------+
```