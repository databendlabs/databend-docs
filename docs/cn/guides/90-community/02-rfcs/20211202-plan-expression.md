---
title: 表达式和计划构建器
description: 表达式和计划构建器RFC
---

## 概要

逻辑计划和表达式在 SQL 查询的整个生命周期中扮演着重要角色。
本文档旨在解释表达式和计划构建器的新设计。

## 表达式

### 别名表达式

在 SQL 中，别名是非常有用的，我们可以将一个复杂的表达式别名为一个简短的别名。例如：
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

对于表达式别名，我们只在最后处理它，在投影 Stage。但我们必须尽早替换表达式的别名，以防止后面出现歧义。

例如：

`SELECT number + 1 as c, sum(number) from numbers(10) group by c having c > 3 order by c limit 10`

- 首先，我们可以从投影 ASTs 中扫描所有的别名表达式。`c ---> (number + 1)`
- 然后我们在*having*、_order by_、*group by*子句中替换别名为相应的表达式。所以查询将会是：`SELECT number + 1 as c, sum(number) from numbers(10) group by (number + 1) having (number + 1) > 3 order by (number + 1) limit 10`
- 最后，当查询完成时，我们应用投影来重命名列`(number+1)`为`c`

让我们看看这个查询的解释结果：

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

我们可以看到，直到投影 Stage 我们才需要关心别名，所以应用其他表达式将非常方便。

### 物化表达式

物化表达式处理是指，如果相同的表达式已经在上游处理过，我们可以将表达式重新基于*ExpressionColumn*。

例如：

`SELECT number + 1 as c, sum(number) as d group by c having number + 1 > 3 order by  d desc`

在别名替换后，我们将知道 order by 是`sum(number)`，但`sum(number)`已经在聚合 Stage 处理过，所以我们可以将 order by 表达式`SortExpression { ... }`重新基于`Column("sum(number)")`，这可以去除相同表达式的无用计算。

所以`number + 1`在 having 中也可以应用于重新基于表达式。

### 表达式函数

有许多种类的表达式函数。

- ScalarFunctions，一对一计算过程，结果行与输入行相同。例如：`SELECT database()`
- AggregateFunctions，多对一计算过程，例如：`SELECT sum(number)`
- BinaryFunctions，一种特殊的·ScalarFunctions· 例如：`SELECT 1 + 2 `
- ...

对于 ScalarFunctions，我们真的不关心整个块，我们只关心参数涉及的列。`sum(number)`只关心名为*number*的列。结果也是一列，所以我们在`IFunction`中有虚拟方法是：

```rust
fn eval(&self, columns: &[DataColumn], _input_rows: usize) -> Result<DataColumn>;
```

对于 AggregateFunctions，我们应该在相应的函数实例中保持状态，以应用两级合并，我们在`IAggregateFunction`中有以下虚拟方法：

```rust
fn accumulate(&mut self, columns: &[DataColumn], _input_rows: usize) -> Result<()>;
fn accumulate_result(&self) -> Result<Vec<DataValue>>;
fn merge(&mut self, _states: &[DataValue]) -> Result<()>;
fn merge_result(&self) -> Result<DataValue>;
```

过程是`accumulate`(将数据应用到函数) --> `accumulate_result`(获取当前状态) --> `merge` (合并当前状态与其他状态) ---> `merge_result (获取最终结果值)`

注：我们不在函数中存储参数类型和参数名称，如果需要，我们可以稍后存储。

### 列

*Block*是流之间传递数据的单位，用于管道处理，而*Column*是表达式之间传递数据的单位。
所以在表达式（函数，字面量，...）的视图中，一切都是*Column*，我们有*DataColumn*来表示一列。

```rust
#[derive(Clone, Debug)]
pub enum DataColumn {
    // 值的数组。
    Array(DataArrayRef),
    // 单个值。
    Constant(DataValue, usize)
}
```

*DataColumn::Constant*类似于*ClickHouse*中的*ConstantColumn*。

注意：我们没有*ScalarValue*，因为它可以被认为是`Constant(DataValue, 1)`，并且有*DataValue*结构。

### 表达式链和表达式执行器

目前，我们可以从表达式中收集内部表达式来构建 ExpressionChain。这可以通过深度优先搜索访问完成。ExpressionFunction：`number + (number + 1)`将是：`[ ExpressionColumn(number),  ExpressionColumn(number), ExpressionLiteral(1),  ExpressionBinary('+', 'number', '1'), ExpressionBinary('+', 'number',  '(number + 1)')]`。

我们有*ExpressionExecutor*来执行表达式链，在执行过程中，我们不需要关心参数的种类。我们只将它们视为来自上游的*ColumnExpression*，所以我们只从块中获取列*number*和列*(number + 1)*。

## 计划构建器

### 非聚合查询

这是针对没有*group by*和*aggregate functions*的查询。

例如：`explain SELECT number + 1 as b from numbers(10) where number + 1 > 3  order by number + 3 `

```
构建过程是

- SourcePlan：schema --> [number]
- FilterPlan：过滤表达式为 `(number + 1) > 3`，schema 保持不变，schema --> [number]
- Expression：我们将从 `order by` 和 `having` 子句中收集表达式来应用表达式，schema --> `[number, number + 1, number + 3]`
- Sort：由于我们已经在输入计划中有了 `number + 1`，所以排序将考虑 `number + 1` 作为 *ColumnExpression*，schema --> `[number, number + 1, number + 3]`
- Projection：应用别名并投影列，schema --> `[b]`

### 聚合查询

构建 `Aggregation` 查询将比前一个更复杂。

例如：`explain SELECT number + 1 as b, sum(number + 2 ) + 4 as c from numbers(10) where number + 3 > 0  group by number + 1 having c > 3 and sum(number + 4) + 1 > 4  order by sum(number + 5) + 1;`

构建过程是

- SourcePlan：schema --> [number]
- FilterPlan：过滤表达式为 `(number + 3) > 0`，schema 保持不变，schema --> [number]
- Expression：分组前 `(number + 1):UInt64, (number + 2):UInt64, (number + 5):UInt64, (number + 4):UInt64 (Before GroupBy)`
在 GroupBy 前，我们必须访问 `projections`、`having`、`group by` 中的所有表达式来收集表达式和聚合函数，schema --> `[number, number + 1, number + 2, number + 4, number + 5]`
- AggregatorPartial：`groupBy=[[(number + 1)]], aggr=[[sum((number + 2)), sum((number + 5)), sum((number + 4))]]`，注意：表达式已在上游实现，所以我们只考虑所有参数作为列。
- AggregatorFinal，schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4))]`
- Expression：schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4)),  sum((number + 2)) + 4, sum((number + 5)) + 1]`
- Sort：schema 保持不变
- Projection：schema --> `b, c`
```
