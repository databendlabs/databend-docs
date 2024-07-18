---
title: 分析表
sidebar_position: 7
---

在 Databend 中分析表的目的是计算表统计信息，例如列的不同数目。

## 什么是表统计文件？

表统计文件是一个保存表统计数据的 JSON 文件，例如表列的不同值。

Databend 为每个数据库和表创建一个唯一的 ID，用于存储表统计文件，并将它们保存到您的对象存储中的路径 `<bucket_name>/[root]/<db_id>/<table_id>/`。每个表统计文件以 UUID（32字符小写十六进制字符串）命名。

| 文件            | 格式 | 文件名                     | 存储文件夹                                 |
|-----------------|------|----------------------------|--------------------------------------------|
| 表统计          | JSON | `<32bitUUID>_<version>.json` | `<bucket_name>/[root]/<db_id>/<table_id>/_ts/` |

## 语法
```sql
ANALYZE TABLE [ <database_name>. ]table_name
```

- `ANALYZE TABLE <table_name>`

    估计表中每列的不同值数目，并在快照中重新计算列统计信息。

    - 执行后不显示估计结果。要显示估计结果，请使用函数 [FUSE_STATISTIC](../../../20-sql-functions/16-system-functions/fuse_statistic.md)。
    - 该命令不是通过比较它们来识别不同值，而是通过计算存储段和块的数量。这可能导致估计结果和实际值之间有显著差异，例如，多个块持有相同的值。在这种情况下，Databend 建议在运行估计之前尽可能地压缩存储段和块以合并它们。
    - 在执行更新/删除/替换语句后，快照级别的列统计信息可能会被放大。您可以通过执行分析语句来纠正列统计信息。

## 示例

此示例估计表中每列的不同值数目，并使用函数 FUSE_STATISTIC 显示结果：

```sql
create table t(a uint64);

insert into t values (5);
insert into t values (6);
insert into t values (7);

select * from t order by a;

----
5
6
7

-- 在您运行估计与 OPTIMIZE TABLE 之前，FUSE_STATISTIC 不会返回任何结果。
select * from fuse_statistic('db_09_0020', 't');

analyze table `t`;

select * from fuse_statistic('db_09_0020', 't');

----
(0,3);


insert into t values (5);
insert into t values (6);
insert into t values (7);

select * from t order by a;

----
5
5
6
6
7
7

-- FUSE_STATISTIC 返回您上次估计的结果。要获取最新的估计值，请再次运行估计。
-- OPTIMIZE TABLE 不是通过比较它们来识别不同值，而是通过计算存储段和块的数量。
select * from fuse_statistic('db_09_0020', 't');

----
(0,3);

analyze table `t`;

select * from fuse_statistic('db_09_0020', 't');

----
(0,6);

-- 最佳实践：在运行估计之前压缩表。
optimize table t compact;

analyze table `t`;

select * from fuse_statistic('db_09_0020', 't');

----
(0,3);
```