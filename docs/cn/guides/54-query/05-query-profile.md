---
title: 查询分析（Query Profile）
---

查询分析（Query Profile）指特定 SQL 语句执行过程的图形化表示或可视化分解。它本质上是 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令的图形化版本，帮助理解查询的执行计划和性能细节。

## 访问查询分析（Query Profile）

在 Databend Cloud 中可直接访问查询分析（Query Profile）。查看查询分析时，请进入 **Monitor** > **SQL History**，从历史记录列表选择 SQL 语句后点击 **Query Profile** 选项卡。若使用自托管 Databend，可用 [EXPLAIN](/sql/sql-commands/explain-cmds/explain) 命令替代。

## 查询分析（Query Profile）内容

下图展示的查询分析示例包含三个分层排列的操作符节点。执行 SQL 语句时，Databend Cloud 按从底至顶的顺序处理节点。查询分析包含的节点数量和类型取决于 SQL 语句的具体内容。常见操作符及其统计字段请参阅[常见操作符和字段](#common-operators--fields)。

![alt text](/img/cloud/query-profile-1.png)

*注意：节点标题中括号内的数字表示节点 ID，*不*代表执行步骤。*

查询分析包含多个信息面板以提供详细信息。上例包含两个面板：

| 面板                 | 描述                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| Most Expensive Nodes | 列出执行时间最长的节点                                                                               |
| Profile Overview     | 显示 CPU 和 I/O 操作的时间占比。注意：选择单个节点时，此面板仅显示该节点信息而非整个查询 |

点击 `TableScan [4]` 节点后，右侧将新增两个信息面板：

![alt text](/img/cloud/query-profile-2.png)

| 面板       | 描述                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Statistics | 包含扫描进度、扫描字节数、缓存扫描比例、扫描分区数等信息             |
| Attributes | 显示节点特定信息，字段内容随节点功能变化                             |

## 常见操作符和字段

执行计划包含的操作符类型取决于需 EXPLAIN 的 SQL 语句。以下是常见操作符及其字段：

* **TableScan**：读取表数据
    - table：表全名（如 `catalog1.database1.table1`）
    - read rows：待读取行数
    - read bytes：待读取数据字节数
    - partition total：表总分区数
    - partition scanned：待扫描分区数
    - push downs：下推至存储层处理的过滤器和限制条件
* **Filter**：过滤数据
    - filters：谓词表达式，表达式计算结果为 false 的数据将被过滤
* **EvalScalar**：计算标量表达式（如 `SELECT a+1 AS b FROM t` 中的 `a+1`）
    - expressions：待计算的标量表达式
* **AggregatePartial** & **AggregateFinal**：按键聚合并返回函数结果
    - group by：聚合键
    - aggregate functions：聚合函数
* **Sort**：按键排序数据
    - sort keys：排序表达式
* **Limit**：限制返回行数
    - limit：返回行数
    - offset：返回前跳过的行数
* **HashJoin**：使用哈希连接算法执行表连接。该算法选择一个表作为构建端建立哈希表，另一表作为探测端从哈希表读取匹配数据
    - join type：连接类型（INNER/LEFT OUTER/RIGHT OUTER/FULL OUTER/CROSS/SINGLE/MARK）
    - build keys：构建端创建哈希表的表达式
    - probe keys：探测端读取哈希表的表达式
    - filters：非等值连接条件（如 `t.a > t1.a`）
* **Exchange**：在 Databend 查询节点间交换数据以实现分布式并行计算
    - exchange type：数据重分区类型（Hash/Broadcast/Merge）