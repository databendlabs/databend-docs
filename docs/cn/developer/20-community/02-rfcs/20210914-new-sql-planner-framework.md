---
title: 新 SQL Planner 框架设计
description: 新的 SQL planner 框架设计 RFC
---

- 开始日期: 2021/09/13
- 追踪 issue: https://github.com/databendlabs/databend/issues/1217

# 概要

为了支持更复杂的 SQL 查询，例如包含 `JOIN` 和相关子查询的查询，我们需要重新设计 SQL planner 组件。

本 RFC 将讨论当前实现的主要问题如下：

- 不支持 `JOIN` 和相关子查询
- 不具备进行严格语义检查的能力，例如类型检查和名称解析，这给 SQL 优化和执行过程中的正确性保证带来了不必要的复杂性
- 没有通用的 SQL 优化框架

让我们从一个简单的例子开始。

在 SQL 中，允许元组中存在重复的字段名称。在 PostgreSQL 中，一个结果集可以包含具有相同名称的不同列：

```
postgres=# create table t(a INT);
CREATE TABLE
postgres=# insert into t values(1),(2);
INSERT 0 2
postgres=# SELECT * from t t1 cross join t t2;
 a | a
---+---
 1 | 1
 1 | 2
 2 | 1
 2 | 2
(4 rows)
```

我们可以看到有两个名为 `a` 的字段，其中一个来自派生表 `t1`，另一个来自派生表 `t2`。

如果您尝试引用具有重复名称 `a` 的列，它将返回一个错误：

```
postgres=# SELECT a from t t1, t t2;
ERROR:  column reference "a" is ambiguous
LINE 1: SELECT a from t t1, t t t2;
```

但是您可以使用规范名称（如 `t.a`）引用该列，因为表名在查询上下文中必须是唯一的。

目前，`databend` 使用 `DataSchema` 来表示输入和输出关系模式，这无法提供足够的信息来处理上面显示的情况。在 `DataSchema` 中，每一列都用 `DataField` 表示，它具有以下定义：

```rust
pub struct DataField {
    name: String,
    data_type: DataType,
    nullable: bool,
}
```

`DataSchema` 中的每个 `DataField` 都用唯一的 `name` 字符串标识。目前，`name` 仅表示列名，因此很难使用此抽象来实现 `JOIN`。我们将在后面的章节中讨论这个问题的详细解决方案。

第二个问题是关于语义检查。

以类型检查为例，表达式中的每个变量（例如，列引用、常量值）都有自己的数据类型。每个标量表达式都对其参数的数据类型有要求，例如，`+` 表达式要求其参数是数字。

为了确保查询的有效性和正确性，我们需要在执行查询之前进行类型检查。

由于优化器和执行器都对类型检查有要求，因此最好用一个单独的组件来解决这个问题，这样可以使其更易于维护。

最后一个问题是关于查询优化框架。

许多现代优化器都是以 Volcano/Cascades 风格实现的，这是一种高度模块化的方法。

一个典型的 Cascades 优化器由独立的模块组成：

- 转换规则
- 实现规则
- 探索引擎
- 成本模型

有趣的是，规则系统（转换和实现）与探索引擎和成本模型是解耦的，这意味着可以很容易地构建一个没有 CBO（基于成本的优化）的启发式优化器。一旦我们要实现 CBO，规则系统就可以被重用。

实际上，这是一种实用的方法。在一些工业 Cascades 实现中（例如，SQL Server 和 CockroachDB），总是存在一个启发式优化阶段，例如 SQL Server 中的 `pre-exploration` 和 CockroachDB 中的 `normalization`，它们通常与探索引擎共享一个相同的规则系统。

总而言之，本 RFC 将：

- 引入一个新的框架来支持规划 `JOIN` 和相关子查询
- 引入一个规则系统，允许开发人员轻松编写转换规则

# 设计细节

## 架构

在当前的实现中，一个 SQL 查询将按如下方式处理：

