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
Processed in (0.027 sec)

root@localhost> INSERT INTO test_truncate(a,b) VALUES(1234, 'databend');
1 rows affected in (0.060 sec)

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
1 row in 0.019 sec. Processed 1 rows, 1B (53.26 rows/s, 17.06 KiB/s)

root@localhost> TRUNCATE TABLE test_truncate;

TRUNCATE TABLE test_truncate

0 row in 0.047 sec. Processed 0 rows, 0B (0 rows/s, 0B/s)

root@localhost> SELECT * FROM test_truncate;

SELECT
  *
FROM
  test_truncate

0 row in 0.017 sec. Processed 0 rows, 0B (0 rows/s, 0B/s)
```