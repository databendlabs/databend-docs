---
title: EXPLAIN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

Shows the execution plan of a SQL statement. An execution plan is shown as a tree consisting of different operators where you can see how Databend will execute the SQL statement. An operator usually includes one or more fields describing the actions Databend will perform or the objects related to the query.

For example, the following execution plan returned by the EXPLAIN command includes an operator named *TableScan* with several fields.

```sql
EXPLAIN SELECT * FROM allemployees;

---
TableScan
├── table: default.default.allemployees
├── read rows: 5
├── read bytes: 592
├── partitions total: 5
├── partitions scanned: 5
└── push downs: [filters: [], limit: NONE]
```

If you are using Databend Cloud, you can utilize the Query Profile feature to visualize the execution plan of your SQL statements.

## Syntax

```sql
EXPLAIN <statement>
```

## AND Filter Estimates

Since v1.2.953, `filter_and_strategy` controls how the optimizer combines selectivity estimates for `AND` filters. Selectivity is the estimated fraction of input rows that pass a predicate.

| Value | Combination rule |
|-------|------------------|
| `independent` (default) | Multiply estimates for predicates on disjoint column sets. Group predicates connected by shared columns first, and use the smallest estimate within each group. |
| `min` | Use the smallest single predicate estimate. This is the historical combination rule. |

Shared-column groups include indirect connections. A predicate that references both `a` and `b` connects predicates on `a` and on `b`. They form one group, not two independent factors. Predicates on the same column, such as two bounds of a range, are not multiplied as independent factors.

For illustration, suppose two predicates on distinct columns have estimates `0.2` and `0.3`. Their combination is `0.06` with `independent` and `0.2` with `min`. These numbers illustrate the combination rule, not the output of a particular query. Other statistics and constraints also affect final estimates.

Use the [SETTINGS clause](../20-query-syntax/settings.md) to compare the strategies for one statement. Replace the sample table and columns below with your own:

```sql
SETTINGS (filter_and_strategy = 'independent')
EXPLAIN SELECT * FROM events WHERE region = 'us' AND device = 'mobile';

SETTINGS (filter_and_strategy = 'min')
EXPLAIN SELECT * FROM events WHERE region = 'us' AND device = 'mobile';
```

The setting changes estimates and can change the chosen plan. It does not change the meaning of `AND` or set the actual output row count. `min` restores only the combination rule, not every historical optimizer behavior or plan. Neither strategy guarantees more accurate estimates or faster execution for every workload.

## Examples

```sql
EXPLAIN select t.number from numbers(1) as t, numbers(1) as t1 where t.number = t1.number;
----
Project
├── columns: [number (#0)]
└── HashJoin
    ├── join type: INNER
    ├── build keys: [numbers.number (#1)]
    ├── probe keys: [numbers.number (#0)]
    ├── filters: []
    ├── TableScan(Build)
    │   ├── table: default.system.numbers
    │   ├── read rows: 1
    │   ├── read bytes: 8
    │   ├── partitions total: 1
    │   ├── partitions scanned: 1
    │   └── push downs: [filters: [], limit: NONE]
    └── TableScan(Probe)
        ├── table: default.system.numbers
        ├── read rows: 1
        ├── read bytes: 8
        ├── partitions total: 1
        ├── partitions scanned: 1
        └── push downs: [filters: [], limit: NONE]
```