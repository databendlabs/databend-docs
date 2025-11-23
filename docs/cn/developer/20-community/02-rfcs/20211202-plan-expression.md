---
title: 表达式与 Plan Builder
description: Expression and plan builder RFC
---

## Summary

逻辑计划和表达式在 SQL 查询的整个生命周期中起着重要作用。
本文档旨在解释表达式和计划构建器的新设计。

## Expression

### Alias Expression

别名在 SQL 中很有用，我们可以将复杂的表达式别名为简短的别名。例如：
`SELECT a + 3 as b`。

在标准 SQL 协议中，别名可以工作在：

- Group By，例如：`SELECT a + 3 as b, count(1) from table group by b`
- Having，例如：`SELECT a + 3 as b, count(1) as c from table group by b having c > 0`
- Order By：例如：`SELECT a + 3 as b from table order by b`

:::tip
ClickHouse 扩展了表达式别名的用法，它可以工作在：

- 递归别名表达式：例如：`SELECT a + 1 as b, b + 1 as c`

- 过滤器：例如：`SELECT a + 1 as b, b + 1 as c  from table where c > 0`

注意：目前我们不支持 clickhouse 风格的别名表达式。它可以在以后实现。
:::

对于表达式别名，我们只在最后，在 projection 阶段处理它。但是我们必须尽早替换表达式的别名，以防止以后出现歧义。

例如：

`SELECT number + 1 as c, sum(number) from numbers(10) group by c having c > 3 order by c limit 10`

- 首先，我们可以从 projection AST 中扫描所有别名表达式。`c ---> (number + 1)`
- 然后，我们将别名替换为 _having_、_order by_、_group by_ 子句中的相应表达式。所以查询将是：`SELECT number + 1 as c, sum(number) from numbers(10) group by (number + 1) having (number + 1) > 3 order by (number + 1) limit 10`
- 最后，当查询完成时，我们应用 projection 将列 `(number+1)` 重命名为 `c`

让我们看一下这个查询的 explain 结果：

```
| Limit: 10
  Projection: (number + 1) as c:UInt64, sum(number):UInt64
    Sort: (number + 1):UInt64
      Having: ((number + 1) > 3)
        AggregatorFinal: groupBy=[[(number + 1)]], aggr=[[sum(number)]]
          RedistributeStage[state: AggregatorMerge, id: 0]
            AggregatorPartial: groupBy=[[(number + 1)]], aggr=[[sum(number)]]
              Expression: (number + 1):UInt64, number:UInt64 (Before GroupBy)
                ReadDataSource: scan partitions: [4], scan schema: [number:UInt64], statistics: [read_rows: 10, read_bytes: 80]
```

我们可以看到，在 projection 之前，我们不需要关心别名，因此应用其他表达式会非常方便。

### Materialized Expression

物化表达式处理是指，如果相同的表达式已经在上游处理过，我们可以将表达式重新定位为 _ExpressionColumn_。

例如：

`SELECT number + 1 as c, sum(number) as d group by c having number + 1 > 3 order by  d desc`

在别名替换之后，我们将知道 order by 是 `sum(number)`，但是 `sum(number)` 已经在聚合阶段处理过了，所以我们可以将 order by 表达式 `SortExpression { ... }` 重新定位到 `Column("sum(number)")`，这可以消除相同表达式的无用计算。

所以 having 中的 `number + 1` 也可以应用于重新定位表达式。

### Expression Functions

表达式函数有很多种。

- ScalarFunctions，一对一的计算过程，结果行与输入行相同。例如：`SELECT database()`
- AggregateFunctions，多对一的计算过程，例如：`SELECT sum(number)`
- BinaryFunctions，一种特殊的 ·ScalarFunctions· 例如：`SELECT 1 + 2 `
- ...

对于 ScalarFunctions，我们真的不关心整个 block，我们只关心参数涉及的列。`sum(number)` 只关心名为 _number_ 的列。结果也是一列，所以我们在 `IFunction` 中有虚拟方法：

```rust
fn eval(&self, columns: &[DataColumn], _input_rows: usize) -> Result<DataColumn>;
```

对于 AggregateFunctions，我们应该将状态保存在相应的函数实例中，以应用两级合并，我们在 `IAggregateFunction` 中有以下虚拟方法：

```rust
fn accumulate(&mut self, columns: &[DataColumn], _input_rows: usize) -> Result<()>;
fn accumulate_result(&self) -> Result<Vec<DataValue>>;
fn merge(&mut self, _states: &[DataValue]) -> Result<()>;
fn merge_result(&self) -> Result<DataValue>;
```

流程是 `accumulate`(将数据应用于函数) --> `accumulate_result`(获取当前状态) --> `merge` (从其他状态合并当前状态) ---> `merge_result (获取最终结果值)`

ps：我们不将参数类型和参数名称存储在函数中，如果需要，我们可以在以后存储它们。

### Column

