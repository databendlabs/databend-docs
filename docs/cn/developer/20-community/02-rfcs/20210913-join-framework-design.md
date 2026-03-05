title: Join 框架设计

Join 是 SQL 中的主要功能之一。同时，它也是最复杂的部分。

因此，在本节中，我们将简要介绍 join 语义的类型和 join 算法。

通常，join 可以按语义分为以下类型：

- `INNER JOIN`：返回所有满足 join 条件的元组
- `LEFT OUTER JOIN`：返回所有满足 join 条件的元组，以及左表中没有右表行满足 join 条件的行
- `RIGHT OUTER JOIN`：返回所有满足 join 条件的元组，以及右表中没有左表行满足 join 条件的行
- `FULL OUTER JOIN`：返回所有满足 join 条件的元组，以及一个表中没有其他表行满足 join 条件的行
- `CROSS JOIN`：连接表的笛卡尔积

此外，`IN`、`EXISTS`、`NOT IN`、`NOT EXISTS` 表达式可以通过 **semi-join** 和 **anti-join**（称为子查询）来实现。

有三种常见的 join 算法：

- 嵌套循环 join
- 哈希 join
- 排序合并 join

嵌套循环 join 是基本的 join 算法，可以描述为以下伪代码：

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

在介绍哈希 join 之前，我们先介绍一下 **equi join** 的定义。**equi join** 是指 join 条件是一个等式（例如 `r.a == s.a`）的 join。对于 join 条件不是等式的 join，我们称之为 **non-equi join**。

哈希 join 只能与 equi join 一起使用。它可以描述为两个阶段：**构建阶段** 和 **探测阶段**。

与嵌套循环 join 的内表和外表一样，哈希 join 将选择一个表作为 **构建端**，另一个表作为 **探测端**。

哈希 join 的伪代码：
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

如果排序合并 join 的连接表没有按连接键排序，则会对它们进行排序，然后像合并排序一样合并它们。

通常，排序合并 join 也只能与 equi-join 一起使用，但存在一种带状 join 优化，可以使排序合并 join 与某些特定的 non-equi join 一起使用。由于这有点超出范围，我们在此不做讨论。

## Join 框架

要实现 join，我们需要完成以下几个部分的工作：

- 支持将 join 语句解析为逻辑计划
- 支持绑定连接表的列引用
- 支持一些基本的启发式优化（例如，外连接消除、子查询消除）和选择实现的 join 重新排序
- 支持一些 join 算法（目前是本地执行，但设计用于分布式执行）

### Parser & Planner

根据 ANSI-SQL 规范，join 在 `FROM` 子句中定义。此外，在某些情况下，其他子句中的子查询可以转换为 join（相关子查询将转换为 semi join 或 anti join）。

将 SQL 字符串解析为 AST 后，我们将使用 `PlanParser` 从 AST 构建逻辑计划。

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

用 `<comma>` 连接的 `<table reference>` 是交叉连接的。并且可以在 `WHERE` 子句中找到一些连词作为它们的 join 条件，这就是将交叉连接重写为内连接。

有许多以这种方式组织的查询没有明确指定 join 条件，例如 TPCH 查询集。

`sqlparser` 库可以将 SQL 字符串解析为 AST。Join 被组织成树状结构。

有以下几种 join 树：

- 左深树
- 右深树
- 稠密树

在左深树中，每个 join 节点的右子节点都是一个表，例如：
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

在右深树中，每个 join 节点的左子节点都是一个表，例如：
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

在稠密树中，每个 join 节点的所有子节点可以是 join 的结果或表，例如：
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

大多数 join 可以表示为左深树，这更容易优化。我们可以在解析阶段将一些 join 重写为左深树。

这是一个 `sqlparser` AST 的示例，注释部分是简化的 AST 调试字符串：
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

上面的 AST 可以直接表示为稠密树：
```
    join
   /    \
  join   d
 /    \
a     join
     /    \
    b      c
```

这个稠密树等价于下面的左深树，所以我们可以在解析阶段重写它：
```
      join
     /    \
    join   d
   /    \
  join   c
 /    \
a      b
```

将 AST 重写为左深树后，我们将使用 catalog 将 AST 绑定到具体的表和列。在绑定期间，语义检查是必要的（例如，检查列名是否不明确）。

为了实现语义检查并简化绑定过程，我们引入 `Scope` 来表示每个查询块的上下文。它将记录当前上下文中可用列的信息以及它们所属的表。

来自父 `Scope` 的列对它的所有子 `Scope` 可见。

