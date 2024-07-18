---
title: ANALYZE TABLE
sidebar_position: 7
---

The objective of analyzing a table in Databend is to calculate table statistics, such as a distinct number of columns.

## What is Table Statistic File?

A table statistic file is a JSON file that saves table statistic data, such as distinct values of table column.

Databend creates a unique ID for each database and table for storing the table statistic file and saves them to your object storage in the path `<bucket_name>/[root]/<db_id>/<table_id>/`. Each table statistic file is named with a UUID (32-character lowercase hexadecimal string).

| File            | Format | Filename                     | Storage Folder                                 |
|-----------------|--------|------------------------------|------------------------------------------------|
| Table Statistic | JSON   | `<32bitUUID>_<version>.json` | `<bucket_name>/[root]/<db_id>/<table_id>/_ts/` |

## Syntax
```sql
ANALYZE TABLE [ <database_name>. ]table_name
```

- `ANALYZE TABLE <table_name>`

    Estimates the number of distinct values of each column in a table, and recalculate the column statistics in snapshot.

    - It does not display the estimated results after execution. To show the estimated results, use the function [FUSE_STATISTIC](../../../20-sql-functions/16-system-functions/fuse_statistic.md).
    - The command does not identify distinct values by comparing them but by counting the number of storage segments and blocks. This might lead to a significant difference between the estimated results and the actual value, for example, multiple blocks holding the same value. In this case, Databend recommends compacting the storage segments and blocks to merge them as much as possible before you run the estimation.
    - The column statistics at the snapshot level may be amplified after execute update/delete/replace statements. You can correct the column statistics by performing analyze statement.

## Examples

This example estimates the number of distinct values for each column in a table and shows the results with the function [FUSE_STATISTIC](/sql/sql-functions/system-functions/fuse_statistic):

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

-- FUSE_STATISTIC will not return any results until you run an estimation with ANALYZE TABLE.
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

-- FUSE_STATISTIC returns results of your last estimation. To get the most recent estimated values, run the estimation again.
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