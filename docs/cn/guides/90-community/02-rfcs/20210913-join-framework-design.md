## 背景

Join 是 SQL 中的主要功能之一，同时也是最复杂的部分。

因此，在本节中，我们将简要介绍 Join 的语义类型和 Join 算法。

一般来说，Join 可以根据语义分为以下几类：

- `INNER JOIN`：返回满足 Join 条件的所有元组
- `LEFT OUTER JOIN`：返回满足 Join 条件的所有元组，以及左表中没有满足 Join 条件的行
- `RIGHT OUTER JOIN`：返回满足 Join 条件的所有元组，以及右表中没有满足 Join 条件的行
- `FULL OUTER JOIN`：返回满足 Join 条件的所有元组，以及两个表中没有满足 Join 条件的行
- `CROSS JOIN`：连接表的笛卡尔积

此外，`IN`、`EXISTS`、`NOT IN`、`NOT EXISTS` 表达式可以通过 **semi-join** 和 **anti-join**（称为子查询）来实现。

常见的 Join 算法有三种：

- 嵌套循环 Join
- 哈希 Join
- 排序合并 Join

嵌套循环 Join 是最基本的 Join 算法，可以用以下伪代码描述：

```
// R⋈S
var innerTable = R
var outerTable = S
var result
for s <- outerTable:
    for r <- innerTable:
        if condition(r, s) == true:
            insert(result, combine(r, s))
```

在介绍哈希 Join 之前，我们先在这里介绍 **equi join** 的定义。**equi join** 是 Join 条件为等式的 Join（例如 `r.a == s.a`）。对于 Join 条件不是等式的 Join，我们称之为 **non-equi join**。

哈希 Join 只能处理 equi join。它可以分为两个阶段：**构建阶段** 和 **探测阶段**。

与嵌套循环 Join 的内部表和外部表类似，哈希 Join 会选择一个表作为 **构建侧**，另一个表作为 **探测侧**。

哈希 Join 的伪代码如下：

```
// R⋈S
var build = R
var probe = S
var hashTable
var result
// 构建阶段
for r <- build:
    var key = hash(r, condition)
    insert(hashTable, key, r)

// 探测阶段
for s <- probe:
    var key = hash(s, condition)
    if exists(hashTable, key):
        var r = get(hashTable, key)
        insert(result, combine(r, s))
```

排序合并 Join 会在 Join 表未按 Join 键排序时对其进行排序，然后像归并排序一样进行合并。

一般来说，排序合并 Join 也只能处理 equi-join，但它有一种带状 Join 优化，可以使排序合并 Join 处理某些特定的 non-equi join。由于这有点超出范围，我们在这里不讨论。

## Join 框架

要实现 Join，我们有几部分工作要做：

- 支持将 Join 语句解析为逻辑计划
- 支持为 Join 表绑定列引用
- 支持一些基本的启发式优化（例如外连接消除、子查询消除）和选择实现的 Join 重排序
- 支持一些 Join 算法（目前仅支持本地执行，但设计为分布式执行）

### 解析器与计划器

根据 ANSI-SQL 规范，Join 定义在 `FROM` 子句中。此外，在某些情况下，其他子句中的子查询可以转换为 Join（相关子查询将转换为 semi join 或 anti join）。

在将 SQL 字符串解析为 AST 后，我们将使用 `PlanParser` 从 AST 构建逻辑计划。

以下 bnf 定义是 `FROM` 子句的简化 ANSI-SQL 规范：

```bnf
<from clause> ::= FROM <table reference list>

<table reference list> ::= <table reference> [ { <comma> <table reference> }... ]

<table reference> ::= <table primary or joined table>

<table primary or joined table> ::= <table primary> | <joined table>

<table primary> ::=
		<table or query name> [ [ AS ] <correlation name> [ <left paren> <derived column list> <right paren> ] ]
	|	<derived table> [ AS ] <correlation name> [ <left paren> <derived column list> <right paren> ]
	|	<left paren> <joined table> <right paren>

<joined table> ::=
		<cross join>
	|	<qualified join>
	|	<natural join>

<cross join> ::= <table reference> CROSS JOIN <table primary>

<qualified join> ::= <table reference> [ <join type> ] JOIN <table reference> <join specification>

<natural join> ::= <table reference> NATURAL [ <join type> ] JOIN <table primary>

<join specification> ::= <join condition> | <named columns join>

<join condition> ::= ON <search condition>

<named columns join> ::= USING <left paren> <join column list> <right paren>

<join type> ::= INNER | <outer join type> [ OUTER ]

<outer join type> ::= LEFT | RIGHT | FULL

<join column list> ::= <column name list>
```

