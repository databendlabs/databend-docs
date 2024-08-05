---
title: ANALYZE TABLE
sidebar_position: 7
---

Computes various statistics for a table. This command does *not* display the results after execution. To show the results, use the function [FUSE_STATISTIC](../../../20-sql-functions/16-system-functions/fuse_statistic.md).

Databend saves the statistic data of each table as a JSON file named with a UUID (32-character lowercase hexadecimal string) and stores these files in your object storage at the path `<bucket_name>/[root]/<db_id>/<table_id>/`.

## Syntax

```sql
ANALYZE TABLE [ <database_name>. ]<table_name>
```

- The command does not identify distinct values by comparing them but by counting the number of storage segments and blocks. This might lead to a significant difference between the estimated results and the actual value, for example, multiple blocks holding the same value. In this case, Databend recommends compacting the storage segments and blocks to merge them as much as possible before you run the estimation.
- The column statistics at the snapshot level may be amplified after execute update/delete/replace statements. You can correct the column statistics by performing analyze statement.

## Examples

This example estimates the number of distinct values for each column in a table and shows the results with the function [FUSE_STATISTIC](/sql/sql-functions/system-functions/fuse_statistic):

```sql
CREATE TABLE sample (
    user_id INT,
    name VARCHAR(50),
    age INT
);

INSERT INTO sample (user_id, name, age) VALUES
(1, 'Alice', 30),
(2, 'Bob', 25),
(3, 'Charlie', 35),
(4, 'Diana', 28),
(5, 'Eve', 28);

SET enable_analyze_histogram = 1;

-- FUSE_STATISTIC will not return any results until you run an estimation with ANALYZE TABLE.
SELECT * FROM FUSE_STATISTIC('default', 'sample');

ANALYZE TABLE sample;

SELECT * FROM FUSE_STATISTIC('default', 'sample');

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ column_name │ distinct_count │                                                                                                                                                               histogram                                                                                                                                                              │
├─────────────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ age         │              4 │ [bucket id: 0, min: "25", max: "25", ndv: 1.0, count: 1.0], [bucket id: 1, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 2, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 3, min: "30", max: "30", ndv: 1.0, count: 1.0], [bucket id: 4, min: "35", max: "35", ndv: 1.0, count: 1.0]                           │
│ user_id     │              5 │ [bucket id: 0, min: "1", max: "1", ndv: 1.0, count: 1.0], [bucket id: 1, min: "2", max: "2", ndv: 1.0, count: 1.0], [bucket id: 2, min: "3", max: "3", ndv: 1.0, count: 1.0], [bucket id: 3, min: "4", max: "4", ndv: 1.0, count: 1.0], [bucket id: 4, min: "5", max: "5", ndv: 1.0, count: 1.0]                                     │
│ name        │              5 │ [bucket id: 0, min: "Alice", max: "Alice", ndv: 1.0, count: 1.0], [bucket id: 1, min: "Bob", max: "Bob", ndv: 1.0, count: 1.0], [bucket id: 2, min: "Charlie", max: "Charlie", ndv: 1.0, count: 1.0], [bucket id: 3, min: "Diana", max: "Diana", ndv: 1.0, count: 1.0], [bucket id: 4, min: "Eve", max: "Eve", ndv: 1.0, count: 1.0] │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

INSERT INTO sample (user_id, name, age) VALUES
(6, 'Frank', 40);

-- FUSE_STATISTIC returns results of your last estimation. To get the most recent estimated values, run ANALYZE TABLE again.
SELECT * FROM FUSE_STATISTIC('default', 'sample');

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ column_name │ distinct_count │                                                                                                                                                               histogram                                                                                                                                                              │
├─────────────┼────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ age         │              4 │ [bucket id: 0, min: "25", max: "25", ndv: 1.0, count: 1.0], [bucket id: 1, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 2, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 3, min: "30", max: "30", ndv: 1.0, count: 1.0], [bucket id: 4, min: "35", max: "35", ndv: 1.0, count: 1.0]                           │
│ user_id     │              5 │ [bucket id: 0, min: "1", max: "1", ndv: 1.0, count: 1.0], [bucket id: 1, min: "2", max: "2", ndv: 1.0, count: 1.0], [bucket id: 2, min: "3", max: "3", ndv: 1.0, count: 1.0], [bucket id: 3, min: "4", max: "4", ndv: 1.0, count: 1.0], [bucket id: 4, min: "5", max: "5", ndv: 1.0, count: 1.0]                                     │
│ name        │              5 │ [bucket id: 0, min: "Alice", max: "Alice", ndv: 1.0, count: 1.0], [bucket id: 1, min: "Bob", max: "Bob", ndv: 1.0, count: 1.0], [bucket id: 2, min: "Charlie", max: "Charlie", ndv: 1.0, count: 1.0], [bucket id: 3, min: "Diana", max: "Diana", ndv: 1.0, count: 1.0], [bucket id: 4, min: "Eve", max: "Eve", ndv: 1.0, count: 1.0] │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

ANALYZE TABLE sample;

SELECT * FROM FUSE_STATISTIC('default', 'sample');

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ column_name │ distinct_count │                                                                                                                                                                                                histogram                                                                                                                                                                                               │
├─────────────┼────────────────┼────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name        │              6 │ [bucket id: 0, min: "Alice", max: "Alice", ndv: 1.0, count: 1.0], [bucket id: 1, min: "Bob", max: "Bob", ndv: 1.0, count: 1.0], [bucket id: 2, min: "Charlie", max: "Charlie", ndv: 1.0, count: 1.0], [bucket id: 3, min: "Diana", max: "Diana", ndv: 1.0, count: 1.0], [bucket id: 4, min: "Eve", max: "Eve", ndv: 1.0, count: 1.0], [bucket id: 5, min: "Frank", max: "Frank", ndv: 1.0, count: 1.0] │
│ age         │              5 │ [bucket id: 0, min: "25", max: "25", ndv: 1.0, count: 1.0], [bucket id: 1, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 2, min: "28", max: "28", ndv: 1.0, count: 1.0], [bucket id: 3, min: "30", max: "30", ndv: 1.0, count: 1.0], [bucket id: 4, min: "35", max: "35", ndv: 1.0, count: 1.0], [bucket id: 5, min: "40", max: "40", ndv: 1.0, count: 1.0]                                 │
│ user_id     │              6 │ [bucket id: 0, min: "1", max: "1", ndv: 1.0, count: 1.0], [bucket id: 1, min: "2", max: "2", ndv: 1.0, count: 1.0], [bucket id: 2, min: "3", max: "3", ndv: 1.0, count: 1.0], [bucket id: 3, min: "4", max: "4", ndv: 1.0, count: 1.0], [bucket id: 4, min: "5", max: "5", ndv: 1.0, count: 1.0], [bucket id: 5, min: "6", max: "6", ndv: 1.0, count: 1.0]                                             │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```