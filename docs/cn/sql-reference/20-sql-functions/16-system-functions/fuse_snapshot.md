---
title: FUSE_SNAPSHOT
---

返回表的快照信息。有关 Databend 中快照的更多信息，请参阅 [什么是快照、段和块？](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md#what-are-snapshot-segment-and-block)。

另请参阅：

- [FUSE_SEGMENT](fuse_segment.md)
- [FUSE_BLOCK](fuse_block.md)

## 语法

```sql
FUSE_SNAPSHOT('<数据库名称>', '<表名称>')
```

## 示例

```sql
CREATE TABLE mytable(a int, b int) CLUSTER BY(a+1);

INSERT INTO mytable VALUES(1,1),(3,3);
INSERT INTO mytable VALUES(2,2),(5,5);
INSERT INTO mytable VALUES(4,4);

SELECT * FROM FUSE_SNAPSHOT('default','mytable');

---
| snapshot_id                      | snapshot_location                                          | format_version | previous_snapshot_id             | segment_count | block_count | row_count | bytes_uncompressed | bytes_compressed | index_size | timestamp                  |
|----------------------------------|------------------------------------------------------------|----------------|----------------------------------|---------------|-------------|-----------|--------------------|------------------|------------|----------------------------|
| a13d211b7421432898a3786848b8ced3 | 670655/783287/_ss/a13d211b7421432898a3786848b8ced3_v1.json | 1              | \N                               | 1             | 1           | 2         | 16                 | 290              | 363        | 2022-09-19 14:51:52.860425 |
| cf08e6af6c134642aeb76bc81e6e7580 | 670655/783287/_ss/cf08e6af6c134642aeb76bc81e6e7580_v1.json | 1              | a13d211b7421432898a3786848b8ced3 | 2             | 2           | 4         | 32                 | 580              | 726        | 2022-09-19 14:52:15.282943 |
| 1bd4f68b831a402e8c42084476461aa1 | 670655/783287/_ss/1bd4f68b831a402e8c42084476461aa1_v1.json | 1              | cf08e6af6c134642aeb76bc81e6e7580 | 3             | 3           | 5         | 40                 | 862              | 1085       | 2022-09-19 14:52:20.284347 |
```