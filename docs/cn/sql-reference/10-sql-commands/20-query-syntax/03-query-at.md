---
title: AT
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.410"/>

AT 子句使您能够通过指定快照 ID、时间戳、流名称或时间间隔来检索数据的前一个版本。

Databend 在数据更新时自动创建快照，因此快照可以被视为过去某个时间点的数据视图。您可以通过快照 ID 或创建快照的时间戳访问快照。有关如何获取快照 ID 和时间戳，请参阅[获取快照 ID 和时间戳](#获取快照-id-和时间戳)。

这是 Databend 时间回溯功能的一部分，允许您在保留期内（默认 24 小时）查询、备份和恢复数据的前一个版本。

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

| 参数      | 描述                                                                                                                                                                                                                                                                                                      |
|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SNAPSHOT  | 指定一个特定的快照 ID 以查询之前的数据。                                                                                                                                                                                                                                                    |
| TIMESTAMP | 指定一个特定的时间戳以检索数据。                                                                                                                                                                                                                                                          |
| STREAM    | 指示查询在指定流创建时的数据。                                                                                                                                                                                                                                        |
| OFFSET    | 指定从当前时间回退的秒数。它应为负整数形式，其中绝对值表示时间差异的秒数。例如，`-3600` 表示回退 1 小时（3,600 秒）。 |

## 获取快照 ID 和时间戳

要返回表的所有快照的快照 ID 和时间戳，请使用 [FUSE_SNAPSHOT](../../20-sql-functions/16-system-functions/fuse_snapshot.md) 函数：

```sql
SELECT snapshot_id, 
       timestamp 
FROM   FUSE_SNAPSHOT('<database_name>', '<table_name>'); 
```

## 示例

此示例演示了 AT 子句，允许基于快照 ID、时间戳和流检索之前的数据版本：

1. 创建一个名为 `t` 的表，其中包含单个列 `a`，并向表中插入两行值 1 和 2。

```sql
CREATE TABLE t(a INT);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
```

2. 在表 `t` 上创建一个名为 `s` 的流，并向表中添加一行值 3。

```sql
CREATE STREAM s ON TABLE t;

INSERT INTO t VALUES(3);
```

3. 运行时间回溯查询以检索之前的数据版本。 

```sql
-- 返回表 't' 的快照 ID 和相应的时间戳
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');
┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 296349da841d4fa8820bbf8e228d75f3 │ 2024-04-02 15:25:21.456574 │
│ aaa4857c5935401790db2c9f0f2818be │ 2024-04-02 15:19:02.484304 │
│ e66ad2bc3f21416e87903dc9cd0388a3 │ 2024-04-02 15:18:40.766361 │
└───────────────────────────────────────────────────────────────┘

-- 这些查询使用不同的方法检索相同的数据：
-- 通过 snapshot_id:
SELECT * FROM t AT (SNAPSHOT => 'aaa4857c5935401790db2c9f0f2818be');
-- 通过 timestamp:
SELECT * FROM t AT (TIMESTAMP => '2024-04-02 15:19:02.484304'::TIMESTAMP);
-- 通过 stream:
SELECT * FROM t AT (STREAM => s);

┌─────────────────┐
│        a        │
├─────────────────┤
│               1 │
│               2 │
└─────────────────┘

-- 从表 't' 中检索 60 秒前的所有列数据
SELECT * FROM t AT (OFFSET => -60);
```