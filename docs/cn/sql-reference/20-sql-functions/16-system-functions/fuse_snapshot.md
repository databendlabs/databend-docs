---
title: FUSE_SNAPSHOT
---

import FunctionDescription from '@site/src/components/FunctionDescription';

返回表的快照信息。有关 Databend 中快照的更多信息，请参阅 [什么是快照、段和块？](../../10-sql-commands/00-ddl/01-table/60-optimize-table.md#what-are-snapshot-segment-and-block)。

另请参阅：

- [FUSE_SEGMENT](fuse_segment.md)
- [FUSE_BLOCK](fuse_block.md)

## 语法

```sql
FUSE_SNAPSHOT('<数据库名称>', '<表名称>')
```

<h2 id="segment-zone-map">Segment Zone Map</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

可空的 `STRING` 列 `segment_zone_map_location` 包含该快照的 Segment Zone Map 文件路径。值为 `NULL` 表示快照没有 Zone Map 指针。非 NULL 值不保证文件可读取，也不保证覆盖所有当前 Segment。

对于 `default` 中已有的表 `mytable`，可检查最新快照：

```sql
SELECT snapshot_id, segment_count, segment_zone_map_location
FROM FUSE_SNAPSHOT('default', 'mytable')
ORDER BY timestamp DESC
LIMIT 1;
```

当查询使用 Zone Map 裁剪时，`EXPLAIN` 的 Segment 裁剪统计中会包含 `zone map pruning: N to M`。`N` 和 `M` 分别是此步骤前后的 Segment 数量，不是行数。后续裁剪可能进一步减少数量。

维护条件及独立的构建、查询控制请参阅 [Segment Zone Map](/sql/sql-reference/table-engines/fuse#segment-zone-map)。

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