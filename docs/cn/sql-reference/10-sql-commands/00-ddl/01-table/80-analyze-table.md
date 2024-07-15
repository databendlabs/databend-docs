---
title: ANALYZE TABLE
sidebar_position: 7
---

在 Databend 中分析表的目的是计算表的统计信息，例如列的不同值数量。

## 什么是表统计文件？

表统计文件是一个 JSON 文件，用于保存表的统计数据，例如表列的不同值。

Databend 为每个数据库和表创建一个唯一 ID，用于存储表统计文件，并将它们保存到对象存储的路径 `<bucket_name>/[root]/<db_id>/<table_id>/` 中。每个表统计文件以 UUID（32 位小写十六进制字符串）命名。

| 文件            | 格式 | 文件名                     | 存储文件夹                                 |
|-----------------|--------|------------------------------|------------------------------------------------|
| 表统计          | JSON   | `<32bitUUID>_<version>.json` | `<bucket_name>/[root]/<db_id>/<table_id>/_ts/` |

## 语法
```sql
ANALYZE TABLE [ <database_name>. ]table_name
```

- `ANALYZE TABLE <table_name>`

    估计表中每个列的不同值数量，并重新计算快照中的列统计信息。

    - 执行后不会显示估计结果。要显示估计结果，请使用函数 [FUSE_STATISTIC](../../../20-sql-functions/16-system-functions/fuse_statistic.md)。
    - 该命令不通过比较值来识别不同值，而是通过计算存储段和块的数量来实现。这可能导致估计结果与实际值之间存在显著差异，例如，多个块持有相同值。在这种情况下，Databend 建议在运行估计之前尽可能合并存储段和块。
    - 执行更新/删除/替换语句后，快照级别的列统计信息可能会放大。您可以通过执行分析语句来纠正列统计信息。

## 示例

此示例估计表中每个列的不同值数量，并使用函数 [FUSE_STATISTIC](/sql/sql-functions/system-functions/fuse_statistic) 显示结果：

```sql
create table t(a uint64);

insert into t values (1);
insert into t values (2);
insert into t values (3);

select * from t order by a;

┌──────────────────┐
│         a        │
├──────────────────┤
│                1 │
│                2 │
│                3 │
└──────────────────┘

-- 在运行 ANALYZE TABLE 进行估计之前，FUSE_STATISTIC 不会返回任何结果。
select * from fuse_statistic('default', 't');

analyze table `t`;

select * from fuse_statistic('default', 't');

┌──────────────────────────────┐
│ column_name │ distinct_count │
├─────────────┼────────────────┤
│ a           │              3 │
└──────────────────────────────┘

insert into t values (3);
insert into t values (4);
insert into t values (5);

select * from t order by a;

┌──────────────────┐
│         a        │
├──────────────────┤
│                1 │
│                2 │
│                3 │
│                3 │
│                4 │
│                5 │
└──────────────────┘

-- FUSE_STATISTIC 返回上次估计的结果。要获取最新的估计值，请再次运行估计。
select * from fuse_statistic('default', 't');

┌──────────────────────────────┐
│ column_name │ distinct_count │
├─────────────┼────────────────┤
│ a           │              3 │
└──────────────────────────────┘

analyze table `t`;

select * from fuse_statistic('default', 't');

┌──────────────────────────────┐
│ column_name │ distinct_count │
├─────────────┼────────────────┤
│ a           │              5 │
└──────────────────────────────┘
```