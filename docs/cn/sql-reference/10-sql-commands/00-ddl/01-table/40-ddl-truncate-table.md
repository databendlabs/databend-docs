---
title: TRUNCATE TABLE
sidebar_position: 16
---

从表中删除所有数据，同时保留表的架构。它删除表中的所有行，使之成为一个空表，但列和约束保持不变。请注意，它不会释放分配给表的磁盘空间。

另见：[DROP TABLE](20-ddl-drop-table.md)

## 语法

```sql
TRUNCATE TABLE [ <database_name>. ]table_name
```

## 示例

```sql
root@localhost> CREATE TABLE test_truncate(a BIGINT UNSIGNED, b VARCHAR);
处理时间 (0.027 秒)

root@localhost> INSERT INTO test_truncate(a,b) VALUES(1234, 'databend');
1 行受影响 (0.060 秒)

root@localhost> SELECT * FROM test_truncate;

SELECT
  *
FROM
  test_truncate

┌───────────────────┐
│    a   │     b    │
│ UInt64 │  String  │
├────────┼──────────┤
│   1234 │ databend │
└───────────────────┘
1 行在 0.019 秒内。处理了 1 行，1B (53.26 行/秒, 17.06 KiB/秒)

root@localhost> TRUNCATE TABLE test_truncate;

TRUNCATE TABLE test_truncate

0 行在 0.047 秒内。处理了 0 行，0B (0 行/秒, 0B/秒)

root@localhost> SELECT * FROM test_truncate;

SELECT
  *
FROM
  test_truncate

0 行在 0.017 秒内。处理了 0 行，0B (0 行/秒, 0B/秒)
```