```rust
struct Scope {
    pub parent: Arc<Scope>,
    pub columns: Vec<ColumnRef>
}
```

这是一个解释 `Scope` 如何工作的示例：
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

由于在 join 之后可能存在具有相同名称的不同列，因此我们应该使用唯一的 `ColumnID` 标识 `ColumnRef`。同时，相关名称被确认为唯一的，因此可以使用名称字符串来标识它们。

```rust
struct ColumnRef {
    pub id: ColumnID,
    pub column_name: String,
    pub table_name: String
}
```

使用唯一的 `ColumnID`，我们可以检查查询是否不明确，并同时保留它们的原始名称。

对于 planner，我们将为 `PlanNode` 添加一个变体 `Join` 来表示 join 运算符：

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
    pub join_conditions: Vec<ExpressionPlan>, // 连接条件的合取
    pub left_child: Arc<PlanNode>,
    pub right_child: Arc<PlanNode>
}
```

这里有一个问题，databend-query 使用 `arrow::datatypes::Schema` 来表示数据模式，而 `arrow::datatypes::Schema` 本身不支持使用 `ColumnID` 标识列。

我建议引入一个内部 `DataSchema` 结构来表示 databend-query 中的数据模式，它可以存储更多信息，并且可以自然地转换为 `arrow::datatypes::Schema`。

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

### Optimizer

需要完成两种优化：

- 启发式优化
- 基于成本的优化

启发式优化（**RBO**，也称为基于规则的优化）是可以始终降低查询成本的优化。由于启发式规则太多，我们在此不做讨论。

基于成本的优化使用统计信息来计算查询的成本。通过探索框架（例如 Volcano optimizer、Cascades optimizer），它可以选择最佳执行计划。

Optimizer 是 SQL 引擎中最复杂的部分，我们最好在一开始只支持有限的启发式优化。

> TODO: 列出常见的启发式规则

### Execution

正如我们在 [背景](#Background) 部分讨论的那样，join 算法可以分为三种：

- 嵌套循环 join
- 哈希 join
- 排序合并 join

此外，还有两种分布式 join 算法：

- 广播 join
- 重分区 join（也称为 shuffle join）

我们在此不讨论分布式 join 算法的细节，但我们仍然需要考虑它们。

不同的 join 算法在不同的场景下具有优势。

如果数据量相对较小，则嵌套循环 join 有效。使用向量化执行模型，自然可以实现块嵌套循环 join，这是一种改进的嵌套循环 join 算法。嵌套循环 join 的另一个优点是它可以与 non-equi join 条件一起使用。

如果连接的表之一较小而另一个较大，则哈希 join 有效。由于分布式 join 算法总是会产生小表（通过分区），因此它非常适合哈希 join。同时，**Marcin Zucowski**（Snowflake 的联合创始人，CWI 的博士）介绍了向量化哈希 join 算法。哈希 join 的缺点是哈希 join 比其他 join 算法消耗更多的内存，并且它仅支持 equi join。

如果输入已排序，则排序合并 join 有效，但这很少发生。

上面的比较有很大的偏差，实际上很难说哪种算法更好。我认为，我们可以先实现哈希 join 和嵌套循环 join，因为它们更常见。

由于我们目前没有用于选择 join 算法的基础设施（planner、optimizer），因此我建议目前只实现块嵌套循环 join，以便我们可以构建一个完整的原型。

我们将介绍一种向量化块嵌套循环 join 算法。


在 [背景](#Background) 部分已经介绍了朴素的嵌套循环连接的伪代码。我们知道，嵌套循环连接在每次循环中只从外层表中获取一行数据，这不具有良好的局部性。块嵌套循环连接是一种嵌套循环连接，它在每次循环中获取一个数据块。这里我们介绍朴素的块嵌套循环连接。

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

在向量化执行中，我们可以使用一个位图来指示是否应该将一行返回到结果集中。然后我们可以稍后物化结果。

例如，假设我们有以下 SQL 查询：

```SQL
CREATE TABLE t(a INT, b INT);
CREATE TABLE t1(b INT, c INT);
-- insert some rows
SELECT a, b, c FROM t INNER JOIN t1 ON t.b = t1.b;
```

此查询的执行计划应如下所示：

```
Join (t.b = t1.b)
    -> TableScan t
    -> TableScan t1
```

如果我们使用上面介绍的向量化块嵌套循环连接算法，则伪代码应如下所示：

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

在 databend-query 中，我们可以添加一个 `NestedLoopJoinTransform` 来实现向量化块嵌套循环连接。