_Block_ 是用于 pipeline 处理的流之间传递的数据单元，而 _Column_ 是表达式之间传递的数据单元。
所以在表达式（函数、字面量...）看来，一切都是 _Column_，我们有 _DataColumn_ 来表示一列。

```rust
#[derive(Clone, Debug)]
pub enum DataColumn {
    // Array of values.
    Array(DataArrayRef),
    // A Single value.
    Constant(DataValue, usize)
}
```

_DataColumn::Constant_ 类似于 _ClickHouse_ 中的 _ConstantColumn_。

注意：我们没有 _ScalarValue_，因为它可以被认为是 `Constant(DataValue, 1)`，并且有 _DataValue_ 结构。

### Expression chain and expression executor

目前，我们可以从表达式中收集内部表达式来构建 ExpressionChain。这可以通过深度优先搜索来完成。ExpressionFunction：`number + (number + 1)` 将是：`[ ExpressionColumn(number),  ExpressionColumn(number), ExpressionLiteral(1),  ExpressionBinary('+', 'number', '1'), ExpressionBinary('+', 'number',  '(number + 1)')  ]`。

我们有 _ExpressionExecutor_ 来执行表达式链，在执行过程中，我们不需要关心参数的种类。我们只将它们视为来自上游的 _ColumnExpression_，所以我们只需从 block 中获取列 _number_ 和列 _(number + 1)_。

## Plan Builder

### None aggregation query

这适用于没有 _group by_ 和 _aggregate functions_ 的查询。

例如：`explain SELECT number + 1 as b from numbers(10) where number + 1 > 3  order by number + 3 `

```
| explain                                                                                                                                                                                                                                                                                             |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Projection: (number + 1) as b:UInt64
  Sort: (number + 3):UInt64
    Expression: (number + 1):UInt64, (number + 3):UInt64 (Before OrderBy)
      Filter: ((number + 1) > 3)
        ReadDataSource: scan partitions: [4], scan schema: [number:UInt64], statistics: [read_rows: 10, read_bytes: 80] |
+-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.02 sec)
```

构建过程是

- SourcePlan：schema --> [number]
- FilterPlan：filter 表达式是 `(number + 1) > 3`，schema 保持不变，schema --> [number]
- Expression：我们将从 `order by` 和 `having` 子句中收集表达式以应用表达式，schema --> `[number, number + 1, number + 3]`
- Sort：由于我们已经在输入计划中有了 `number + 1`，所以排序会将 `number + 1` 视为 _ColumnExpression_，schema --> `[number, number + 1, number + 3]`
- Projection：应用别名并 projection 列，schema --> `[b]`

### Aggregation query

要构建 `Aggregation` 查询，将比前一个查询更复杂。

例如：`explain SELECT number + 1 as b, sum(number + 2 ) + 4 as c from numbers(10) where number + 3 > 0  group by number + 1 having c > 3 and sum(number + 4) + 1 > 4  order by sum(number + 5) + 1;`

```
| Projection: (number + 1) as b:UInt64, (sum((number + 2)) + 4) as c:UInt64
  Sort: sum((number + 5)):UInt64
    Having: (((sum((number + 2)) + 4) > 3) AND (sum((number + 4)) > 0))
      Expression: (number + 1):UInt64, (sum((number + 2)) + 4):UInt64, sum((number + 5)):UInt64 (Before OrderBy)
        AggregatorFinal: groupBy=[[(number + 1)]], aggr=[[sum((number + 2)), sum((number + 5)), sum((number + 4))]]
          RedistributeStage[state: AggregatorMerge, id: 0]
            AggregatorPartial: groupBy=[[(number + 1)]], aggr=[[sum((number + 2)), sum((number + 5)), sum((number + 4))]]
              Expression: (number + 1):UInt64, (number + 2):UInt64, (number + 5):UInt64, (number + 4):UInt64 (Before GroupBy)
                Filter: ((number + 3) > 0)
                  ReadDataSource: scan partitions: [4], scan schema: [number:UInt64], statistics: [read_rows: 10, read_bytes: 80]
```

构建过程是

- SourcePlan：schema --> [number]
- FilterPlan：filter 表达式是 `(number + 3) > 0`，schema 保持不变，schema --> [number]
- Expression：在 group by 之前 `(number + 1):UInt64, (number + 2):UInt64, (number + 5):UInt64, (number + 4):UInt64 (Before GroupBy)`
  在 GroupBy 之前，我们必须访问 `projections`、`having`、`group by` 中的所有表达式，以收集表达式和聚合函数，schema --> `[number, number + 1, number + 2, number + 4, number + 5]`
- AggregatorPartial：`groupBy=[[(number + 1)]], aggr=[[sum((number + 2)), sum((number + 5)), sum((number + 4))]]`，请注意：表达式已经在上游物化，所以我们只将所有参数视为列。
- AggregatorFinal，schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4))]`
- Expression：schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4)),  sum((number + 2)) + 4, sum((number + 5)) + 1]`
- Sort：schema 保持不变
- Projection：schema --> `b, c`
