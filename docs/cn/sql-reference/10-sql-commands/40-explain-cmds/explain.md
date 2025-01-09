---
title: EXPLAIN
---

显示 SQL 语句的执行计划。执行计划以由不同操作符组成的树形结构展示，您可以看到 Databend 将如何执行 SQL 语句。一个操作符通常包含一个或多个字段，描述 Databend 将执行的操作或与查询相关的对象。

例如，以下由 EXPLAIN 命令返回的执行计划包含一个名为 *TableScan* 的操作符及其多个字段。有关常见操作符和字段的列表，请参阅 [常见操作符 & 字段](/guides/query/query-profile#common-operators--fields)。

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

如果您使用的是 Databend Cloud，可以利用 Query Profile 功能可视化 SQL 语句的执行计划。更多信息，请参阅 [Query Profile](/guides/query/query-profile)。

## 语法

```sql
EXPLAIN <statement>
```

## 示例

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