---
title: 如何编写聚合函数
sidebar_label: 如何编写聚合函数
---

聚合函数，或称为聚合功能，是一种将多行的值组合成单个汇总值的函数。常见的聚合函数包括 sum、count、avg 等。

Databend 允许您使用 Rust 自定义自己的聚合函数。这不是一种简单的方式，因为您首先需要成为一名 Rust 程序员。

Databend 计划在未来支持使用其他语言（如 js、WebAssembly）编写 UDAF。

本节将向您展示如何在 Databend 中编写聚合函数。

## 函数注册

聚合函数的注册函数接受小写函数名和一个 `AggregateFunctionDescription` 对象作为参数。每个注册的函数都存储在 `case_insensitive_desc`（HashMap 数据结构）中。

`case_insensitive_combinator_desc` 用于存储组合函数，例如 `count_if` 和 `sum_if`，这些函数与 `_if` 后缀结合使用。

```rust
pub struct AggregateFunctionFactory {
    case_insensitive_desc: HashMap<String, AggregateFunctionDescription>,
    case_insensitive_combinator_desc: Vec<(String, CombinatorDescription)>,
}
impl AggregateFunctionFactory {
  ...
pub fn register(&mut self, name: &str, desc: AggregateFunctionDescription) {
        let case_insensitive_desc = &mut self.case_insensitive_desc;
        case_insensitive_desc.insert(name.to_lowercase(), desc);
    }
  ...
}
```

每个注册的函数都必须实现 `AggregateFunction` 和 `AggregateFunctionFeatures` 特征，而 `AggregateFunctionFeatures` 类似于 `Scalar` 中的 `FunctionProperty`，因为它们都存储了函数的一些属性。

```rust
pub type AggregateFunctionRef = Arc<dyn AggregateFunction>;
pub type AggregateFunctionCreator =
    Box<dyn Fn(&str, Vec<Scalar>, Vec<DataType>) -> Result<AggregateFunctionRef> + Sync + Send>;
pub struct AggregateFunctionDescription {
    pub(crate) aggregate_function_creator: AggregateFunctionCreator,
    pub(crate) features: AggregateFunctionFeatures,
}
```

## 函数组成

与 `Scalar` 直接使用 `Struct` 不同，`AggregateFunction` 是一个特征，因为聚合函数从块中累积数据并在累积过程中生成一些中间结果。

因此，**聚合函数**必须有一个初始状态，而在聚合过程中生成的结果必须是**可合并**和**可序列化**的。

主要功能包括：

- **name** 代表正在注册的函数的名称，例如 avg、sum 等。
- **return_type** 代表注册函数的返回类型。相同函数的返回值可能因参数类型不同而变化。例如，`sum(int8)` 的参数类型为 `i8`，但返回值可能为 `int64`。
- **init_state** 用于初始化聚合函数的状态。
- **state_layout** 用于表示**状态**在内存中的大小和内存块的排列。
- **accumulate** 用于 `SingleStateAggregator`。即，整个块可以在没有任何键的情况下在单一状态下聚合。例如，在查询 `select count(*) from t` 时，查询中没有分组列，将调用 `accumulate` 函数。
- **accumulate_keys** 用于 `PartialAggregator`。这里，需要考虑 `key` 和 `offset`，其中每个键代表一个唯一的内存地址，表示为函数参数位置。
- **serialize** 将聚合过程中的**状态**序列化为二进制。
- **deserialize** 将二进制反序列化为**状态**。
- **merge** 用于将其他状态合并到当前状态中。
- **merge_result** 可以将**聚合函数状态**合并为单个值。

## 示例

**以 avg 为例**

实现细节可以在 [aggregate_avg.rs](https://github.com/datafuselabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_avg.rs) 中找到。

因为我们需要累积每个值并将它们除以非空行的总数，所以 `avg` 函数定义为结构体 `AggregateAvgFunction<T, SumT>`，其中 `T` 和 `SumT` 是实现了 [Number](https://github.com/datafuselabs/databend/blob/2aec38605eebb7f0e1717f7f54ec52ae0f2e530b/src/query/expression/src/types/number.rs) 的逻辑类型。

在聚合过程中，avg 函数将获取累积值的总和和已扫描的非空行数。因此，`AggregateAvgState` 可以定义为以下结构：

```rust
#[derive(Serialize, Deserialize)]
struct AggregateAvgState<T: Number> {
    #[serde(bound(deserialize = "T: DeserializeOwned"))]
    pub value: T,
    pub count: u64,
}
```

- **return_type** 设置为 `Float64Type`。例如，`value = 3`，`count = 2`，`avg = value/count`。
- **init_state** 使用 `T` 的默认值初始化状态，并将计数设置为 `0`。
- **accumulate** 为块中的非空行累积 `AggregateAvgState` 的计数和值。
- **accumulate_keys** 使用 `place.get::<AggregateAvgState<SumT>>()` 获取并更新相应的状态值。

```rust
fn accumulate_keys(
    &self,
    places: &[StateAddr],
    offset: usize,
    columns: &[Column],
    _input_rows: usize,
) -> Result<()> {
    let darray = NumberType::<T>::try_downcast_column(&columns[0]).unwrap();
    darray.iter().zip(places.iter()).for_each(|(c, place)| {
        let place = place.next(offset);
        let state = place.get::<AggregateAvgState<SumT>>();
        state.add(c.as_(), 1);
    });
    Ok(())
}
```

## 参考其他示例

如您所见，在 Databend 中添加新的聚合函数并不像您想象的那么难。
在您开始添加一个之前，请参考其他聚合函数示例，例如 `sum`、`count`。

- [sum](https://github.com/datafuselabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_sum.rs)
- [count](https://github.com/datafuselabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_count.rs)

## 测试

作为一个优秀的开发者，您总是测试您的代码，不是吗？请在完成新的聚合函数后添加单元测试和逻辑测试。

### 单元测试

聚合函数的单元测试位于 [agg.rs](https://github.com/datafuselabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/tests/it/aggregates/agg.rs)。

### 逻辑测试

函数的逻辑测试位于 [tests/logictest/suites/base/02_function/](https://github.com/datafuselabs/databend/tree/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/tests/sqllogictests/suites/query/02_function)。