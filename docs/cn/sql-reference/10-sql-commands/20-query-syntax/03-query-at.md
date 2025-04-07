```md
---
title: AT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.410"/>

通过 AT 子句，您可以通过指定快照 ID、时间戳、流名称或时间间隔来检索数据的先前版本。

当数据更新发生时，Databend 会自动创建快照，因此快照可以被认为是过去某个时间点的数据视图。您可以通过快照 ID 或创建快照时的时间戳来访问快照。有关如何获取快照 ID 和时间戳，请参阅 [获取快照 ID 和时间戳](#获取快照-id-和时间戳)。

这是 Databend 的时间回溯功能的一部分，允许您在保留期内（默认为 24 小时）查询、备份和恢复数据的先前版本。

## 语法

```sql    
SELECT ...
FROM ...
AT (
       SNAPSHOT => '<snapshot_id>' |
       TIMESTAMP => <timestamp> | 
       STREAM => <stream_name> |
       OFFSET => <time_interval> 
   )   
```

| Parameter | Description                                                                                                                                                                                                                                                                                                      |
|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SNAPSHOT  | 指定要从中查询先前数据的特定快照 ID。                                                                                                                                                                                                                                                    |
| TIMESTAMP | 指定要从中检索数据的特定时间戳。                                                                                                                                                                                                                                                          |
| STREAM    | 表示查询创建指定流时的数据。                                                                                                                                                                                                                                        |
| OFFSET    | 指定从当前时间回溯的秒数。它应该采用负整数的形式，其中绝对值表示以秒为单位的时间差。例如，`-3600` 表示回溯 1 小时（3,600 秒）。 |

## 获取快照 ID 和时间戳

要返回表的所有快照的快照 ID 和时间戳，请使用 [FUSE_SNAPSHOT](../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数：

```sql
SELECT snapshot_id, 
       timestamp 
FROM   FUSE_SNAPSHOT('<database_name>', '<table_name>'); 
```

## 示例

本示例演示了 AT 子句，允许基于快照 ID、时间戳和流检索先前的数据版本：

1. 创建一个名为 `t` 的表，其中包含一个名为 `a` 的列，并将两行值 1 和 2 插入到表中。

```sql
CREATE TABLE t(a INT);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
```

2. 在表 `t` 上创建一个名为 `s` 的流，并将另一行值 3 添加到表中。

```sql
CREATE STREAM s ON TABLE t;

INSERT INTO t VALUES(3);
```

3. 运行时间回溯查询以检索先前的数据版本。

```sql
-- 返回表 't' 的快照 ID 和对应的时间戳
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');
┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 296349da841d4fa8820bbf8e228d75f3 │ 2024-04-02 15:25:21.456574 │
│ aaa4857c5935401790db2c9f0f2818be │ 2024-04-02 15:19:02.484304 │
│ e66ad2bc3f21416e87903dc9cd0388a3 │ 2024-04-02 15:18:40.766361 │
└───────────────────────────────────────────────────────────────┘

-- 这些查询检索相同的数据，但使用不同的方法：
-- 通过 snapshot_id：
SELECT * FROM t AT (SNAPSHOT => 'aaa4857c5935401790db2c9f0f2818be');
-- 通过 timestamp：
SELECT * FROM t AT (TIMESTAMP => '2024-04-02 15:19:02.484304'::TIMESTAMP);
-- 通过 stream：
SELECT * FROM t AT (STREAM => s);

┌─────────────────┐
│        a        │
├─────────────────┤
│               1 │
│               2 │
└─────────────────┘

-- 检索表 't' 中的所有列，其中包含 60 秒前的数据
SELECT * FROM t AT (OFFSET => -60);
```