`<table reference>` 与 `<comma>` 连接的表是交叉连接的。并且可以在 `WHERE` 子句中找到一些连接条件，即将交叉连接重写为内连接。

有许多查询以这种方式组织，没有明确指定连接条件，例如 TPCH 查询集。

`sqlparser` 库可以将 SQL 字符串解析为 AST。Join 以树结构组织。

以下是几种 Join 树：

- 左深树
- 右深树
- 茂密树

在左深树中，每个 Join 节点的右子节点是一个表，例如：

```sql
SELECT *
FROM a, b, c, d;
/*
      join
     /    \
    join   d
   /    \
  join   c
 /    \
a      b
*/
```

在右深树中，每个 Join 节点的左子节点是一个表，例如：

```sql
SELECT *
FROM a, b, c, d;
/*
  join
 /    \
a   join
   /    \
  b   join
     /    \
    c      d
*/
```

在茂密树中，每个 Join 节点的所有子节点可以是 Join 结果或表，例如：

```sql
SELECT *
FROM a, b, c, d;
/*
    join
   /    \
  join  join
  /  \  /  \
  a  b  c  d
*/
```

大多数 Join 可以表示为左深树，这更容易优化。我们可以在解析阶段将一些 Join 重写为左深树。

以下是 `sqlparser` AST 的示例，注释部分是简化的 AST 调试字符串：

```sql
SELECT *
FROM a, b NATURAL JOIN c, d;
/*
Query {
    with: None,
    body: Select(
        SELECT {
            projection: [Wildcard],
            from: [
                TableWithJoins {
                    relation: Table {
                        name: "a",
                    },
                    joins: []
                },
                TableWithJoins {
                    relation: Table {
                        name: "b",
                    },
                    joins: [
                        Join {
                            relation: Table {
                                name: "c",
                            },
                            join_operator: Inner(Natural)
                        }
                    ]
                },
                TableWithJoins {
                    relation: Table {
                        name: "d",
                    },
                    joins: []
                }
            ],
        }
    ),
}
*/
```

上面的 AST 可以直接表示为茂密树：

```
    join
   /    \
  join   d
 /    \
a     join
     /    \
    b      c
```

这个茂密树等价于以下左深树，因此我们可以在解析阶段重写它：

```
      join
     /    \
    join   d
   /    \
  join   c
 /    \
a      b
```

在将 AST 重写为左深树后，我们将使用目录将 AST 绑定到具体的表和列。在绑定过程中，需要进行语义检查（例如检查列名是否模糊）。

为了实现语义检查并简化绑定过程，我们引入 `Scope` 来表示每个查询块的上下文。它将记录当前上下文中可用列的信息以及它们所属的表。

来自父 `Scope` 的列对所有子 `Scope` 可见。

```rust
struct Scope {
    pub parent: Arc<Scope>,
    pub columns: Vec<ColumnRef>
}
```

以下是一个示例，说明 `Scope` 的工作原理：

```sql
CREATE TABLE t0 (a INT);
CREATE TABLE t1 (b INT);
CREATE TABLE t2 (c INT);

SELECT *
FROM t0, (
    SELECT b, c, c+1 AS d FROM t1, t2
) t;

/*
Scope root: [t0.a, t.b, t.c, t.d]
|  \
|   Scope t0: [a]
|
Scope t: [t1.b, t2.c, d]
|  \
|   Scope t1: [b]
|
Scope t2: [c]
*/
```

由于 Join 后可能存在同名列，我们应该使用唯一的 `ColumnID` 来标识 `ColumnRef`。同时，相关名称保证是唯一的，因此可以使用名称字符串来标识它们。

```rust
struct ColumnRef {
    pub id: ColumnID,
    pub column_name: String,
    pub table_name: String
}
```

通过唯一的 `ColumnID`，我们可以检查查询是否模糊，并同时保持它们的原始名称。

对于计划器，我们将为 `PlanNode` 添加一个变体 `Join` 来表示 Join 操作符：

```rust
enum PlanNode {
    ...
    Join(JoinPlan)
}

enum JoinType {
    Inner,
    LeftOuter,
    RightOuter,
    FullOuter,
    Cross
}

struct JoinPlan {
    pub join_type: JoinType,
    pub join_conditions: Vec<ExpressionPlan>, // Join 条件的合取
    pub left_child: Arc<PlanNode>,
    pub right_child: Arc<PlanNode>
}
```

