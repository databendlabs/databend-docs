---
title: 查询 Profile
---

查询 profile 指的是特定 SQL 语句执行方式的图形化表示或可视化分解。它本质上是 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令的图形化版本，提供了对查询执行计划和性能细节的深入了解。

## 访问查询 Profile

查询 profile 可以在 Databend Cloud 中直接访问。要查看查询的查询 profile，请转到 **Monitor** > **SQL History**。从历史记录列表中选择一个 SQL 语句，然后单击 **Query Profile** 选项卡。如果您使用的是私有化部署的 Databend，则可以使用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令作为替代方法。

## 查询 Profile 包含的内容

以下是一个查询 profile 的示例，它包含一个由三个运算符节点组成的层级结构。执行 SQL 语句时，Databend Cloud 按照自下而上的顺序处理节点。查询 profile 包含的运算符节点的数量和类型取决于您的 SQL 语句的具体情况。有关常见运算符及其统计字段，请参见 [常见运算符 & 字段](#common-operators--fields)。

![alt text](/img/cloud/query-profile-1.png)

*请注意，每个节点标题中的括号内的数字表示节点 ID，*不*表示执行步骤。*

查询 profile 附带一组信息窗格，可提供更多详细信息。上面的示例包括两个信息窗格：

| 窗格                 | 描述                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Most Expensive Nodes | 列出执行时间最长的节点。                                                                                                                                                      |
| Profile Overview     | 显示花费在 CPU 和 I/O 上的时间百分比。请注意，如果您选择一个节点，则此信息窗格会显示特定于您选择的节点的信息，而不是整个查询的信息。 |

如果单击 `TableScan [4]` 节点，您会注意到右侧添加了两个附加的信息窗格：

![alt text](/img/cloud/query-profile-2.png)

| 窗格       | 描述                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Statistics | 包括扫描进度、扫描的字节数、从缓存扫描的百分比、扫描的分区等信息。 |
| Attributes | 显示特定于节点的详细信息。显示的字段因节点的功能而异。               |

## 常见运算符 & 字段

解释计划包括各种运算符，具体取决于您希望 Databend EXPLAIN 的 SQL 语句。以下是常见运算符及其字段的列表：

* **TableScan**: 从表中读取数据。
    - table: 表的完整名称。例如，`catalog1.database1.table1`。
    - read rows: 要读取的行数。
    - read bytes: 要读取的数据的字节数。
    - partition total: 表的分区总数。
    - partition scanned: 要读取的分区数。
    - push downs: 要下推到存储层进行处理的过滤器和限制。
* **Filter**: 过滤读取的数据。
    - filters: 用于过滤数据的谓词表达式。表达式评估返回 false 的数据将被过滤掉。
* **EvalScalar**: 评估标量表达式。例如，`SELECT a+1 AS b FROM t` 中的 `a+1`。
    - expressions: 要评估的标量表达式。
* **AggregatePartial** & **AggregateFinal**: 按键聚合并返回聚合函数的结果。
    - group by: 用于聚合的键。
    - aggregate functions: 用于聚合的函数。
* **Sort**: 按键对数据进行排序。
    - sort keys: 用于排序的表达式。
* **Limit**: 限制返回的行数。
    - limit: 要返回的行数。
    - offset: 在返回任何行之前要跳过的行数。
* **HashJoin**: 使用 Hash Join 算法对两个表执行 Join 操作。Hash Join 算法将选择两个表中的一个作为构建端来构建 Hash 表。然后，它将使用另一个表作为探测端来从 Hash 表中读取匹配的数据以形成结果。
    - join type: JOIN 类型（INNER、LEFT OUTER、RIGHT OUTER、FULL OUTER、CROSS、SINGLE 或 MARK）。
    - build keys: 构建端用于构建 Hash 表的表达式。
    - probe keys: 探测端用于从 Hash 表中读取数据的表达式。
    - filters: 非等效 JOIN 条件，例如 `t.a > t1.a`。
* **Exchange**: 在 Databend 查询节点之间交换数据，以进行分布式并行计算。
    - exchange type: 数据重新分区类型（Hash、Broadcast 或 Merge）。