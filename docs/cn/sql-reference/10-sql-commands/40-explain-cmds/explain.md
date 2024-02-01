---
title: EXPLAIN
---

显示 SQL 语句的执行计划。执行计划以树形结构展示，包含不同的操作符，你可以看到 Databend 将如何执行 SQL 语句。一个操作符通常包括一个或多个字段，描述 Databend 将执行的动作或与查询相关的对象。

例如，以下由 EXPLAIN 命令返回的执行计划包括一个名为 *TableScan* 的操作符和几个字段。有关常见操作符和字段的列表，请参见[常见操作符和字段](#common-operators-and-fields)。

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

## 语法

```sql
EXPLAIN <statement>
```

## 常见操作符和字段

解释计划可能包括多种操作符，这取决于你希望 Databend 解释的 SQL 语句。以下是常见操作符及其字段的列表：

* **TableScan**：从表中读取数据。
    - table: 表的完整名称。例如，`catalog1.database1.table1`。
    - read rows: 要读取的行数。
    - read bytes: 要读取的数据字节数。
    - partition total: 表的分区总数。
    - partition scanned: 要读取的分区数。
    - push downs: 要推送到存储层进行处理的过滤器和限制。
* **Filter**：过滤读取的数据。
    - filters: 用于过滤数据的谓词表达式。对于表达式评估返回 false 的数据将被过滤掉。
* **EvalScalar**：评估标量表达式。例如，在 `SELECT a+1 AS b FROM t` 中的 `a+1`。
    - expressions: 要评估的标量表达式。
* **AggregatePartial** & **AggregateFinal**：按键聚合并返回聚合函数的结果。
    - group by: 用于聚合的键。
    - aggregate functions: 用于聚合的函数。
* **Sort**：按键对数据进行排序。
    - sort keys: 用于排序的表达式。
* **Limit**：限制返回的行数。
    - limit: 要返回的行数。
    - offset: 在返回任何行之前要跳过的行数。
* **HashJoin**：使用 Hash Join 算法对两个表执行 Join 操作。Hash Join 算法将选择两个表中的一个作为构建侧来构建 Hash 表。然后，它将使用另一个表作为探测侧，从 Hash 表中读取匹配的数据以形成结果。
    - join type: JOIN 类型（INNER, LEFT OUTER, RIGHT OUTER, FULL OUTER, CROSS, SINGLE, 或 MARK）。
    - build keys: 构建侧用于构建 Hash 表的表达式。
    - probe keys: 探测侧用于从 Hash 表中读取数据的表达式。
    - filters: 非等值 JOIN 条件，如 `t.a > t1.a`。
* **Exchange**：在 Databend 查询节点之间交换数据，用于分布式并行计算。
    - exchange type: 数据重新分配类型（Hash, Broadcast, 或 Merge）。

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