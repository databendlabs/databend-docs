---
title: AT 子句
---

SELECT 语句可以包含一个 AT 子句，允许您通过特定的快照 ID 或时间戳查询数据的历史版本。

Databend 在数据更新发生时自动创建快照，因此可以将快照视为过去某一时间点数据的视图。您可以通过快照 ID 或创建快照的时间戳来访问快照。关于如何获取快照 ID 和时间戳，请参见[获取快照 ID 和时间戳](#obtaining-snapshot-id-and-timestamp)。

这是 Databend 的时间回溯功能的一部分，允许您在保留期内（默认为 24 小时）查询、备份和从数据的以前版本恢复。

## 语法

```sql
SELECT ...
FROM ...
AT ( { SNAPSHOT => <snapshot_id> | TIMESTAMP => <timestamp> } );
```

## 获取快照 ID 和时间戳 {#obtaining-snapshot-id-and-timestamp}

要返回表的所有快照的快照 ID 和时间戳，请执行以下语句：

```sql
SELECT snapshot_id,
       timestamp
FROM   fuse_snapshot('<database_name>', '<table_name>');
```

有关 FUSE_SNAPSHOT 函数的更多信息，请参见[FUSE_SNAPSHOT](../../20-sql-functions/16-system-functions/fuse_snapshot.md)。

## 示例

### 使用快照 ID 查询

```sql
-- 返回快照 ID
select snapshot_id,timestamp from fuse_snapshot('default', 'ontime2');
+----------------------------------+----------------------------+
| snapshot_id                      | timestamp                  |
+----------------------------------+----------------------------+
| 16729481923640f9864c1c8ddd0861e3 | 2022-06-28 09:09:40.190662 |
+----------------------------------+----------------------------+

-- 使用快照 ID 查询
select * from ontime2 at (snapshot=>'16729481923640f9864c1c8ddd0861e3');
```

### 使用时间戳查询

```sql
-- 创建表
create table demo(c varchar);

-- 插入两行
insert into demo values('batch1.1'),('batch1.2');

-- 插入另一行
insert into demo values('batch2.1');

-- 返回时间戳
select timestamp from fuse_snapshot('default', 'demo');
+----------------------------+
| timestamp                  |
+----------------------------+
| 2022-06-22 08:58:54.509008 |
| 2022-06-22 08:58:36.254458 |
+----------------------------+

-- 回到最后一行插入的时间
select * from demo at (TIMESTAMP => '2022-06-22 08:58:54.509008'::TIMESTAMP);
+----------+
| c        |
+----------+
| batch1.1 |
| batch1.2 |
| batch2.1 |
+----------+

-- 回到前两行插入的时间
select * from demo at (TIMESTAMP => '2022-06-22 08:58:36.254458'::TIMESTAMP);
+----------+
| c        |
+----------+
| batch1.1 |
| batch1.2 |
+----------+
```
