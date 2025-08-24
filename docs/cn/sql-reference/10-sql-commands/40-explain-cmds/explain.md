---
title: EXPLAIN
---

显示 SQL 语句的执行计划。执行计划以树状结构展示，由不同的算子（Operator）组成，从中可以看到 Databend 将如何执行该 SQL 语句。一个算子（Operator）通常包含一个或多个字段，用于描述 Databend 将执行的操作或与查询相关的对象。

例如，以下 EXPLAIN 命令返回的执行计划包含一个名为 *TableScan* 的算子（Operator），该算子（Operator）包含多个字段。

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

如果你正在使用 Databend Cloud，可以利用查询分析（Query Profile）功能来可视化 SQL 语句的执行计划。

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