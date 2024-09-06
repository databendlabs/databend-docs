---
title: Join 框架
description: Join 框架 RFC
---

## 背景

Join 是 SQL 中的一个主要特性，同时也是最复杂的部分之一。

因此，在本节中，我们将简要介绍 join 语义和 join 算法的类型。

通常，根据语义，join 可以分为以下几种类型：

- `INNER JOIN`：返回所有满足 join 条件的元组
- `LEFT OUTER JOIN`：返回所有满足 join 条件的元组以及左表中没有与右表中任何行满足 join 条件的行
- `RIGHT OUTER JOIN`：返回所有满足 join 条件的元组以及右表中没有与左表中任何行满足 join 条件的行
- `FULL OUTER JOIN`：返回所有满足 join 条件的元组以及表中没有与另一表中任何行满足 join 条件的行
- `CROSS JOIN`：连接表的笛卡尔积

此外，`IN`、`EXISTS`、`NOT IN`、`NOT EXISTS` 表达式可以通过 **半连接** 和 **反连接**（即子查询）实现。

常见的 join 算法有三种：

- 嵌套循环连接
- 哈希连接
- 排序合并连接

嵌套循环连接是基本的 join 算法，可以用以下伪代码描述：

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

在介绍哈希连接之前，我们在这里介绍 **等值连接** 的定义。**等值连接** 是其 join 条件为等式的连接（例如 `r.a == s.a`）。对于 join 条件不是等式的连接，我们称之为 **非等值连接**

哈希连接只能用于等值连接。它可以描述为两个 Stage：**构建 Stage** 和 **探测 Stage**。

与嵌套循环连接的内表和外表一样，哈希连接会选择一个表作为 **构建侧**，另一个表作为 **探测侧**。

哈希连接的伪代码：

```
// R⋈S
var build = R
var probe = S
var hashTable
var result
// Build phase
for r <- build:
    var key = hash(r, condition)
    insert(hashTable, key, r)

// Probe phase
for s <- probe:
    var key = hash(s, condition)
    if exists(hashTable, key):
        var r = get(hashTable, key)
        insert(result, combine(r, s))
```

排序合并连接会对 join 键未排序的连接表进行排序，然后像合并排序那样合并它们。

通常，排序合并连接也只能用于等值连接，但它存在一个带区间连接优化，可以使排序合并连接适用于某些特定的非等值连接。我们在这里不讨论这个，因为它有点超出范围。

## Join 框架

为了实现 join，我们需要完成几个部分的工作：

- 支持将 join 语句解析为逻辑计划
- 支持为连接表绑定列引用
- 支持一些基本的启发式优化（例如，外连接消除、子查询消除）和选择实现的 join 重排序
- 支持一些 join 算法（目前为本地执行，但设计为分布式执行）

### 解析器 & 规划器

根据 ANSI-SQL 规范，joins 在 `FROM` 子句中定义。此外，其他子句中的子查询在某些情况下可以翻译为 join（相关子查询将翻译为半连接或反连接）。

在将 SQL 字符串解析为 AST 之后，我们将使用 `PlanParser` 从 AST 构建逻辑计划。

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

用 `<comma>` 连接的 `<table reference>` 是交叉连接。在 `WHERE` 子句中可能找到一些作为它们 join 条件的连词，即将交叉连接重写为内连接。

许多以这种方式组织的查询并没有明确指定 join 条件，例如 TPCH 查询集。

`sqlparser` 库可以将 SQL 字符串解析为 AST。Joins 被组织为树结构。

有以下几种 join 树：

- 左深树
- 右深树
- 灌木树

在左深树中，每个 join 节点的右子节点是一个表，例如：

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

在右深树中，每个 join 节点的左子节点是一个表，例如：

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

在灌木树中，每个 join 节点的所有子节点可以是 join 的结果或表，例如：

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

大多数 join 可以表示为左深树，这更容易优化。我们可以在解析 Stage 将一些 joins 重写为左深树。

这是一个`sqlparser` AST 的示例，注释部分是简化的 AST 调试字符串：

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

上述 AST 可以直接表示为一个灌木状树：

```
    join
   /    \
  join   d
 /    \
a     join
     /    \
    b      c
```

这个灌木状树等价于下面的左深树，因此我们可以在解析 Stage 重写它：

```
      join
     /    \
    join   d
   /    \
  join   c
 /    \
a      b
```

在将 AST 重写为左深树后，我们将使用目录将 AST 绑定到具体的表和列上。在绑定过程中，需要进行语义检查（例如，检查列名是否模糊不清）。

