---
title: 查询分析（Query Profile）
---

查询分析（Query Profile）是指特定 SQL 语句执行方式的图形化表示或可视化分解。它本质上是 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令的图形化版本，可以深入了解查询的执行计划和性能细节。

## 访问查询分析（Query Profile）

查询分析（Query Profile）可以直接在 Databend Cloud 中访问。要查看查询的查询分析（Query Profile），请前往 **监控（Monitor）** > **SQL 历史（SQL History）**。从历史记录列表中选择一个 SQL 语句，然后单击 **查询分析（Query Profile）** 选项卡。如果您使用的是自托管的 Databend，可以使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令作为替代方案。

## 查询分析（Query Profile）包含什么

以下是一个查询分析（Query Profile）的示例，由三个层级结构的算子节点（Operator Node）组成。执行 SQL 语句时，Databend Cloud 会按自下而上的顺序处理这些节点。查询分析（Query Profile）中包含的算子节点（Operator Node）的数量和类型取决于 SQL 语句的具体内容。有关常见的算子及其统计字段，请参见[常见算子和字段](#common-operators--fields)。

![alt text](/img/cloud/query-profile-1.png)

*请注意，每个节点标题中括号内的数字代表节点 ID，并*不*表示执行步骤。*

查询分析（Query Profile）附带一组提供更多详细信息的信息窗格。上面的示例包括两个信息窗格：

| 窗格                 | 描述                                                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 开销最大的节点       | 列出执行时间最长的节点。                                                                                                                                                                       |
| 分析概览             | 显示 CPU 和 I/O 耗时的百分比。请注意，如果选择一个节点，此信息窗格将显示特定于所选节点的信息，而不是整个查询的信息。                                                                           |

如果单击 `TableScan [4]` 节点，您会注意到右侧新增了两个信息窗格：

![alt text](/img/cloud/query-profile-2.png)

| 窗格       | 描述                                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| 统计信息   | 包括扫描进度、扫描字节数、从缓存中扫描的百分比、扫描的分区数等信息。                                         |
| 属性       | 显示特定于节点的详细信息。显示的字段根据节点的功能而有所不同。                                             |

## 常见算子和字段

解释计划（Explained Plan）包括各种算子，具体取决于您希望 Databend EXPLAIN 的 SQL 语句。以下是常见算子及其字段的列表：

* **TableScan**: 从表中读取数据。
    - table: 表的全名。例如，`catalog1.database1.table1`。
    - read rows: 要读取的行数。
    - read bytes: 要读取的数据字节数。
    - partition total: 表的总分区数。
    - partition scanned: 要读取的分区数。
    - push downs: 要下推到存储层进行处理的筛选器和限制。
* **Filter**: 筛选读取的数据。
    - filters: 用于筛选数据的谓词表达式。表达式求值为 false 的数据将被筛选掉。
* **EvalScalar**: 计算标量表达式。例如，`SELECT a+1 AS b FROM t` 中的 `a+1`。
    - expressions: 要计算的标量表达式。
* **AggregatePartial** & **AggregateFinal**: 按键进行聚合，并返回聚合函数的结果。
    - group by: 用于聚合的键。
    - aggregate functions: 用于聚合的函数。
* **Sort**: 按键对数据进行排序。
    - sort keys: 用于排序的表达式。
* **Limit**: 限制返回的行数。
    - limit: 要返回的行数。
    - offset: 在返回任何行之前要跳过的行数。
* **HashJoin**: 使用哈希连接（Hash Join）算法对两个表执行连接操作。哈希连接（Hash Join）算法会选择其中一个表作为构建端来构建哈希表。然后，它将使用另一个表作为探测端，从哈希表中读取匹配的数据以形成结果。
    - join type: JOIN 类型（INNER、LEFT OUTER、RIGHT OUTER、FULL OUTER、CROSS、SINGLE 或 MARK）。
    - build keys: 构建端用于构建哈希表的表达式。
    - probe keys: 探测端用于从哈希表中读取数据的表达式。
    - filters: 非等值 JOIN 条件，例如 `t.a > t1.a`。
* **Exchange**: 在 Databend 查询节点之间交换数据，以进行分布式并行计算。
    - exchange type: 数据重分区类型（Hash、Broadcast 或 Merge）。