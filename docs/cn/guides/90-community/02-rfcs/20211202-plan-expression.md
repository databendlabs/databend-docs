---
title: 表达式与计划构建器
description:
  表达式与计划构建器 RFC
---

## 概述

逻辑计划和表达式在 SQL 查询的生命周期中扮演着重要角色。
本文档旨在解释表达式和计划构建器的新设计。

## 表达式

### 别名表达式

别名在 SQL 中非常有用，我们可以将一个复杂的表达式别名为一个简短的别名名称。例如：`SELECT a + 3 as b`。

在标准 SQL 协议中，别名可以在以下情况下使用：

- Group By, 例如：```SELECT a + 3 as b, count(1) from table group by b```
- Having, 例如：```SELECT a + 3 as b, count(1) as c from table group by b having c > 0```
- Order By: 例如：```SELECT a + 3 as b from table order by b```

:::tip
ClickHouse 扩展了表达式别名的使用，它可以在以下情况下工作：

- 递归别名表达式：例如：`SELECT a + 1 as b, b + 1 as c`

- 过滤：例如：`SELECT a + 1 as b, b + 1 as c  from table where c > 0`

注意：目前我们不支持 ClickHouse 风格的别名表达式。这可以在以后实现。
:::

对于表达式别名，我们只在最后处理，在投影阶段。但我们必须尽早替换表达式的别名，以防止后续的歧义。

例如：

`SELECT number + 1 as c, sum(number) from numbers(10) group by c having c > 3 order by c limit 10`

- 首先，我们可以从投影 AST 中扫描所有的别名表达式。`c ---> (number + 1)`
- 然后我们在 *having*、*order by*、*group by* 子句中将别名替换为相应的表达式。因此查询将变为：`SELECT number + 1 as c, sum(number) from numbers(10) group by (number + 1) having (number + 1) > 3 order by (number + 1) limit 10`
- 最后，当查询完成时，我们应用投影将列 `(number+1)` 重命名为 `c`

让我们看一下这个查询的解释结果：

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

我们可以看到，我们不需要在投影之前关心别名，因此应用其他表达式会非常方便。

### 物化表达式

物化表达式处理是指如果上游已经处理了相同的表达式，我们可以将表达式重新定义为 *ExpressionColumn*。

例如：

`SELECT number + 1 as c, sum(number) as d group by c having number + 1 > 3 order by  d desc`

在别名替换之后，我们将知道 order by 是 `sum(number)`，但 `sum(number)` 已经在聚合阶段处理过了，因此我们可以将 order by 表达式 `SortExpression { ... }` 重新定义为 `Column("sum(number)")`，这可以消除相同表达式的无用计算。

因此，having 中的 `number + 1` 也可以应用重新定义表达式。

### 表达式函数

表达式函数有很多种。

- ScalarFunctions，一对一的计算过程，结果行数与输入行数相同。例如：`SELECT database()`
- AggregateFunctions，多对一的计算过程，例如：`SELECT sum(number)`
- BinaryFunctions，一种特殊的 *ScalarFunctions* 例如：`SELECT 1 + 2 `
- ...

对于 ScalarFunctions，我们并不关心整个块，我们只关心参数涉及的列。`sum(number)` 只关心名为 *number* 的列。结果也是一个列，因此我们在 `IFunction` 中有虚拟方法：

```rust
fn eval(&self, columns: &[DataColumn], _input_rows: usize) -> Result<DataColumn>;
```

对于 AggregateFunctions，我们应该在相应的函数实例中保持状态以应用两级合并，我们在 `IAggregateFunction` 中有以下虚拟方法：

```rust
fn accumulate(&mut self, columns: &[DataColumn], _input_rows: usize) -> Result<()>;
fn accumulate_result(&self) -> Result<Vec<DataValue>>;
fn merge(&mut self, _states: &[DataValue]) -> Result<()>;
fn merge_result(&self) -> Result<DataValue>;
```

过程是 `accumulate`（将数据应用于函数）--> `accumulate_result`（获取当前状态）--> `merge`（从其他状态合并当前状态）---> `merge_result`（获取最终结果值）

ps：我们不在函数中存储参数类型和参数名称，如果需要，我们可以在以后存储它们。

### 列

*Block* 是流之间传递的数据单元，用于管道处理，而 *Column* 是表达式之间传递的数据单元。
因此，在表达式的视角（函数、字面量等），一切都是 *Column*，我们有 *DataColumn* 来表示一列。
```rust
#[derive(Clone, Debug)]
pub enum DataColumn {
    // 值的数组。
    Array(DataArrayRef),
    // 单个值。
    Constant(DataValue, usize)
}
```

*DataColumn::Constant* 类似于 *ClickHouse* 中的 *ConstantColumn*。

注意：我们没有 *ScalarValue*，因为它可以被视为 `Constant(DataValue, 1)`，并且有 *DataValue* 结构。

### 表达式链和表达式执行器

目前，我们可以从表达式中收集内部表达式以构建 ExpressionChain。这可以通过深度优先搜索访问来完成。表达式函数：`number + (number + 1)` 将是：`[ ExpressionColumn(number),  ExpressionColumn(number), ExpressionLiteral(1),  ExpressionBinary('+', 'number', '1'), ExpressionBinary('+', 'number',  '(number + 1)')  ]`。

我们有 *ExpressionExecutor* 来执行表达式链，在执行过程中，我们不需要关心参数的种类。我们只是将它们视为上游的 *ColumnExpression*，因此我们只需从块中获取列 *number* 和列 *(number + 1)*。

## 计划构建器

### 无聚合查询

这是针对没有 *group by* 和 *aggregate functions* 的查询。

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

- SourcePlan : schema --> [number]
- FilterPlan: 过滤表达式是 `(number + 1) > 3`，schema 保持不变，schema --> [number]
- Expression: 我们将从 `order by` 和 `having` 子句中收集表达式以应用表达式，schema --> `[number, number + 1, number + 3]`
- Sort: 由于我们在输入计划中已经拥有 `number + 1`，因此排序将考虑 `number + 1` 作为 *ColumnExpression*，schema --> `[number, number + 1, number + 3]`
- Projection: 应用别名并投影列，schema --> `[b]`

### 聚合查询

构建 `Aggregation` 查询会比之前的更复杂。

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

- SourcePlan : schema --> [number]
- FilterPlan: 过滤表达式是 `(number + 3) > 0`，schema 保持不变，schema --> [number]
- Expression: 在 group by 之前 `(number + 1):UInt64, (number + 2):UInt64, (number + 5):UInt64, (number + 4):UInt64 (Before GroupBy)`
在 GroupBy 之前，我们必须访问 `projections`、`having`、`group by` 中的所有表达式以收集表达式和聚合函数，schema --> `[number, number + 1, number + 2, number + 4, number + 5]`
- AggregatorPartial: `groupBy=[[(number + 1)]], aggr=[[sum((number + 2)), sum((number + 5)), sum((number + 4))]]`，注意：表达式已经在上游物化，因此我们只考虑所有参数为列。
- AggregatorFinal, schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4))]`
- Expression: schema --> `[number + 1, sum((number + 2)), sum((number + 5)), sum((number + 4)),  sum((number + 2)) + 4, sum((number + 5)) + 1]`
- Sort: schema 保持不变
- Projection: schema --> `b, c`