1. `PlanParser` 将 SQL 文本解析为 AST（抽象语法树）
2. `PlanParser` 还会从 AST 构建一个用 `PlanNode` 表示的规范计划树
3. 构建计划树后，`Optimizer` 将对计划进行一些规范优化，并生成最终的 `PlanNode`
4. `Interpreter` 将 `PlanNode` 作为输入，并将其解释为一个由 `Processor` 组成的、可执行的 `Pipeline`
5. Executor 将使用特定的运行时执行 `Pipeline`

在我们的新框架中，`PlanParser` 将被重构为两个组件：

- `Parser`: 将 SQL 文本解析为统一的 AST 表示，这已经在 [这个 PR](https://github.com/databendlabs/databend/pull/1478) 中引入
- `Binder`: 将 AST 中出现的变量与数据库中的对象（例如，表、列等）绑定，并执行语义检查（名称解析、类型检查）。将生成计划树的逻辑表示

此外，将引入一个新的优化器，其中包含一个 `rule system` 来替换当前的优化器。

## Binder

由于 SQL 查询中可能存在许多语法上下文，我们需要一种方法来跟踪它们之间的依赖关系以及 `name` 在不同上下文中的可见性。

这里我们提出了抽象 `Metadata`，它存储了查询优化所需的所有元数据，包括来自 catalog 的基本表、派生表（子查询和 join）和列。每个表和列都将被分配一个唯一的标识符。

```rust
pub struct Metadata {
    pub tables: Vec<TableEntry>,
}

pub struct TableEntry {
    pub index: IndexType, // `Metadata` 中表的索引
    pub columns: Vec<ColumnEntry>,
    // 以及关于表的元数据，例如名称、数据库名称等。
}

pub struct ColumnEntry {
    pub index: ColumnIndex,
    // 以及关于列的元数据，例如名称、数据类型等。
}

pub type IndexType = usize;

pub struct ColumnIndex {
    pub table_index: IndexType, // 此列所属的表的索引
    pub column_index: IndexType, // 列在其 `TableEntry` 中的索引
}
```

因此，在名称解析之后，每个变量都将与一个唯一的 `ColumnIndex` 绑定，而不是一个字符串，因此我们不必担心像重复名称这样的问题。

在绑定过程中，我们需要跟踪绑定的状态。该状态可能包含以下信息：

- 当前上下文中可见的列，用于处理通配符结果集（`SELECT * FROM t`）
- 上下文中的列是否为 group by 键
- 列是否为派生列（即，像 `a+1 AS a` 这样的投影）
- 变量是否来自当前子查询，用于标识相关的列引用

为了维护状态，我们提出了一个数据结构 `BindContext`（这个名字受到了 CMU Peloton 的 `BinderContext` 的启发，在我看来这是一个非常合适的名字）。

`BindContext` 是一个类似堆栈的结构，堆栈中的每个 `BindContext` 节点记录了相应语法上下文的状态。SQL 绑定是一个自下而上的过程，这意味着它将递归地处理 AST，并将数据源（例如，表扫描、join、子查询）生成的列添加到

简而言之，`BindContext` 是一组列引用。为了清楚起见，我们将使用图表来解释这种机制是如何工作的。

以下面的例子为例：

```sql
create table t (a int);

SELECT * from t -- table: context 1 [t.a]
cross join t t1 -- table: context 2 [t1.a]
-- join: context 3 [t.a, t1.a]
where t.a = 1
```

根据 SQL 的语义，我们可以将绑定过程描述如下：

1. 为表 `t` 创建一个空的 `BindContext` 上下文 1，并用来自 `t` 的列填充它
2. 为表 `t` 创建一个空的 `BindContext` 上下文 2，用来自 `t` 的列填充它，并将表重命名为 `t1`
3. 为 `t cross join t1` 创建一个空的 `BindContext` 上下文 3，并用来自 `t` 和 `t1` 的列填充它
4. 对谓词 `t.a = 1` 执行名称解析
5. 查找上下文 3，并找到变量 `t.a` 对应的 `ColumnEntry`

让我们看看 `BindContext` 是如何处理相关子查询的。

相关子查询表明子查询依赖于来自外部上下文的列。

有一个规范的 `Apply` 运算符来执行相关子查询，它将为每个元组评估子查询表达式（如交叉连接）。虽然大多数相关子查询可以被去相关到 join 中（例如，semi-join、anti-semi-join 等）。

以下面的查询为例：

```sql
create table t (a int);

SELECT * from t -- table: context 1 [t.a]
where exists (
    SELECT * from t t1 -- table: context 2 with parent 1 [t1.a]
    where t1.a = t.a -- t.a 是一个相关列，因为它来自出现在外部查询中的 t
);
```

在绑定 `exists` 子查询之前，我们将为其创建一个新的 `BindContext`，并将外部 `BindContext` 作为其父上下文传递。

当我们在子查询中绑定相关列引用 `t.a` 时，我们将首先查找当前的 `BindContext`，看看是否存在合适的列，如果不存在，那么我们将继续尝试在父上下文中进行查找，直到我们找到相应的列或我们耗尽了所有的父上下文。

如果我们在父上下文中找到了该列，那么我们可以确认该子查询是一个相关子查询，并且与父上下文绑定的列引用是相关列。

该过程可以总结如下：

1. 为表 `t` 创建一个空的 `BindContext` 上下文 1，并用来自 `t` 的列填充它
2. 为表 `t` 创建一个空的 `BindContext` 上下文 2，并将上下文 1 作为其父上下文，用来自 `t` 的列填充它，并将表重命名为 `t1`
3. 对谓词 `t1.a = t.a` 执行名称解析
4. 查找上下文 2，并找到变量 `t1.a` 对应的 `ColumnEntry`，但找不到 `t.a`。因此，我们将继续执行步骤 5
5. 查找上下文 2 的父上下文（上下文 1），并找到变量 `t.a` 对应的 `ColumnEntry`。由于该变量是在外部上下文中找到的，因此它将被标记为相关列引用，并且该子查询将被标记为相关的

## Optimizer

### Cascades 优化器简介

SQL 优化是基于关系代数的等价性。有许多不同的定理和引理可以帮助我们识别两个关系代数树是否在逻辑上等价。通过一组等价的关系表达式，我们可以使用成本模型对它们进行评估，并找到最优的表达式。

Cascades 优化器是由 Goetz Graefe 在他的 [论文](https://www.cse.iitb.ac.in/infolab/Data/Courses/CS632/Papers/Cascades-graefe.pdf) 中介绍的一种查询优化框架。

在 Cascades 查询优化器中，一个 SQL 查询将被翻译成一个树状结构 `Expression`，其中关系运算符（`Operator`）作为其节点。

有三种 `Operator`：

- 逻辑运算符：表示一个关系代数，例如 `Select`、`Get`、`Inner Join`
- 物理运算符：表示一个带有实现的关系代数，例如 `Hash Join`
- 标量运算符：表示一个标量表达式，例如 `Select` 运算符中的谓词表达式（`AND`、`OR`、`+`）

转换规则用于对 `Expression` 执行代数转换。

每个转换规则都有关于它可以应用于的关系运算符的描述，我们称之为 `rule pattern`。优化器将提供一个方案来遍历一个 `Expression`，检查是否有任何规则可以应用于一个子 `Expression`，然后对匹配的规则应用转换。

`Expression` 的备选项是在转换过程中生成的。例如：

```sql
SELECT * FROM t INNER JOIN t1 ON t.a = t1.a;
```

使用 `JoinCommutativity` 规则，上面的 SQL 可以被转换成一个等价的 SQL：

```sql
SELECT * FROM t1 INNER JOIN t ON t.a = t1.a;
```

为了减少由转换产生的重复 `Expression`，Cascades 使用一种自上而下的方法来枚举备选项。

引入了一个结构 `Memo` 来存储备选项。每个 `Memo` 由 `Group` 组成，每个 `Group` 是一组等价的 `Expression`。

与我们上面提到的 `Expression` 不同，`Group` 内部的 `Expression` 将 `Group` 作为其子节点，而不是 `Expression`，因此等价的 `Expression` 可以共享子候选节点。

以 `JoinCommutativity` 示例为例，原始 SQL 的 `Memo` 可以表示为：

```
Group 1: [Get(t)]

Group 2: [Get(t1)]

Group 3: [Join(1, 2, "t.a = t1.a")]
```

在应用 `JoinCommutativity` 转换后，`Memo` 将变为：

```
Group 1: [Get(t)]

Group 2: [Get(t1)]

Group 3: [Join(1, 2, "t.a = t1.a"), Join(2, 1, "t.a = t1.a")]
```

现在您已经掌握了关于 Cascades 优化器框架的基本知识。虽然 Cascades 还有许多其他重要的概念，但这个简短的介绍足以让您理解本 RFC。

### Databend 的新优化器

在新的优化器框架中，有几个核心结构。

`Plan`，逻辑运算符和物理运算符的枚举。与规范的 Cascades 不同，我们不将标量运算符作为 `Plan` 的一部分。

```rust
enum Plan {
    // ...
}
```

`SExpr`，single expression 的缩写，表示一个 `Plan` 树。

```rust
struct SExpr {
    pub plan: Plan,
    pub children: Vec<Plan>,
}
```

`Memo`，`Group` 的集合，与 Cascades 中的 `Memo` 相同。

```rust
struct Memo {
    pub groups: Vec<Group>,
}
```

`Group`，`MExpr` 的集合，与 Cascades 中的 `Group` 相同。

```rust
struct Group {
    pub expressions: Vec<MExpr>,
}
```

`MExpr`，`Memo` 内部 `Expression` 的表示。

```rust
struct MExpr {
    pub plan: Plan,
    pub children: Vec<GroupIndex>,
}
```

`Rule`，转换规则的 trait。`Rule` 可以分为探索规则（生成等价的逻辑表达式）和实现规则（生成物理表达式）。

```rust
trait Rule {
    fn pattern(&self) -> &SExpr;

    fn apply(&self, expr: &SExpr, state: &mut TransformState) -> Result<()>;
}
```

`HeuristicOptimizer`，优化器将转换应用于 `SExpr`，但不生成备选项。

`CascadesOptimizer`，优化器将转换应用于 `SExpr`，生成 `Memo`，并最终从 `Memo` 中提取最优的 `SExpr`。

让我们看看将一个 SQL 查询翻译成 `Processor` 的整个过程：

1. SQL 查询文本被解析成 AST
2. `Binder` 使用 `Catalog` 将 AST 翻译成规范的逻辑 `SExpr`
3. `HeuristicOptimizer` 优化规范的逻辑 `SExpr`
4. `CascadesOptimizer` 接收 `HeuristicOptimizer` 的输出，构建一个 `Memo`，应用规则，并返回最优的 `SExpr`
5. `Executor` 接收由 `CascadesOptimizer` 生成的物理 `SExpr`，并构建一个可执行的 `Processor`

# 里程碑

在此重构之后，我们希望：


- 为 `JOIN` 提供朴素实现（等值连接使用哈希连接，交叉连接使用嵌套循环连接），包括计划和执行
- 支持使用 `databend` 运行 TPCH 基准测试中的大多数查询（包含不同类型的连接和相关子查询）
- 实现几个简单的优化规则，例如外连接消除、去相关、谓词下推等。
- 迁移到新的 planner 框架

同时，我们不会：

- 重视性能，相关工作应在下一阶段完成
- 实现基于成本的优化，这项工作取决于统计系统的设计
