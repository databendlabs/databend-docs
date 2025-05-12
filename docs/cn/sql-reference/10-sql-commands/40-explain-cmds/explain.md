---
title: EXPLAIN
---

显示 SQL 语句的执行计划。执行计划显示为一棵由不同算子组成的树，您可以在其中看到 Databend 将如何执行 SQL 语句。一个算子通常包含一个或多个字段，描述 Databend 将执行的操作或与查询相关的对象。

例如，以下由 EXPLAIN 命令返回的执行计划包括一个名为 *TableScan* 的算子，其中包含多个字段。有关常见算子和字段的列表，请参见 [常见算子和字段](/guides/query/query-profile#common-operators--fields)。

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

如果您正在使用 Databend Cloud，则可以利用查询画像功能来可视化 SQL 语句的执行计划。有关更多信息，请参见 [查询画像](/guides/query/query-profile)。

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