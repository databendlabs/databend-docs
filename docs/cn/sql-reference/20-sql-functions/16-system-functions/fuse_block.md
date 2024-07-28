---
title: FUSE_BLOCK
---

返回表的最新或指定快照的块信息。有关Databend中块的更多信息，请参见[什么是快照、段和块？](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md#what-are-snapshot-segment-and-block)。

该命令返回快照引用的每个Parquet文件的位置信息。这使得下游应用程序能够访问和消费存储在文件中的数据。

另请参阅：

- [FUSE_SNAPSHOT](fuse_snapshot.md)
- [FUSE_SEGMENT](fuse_segment.md)

## 语法

```sql
FUSE_BLOCK('<database_name>', '<table_name>'[, '<snapshot_id>'])
```

## 示例

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