---
title: EXPLAIN
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.953"/>

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

<a id="and-filter-estimates"></a>

## AND 过滤估算

从 v1.2.953 开始，`filter_and_strategy` 控制优化器如何组合 `AND` 过滤条件的选择率估算。选择率是预计通过某个谓词的输入行比例。

| 值 | 组合规则 |
|-------|------------------|
| `independent`（默认） | 对引用列集合互不相交的谓词，将估算值相乘。先对通过共享列连接的谓词分组，每组取最小估算值。 |
| `min` | 使用单个谓词估算值中的最小值。这是传统组合规则。 |

共享列分组也包括间接连接。一个同时引用 `a` 和 `b` 的谓词会连接引用 `a` 和引用 `b` 的谓词。它们构成一个组，而不是两个独立因子。同一列上的谓词（例如范围的两个边界）不会作为独立因子相乘。

例如，假设不同列上的两个谓词的估算值为 `0.2` 和 `0.3`。使用 `independent` 时组合值为 `0.06`，使用 `min` 时为 `0.2`。这些数字只演示组合规则，不是某条查询的输出。其他统计信息和约束也会影响最终估算。

使用 [SETTINGS 子句](../20-query-syntax/settings.md) 对单条语句比较两种策略。请将下例中的表和列替换为自己的表和列：

```sql
SETTINGS (filter_and_strategy = 'independent')
EXPLAIN SELECT * FROM events WHERE region = 'us' AND device = 'mobile';

SETTINGS (filter_and_strategy = 'min')
EXPLAIN SELECT * FROM events WHERE region = 'us' AND device = 'mobile';
```

此设置会改变估算，可能改变所选计划。它不会改变 `AND` 的含义，也不会设定实际输出行数。`min` 仅恢复组合规则，不恢复所有历史优化器行为或计划。两种策略都不能保证对每个工作负载产生更准确的估算或更快的执行。

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