这里有一个问题，databend-query 使用 `arrow::datatypes::Schema` 来表示数据模式，而 `arrow::datatypes::Schema` 不支持使用 `ColumnID` 来标识列。

我建议在 databend-query 中引入一个内部 `DataSchema` 结构来表示数据模式，它可以存储更多信息，并且可以自然地转换为 `arrow::datatypes::Schema`。

```rust
struct DataSchema {
    pub columns: Vec<Arc<Column>>
}

struct Column {
    pub column_id: ColumnID,
    pub column_name: String,
    pub data_type: DataType,
    pub is_nullable: bool
}
```

### 优化器

有两种优化需要完成：

- 启发式优化
- 基于成本的优化

启发式优化（**RBO**，即基于规则的优化）是可以始终减少查询成本的优化。由于启发式规则太多，我们在这里不讨论。

基于成本的优化使用统计信息来计算查询的成本。通过探索框架（例如 Volcano 优化器、Cascades 优化器），它可以选择最佳执行计划。

优化器是 SQL 引擎中最复杂的部分，我们最好在开始时只支持有限的启发式优化。

> TODO: 列出常见的启发式规则

### 执行

正如我们在 [背景](#背景) 部分讨论的那样，Join 算法可以分为三类：

- 嵌套循环 Join
- 哈希 Join
- 排序合并 Join

此外，还有两种分布式 Join 算法：

- 广播 Join
- 重分区 Join（即 shuffle join）

我们在这里不讨论分布式 Join 算法的细节，但我们仍然需要考虑它们。

不同的 Join 算法在不同场景下有优势。

嵌套循环 Join 在小数据量时有效。通过向量化执行模型，自然可以实现块嵌套循环 Join，这是一种改进的嵌套循环 Join 算法。嵌套循环 Join 的另一个优势是它可以处理 non-equi join 条件。

哈希 Join 在其中一个连接表较小而另一个较大时有效。由于分布式 Join 算法总是会产生小表（通过分区），它非常适合哈希 Join。同时，向量化哈希 Join 算法由 **Marcin Zucowski**（Snowflake 的联合创始人，CWI 的博士）引入。哈希 Join 的缺点是它比其他 Join 算法消耗更多内存，并且它只支持 equi join。

排序合并 Join 在输入已排序时有效，但这很少发生。

上面的比较有偏见，事实上很难说哪种算法更好。我认为，我们可以先实现哈希 Join 和嵌套循环 Join，因为它们更常见。

由于我们目前没有选择 Join 算法的基础设施（计划器、优化器），我建议目前只实现块嵌套循环 Join，以便我们可以构建一个完整的原型。

我们将引入一种向量化的块嵌套循环 Join 算法。

在[背景](#背景)部分已经介绍了朴素嵌套循环连接的伪代码。正如我们所知，嵌套循环连接在每次循环中只会从外部表中获取一行数据，这没有很好的局部性。块嵌套循环连接是一种嵌套循环连接，它会在每次循环中获取一批数据。这里我们介绍朴素的块嵌套循环连接。

```
// R⋈S
var innerTable = R
var outerTable = S
var result

for s <- outerTable.fetchBlock():
    for r <- innerTable.fetchBlock():
        buffer = conditionEvalBlock(s, r)
        for row <- buffer:
            insert(result, row)
```

在向量化执行中，我们可以使用位图来指示某一行是否应该返回给结果集。然后我们可以在稍后物化结果。

例如，假设我们有以下SQL查询：

```SQL
CREATE TABLE t(a INT, b INT);
CREATE TABLE t1(b INT, c INT);
-- 插入一些行
SELECT a, b, c FROM t INNER JOIN t1 ON t.b = t1.b;
```

这个查询的执行计划应该如下所示：

```
Join (t.b = t1.b)
    -> TableScan t
    -> TableScan t1
```

如果我们使用上面介绍的向量化块嵌套循环连接算法，伪代码应该如下所示：

```
var leftChild: BlockStream = scan(t)
var rightChild: BlockStream = scan(t1)
var condition: Expression = equal(column(t.b), column(t1.b))
var result

for l <- leftChild:
    for r <- rightChild:
        buffer = mergeBlock(l, r)
        var bitMap: Array[boolean] = condition.eval(buffer)
        buffer.insertColumn(bitMap)
        result.insertBlock(buffer)

materialize(result)
```

在databend-query中，我们可以添加一个`NestedLoopJoinTransform`来实现向量化块嵌套循环连接。