为了实现语义检查并简化绑定过程，我们引入`Scope`来表示每个查询块的上下文。它将记录当前上下文中可用列的信息以及它们所属的表。

来自父`Scope`的列对其所有子`Scope`都是可见的。

```rust
struct Scope {
    pub parent: Arc<Scope>,
    pub columns: Vec<ColumnRef>
}
```

这里有一个例子来解释`Scope`是如何工作的：

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

由于连接后可能存在同名的不同列，我们应该用唯一的`ColumnID`来标识`ColumnRef`。同时，由于关联名称保证是唯一的，用名称字符串来标识它们是可以的。

```rust
struct ColumnRef {
    pub id: ColumnID,
    pub column_name: String,
    pub table_name: String
}
```

有了唯一的`ColumnID`，我们可以检查查询是否模糊不清，并同时保留它们的原始名称。

对于规划器，我们将为`PlanNode`添加一个变体`Join`来表示连接操作符：

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
    pub join_conditions: Vec<ExpressionPlan>, // 连接条件的联结
    pub left_child: Arc<PlanNode>,
    pub right_child: Arc<PlanNode>
}
```

这里有一个问题，databend-query 使用`arrow::datatypes::Schema`来表示数据模式，而`arrow::datatypes::Schema`原生不支持用`ColumnID`标识列。

我建议引入一个内部的`DataSchema`结构来在 databend-query 中表示数据模式，它可以存储更多信息，并且可以自然地转换为`arrow::datatypes::Schema`。

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

启发式优化（**RBO**，即基于规则的优化），是一种总能降低查询成本的优化。由于启发式规则太多，我们在这里不讨论。

基于成本的优化使用统计信息来计算查询的成本。通过探索框架（例如 Volcano 优化器，Cascades 优化器），它可以选择最佳执行计划。

优化器是 SQL 引擎中最复杂的部分，我们最好一开始只支持有限的启发式优化。

> 待办：列出常见的启发式规则

### 执行

正如我们在[背景](#Background)部分讨论的，连接算法可以分为三种：

- 嵌套循环连接
- 哈希连接
- 排序合并连接

此外，还有两种分布式连接算法：

- 广播连接
- 重分区连接（又称为洗牌连接）

我们在这里不讨论分布式连接算法的细节，但我们仍然需要考虑它们。

不同的连接算法在不同的场景下有优势。

嵌套循环连接在数据量相对较小的情况下有效。通过向量化执行模型，自然可以实现块嵌套循环连接，这是一种改进的嵌套循环连接算法。嵌套循环连接的另一个优势是它可以处理非等值连接条件。

哈希连接在一个表很小而另一个表很大的情况下非常有效。由于分布式连接算法总是会产生小表（通过分区），所以它非常适合哈希连接。同时，**Marcin Zucowski**（Snowflake 的联合创始人，CWI 的博士）引入了向量化哈希连接算法。哈希连接的缺点是它会消耗比其他连接算法更多的内存，并且它只支持等值连接。

如果输入已排序，排序-合并连接是有效的，尽管这种情况很少发生。

上述比较有很大的偏见，实际上很难说哪种算法更好。在我看来，我们可以首先实现哈希连接和嵌套循环连接，因为它们更常见。

由于我们目前没有选择连接算法的基础设施（规划器，优化器），我建议目前只实现块嵌套循环连接，这样我们可以构建一个完整的原型。

我们将介绍一个向量化的块嵌套循环连接算法。

[背景](#Background)部分介绍了简单嵌套循环连接的伪代码。众所周知，嵌套循环连接在每次循环中只从外表中获取一行数据，这并不具有良好的局部性。块嵌套循环连接是一种嵌套循环连接，它在每次循环中会获取一块数据。这里我们介绍简单的块嵌套循环连接。

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

在向量化执行中，我们可以使用位图来指示是否应该将一行返回到结果集中。然后我们可以稍后实现结果的具体化。

例如，假设我们有以下 SQL 查询：

```SQL
CREATE TABLE t(a INT, b INT);
CREATE TABLE t1(b INT, c INT);
-- insert some rows
SELECT a, b, c FROM t INNER JOIN t1 ON t.b = t1.b;
```

这个查询的执行计划应该看起来像这样：

```
Join (t.b = t1.b)
    -> TableScan t
    -> TableScan t1
```

如果我们使用上面介绍的向量化块嵌套循环连接算法，伪代码应该看起来像这样：

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

在 databend-query 中，我们可以添加一个`NestedLoopJoinTransform`来实现向量化块嵌套循环连接。
