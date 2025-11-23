---
title: 编写聚合函数
sidebar_label: 编写聚合函数
---

聚合函数是一种将多行数据的值组合成单个汇总值的函数。常见的聚合函数包括 sum、count、avg 等。

Databend 允许您使用 Rust 自定义聚合函数。这不是一个简单的方法，因为您首先需要成为一名 Rustacean。

Databend 计划将来支持使用其他语言（如 js、web assembly）编写 UDAF。

本节介绍如何在 Databend 中编写聚合函数。

## 函数注册

聚合函数的注册函数接受一个小写的函数名和一个 `AggregateFunctionDescription` 对象作为参数。每个注册的函数都存储在 `case_insensitive_desc` (HashMap 数据结构) 中。

`case_insensitive_combinator_desc` 用于存储组合函数，例如与 `_if` 后缀组合的 `count_if` 和 `sum_if`。

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

每个注册的函数都必须实现 `AggregateFunction` 和 `AggregateFunctionFeatures` trait，并且 `AggregateFunctionFeatures` 类似于 `Scalar` 中的 `FunctionProperty`，因为它们都存储函数的一些属性。

```rust
pub type AggregateFunctionRef = Arc<dyn AggregateFunction>;
pub type AggregateFunctionCreator =
    Box<dyn Fn(&str, Vec<Scalar>, Vec<DataType>) -> Result<AggregateFunctionRef> + Sync + Send>;
pub struct AggregateFunctionDescription {
    pub(crate) aggregate_function_creator: AggregateFunctionCreator,
    pub(crate) features: AggregateFunctionFeatures,
}
```

## 函数组合

与 `Scalar` 直接使用 `Struct` 不同，`AggregateFunction` 是一个 trait，因为聚合函数会累积来自块的数据，并在累积过程中生成一些中间结果。

因此，**Aggregate Function** 必须具有初始状态，并且在聚合过程中生成的结果必须是 **可合并的** 和 **可序列化的**。

主要功能是：

- **name** 表示正在注册的函数的名称，例如 avg、sum 等。
- **return_type** 表示已注册函数的返回类型。同一函数的返回值可能会因不同的参数类型而改变。例如，`sum(int8)` 的参数类型为 `i8`，但返回值可能为 `int64`。
- **init_state** 用于初始化聚合函数的状态。
- **state_layout** 用于表示内存中 **state** 的大小和内存块的排列。
- **accumulate** 用于 `SingleStateAggregator`。也就是说，整个块可以在单个状态下聚合，而无需任何键。例如，当 `selecting count(*) from t` 时，查询中没有分组列，将调用 `accumulate` 函数。
- **accumulate_keys** 用于 `PartialAggregator`。这里，需要考虑 `key` 和 `offset`，其中每个键代表一个唯一的内存地址，表示为函数参数位置。
- **serialize** 将聚合过程中的 **state** 序列化为二进制。
- **deserialize** 将二进制反序列化为 **state**。
- **merge** 用于将其他状态合并到当前状态。
- **merge_result** 可以将 **Aggregate Function state** 合并为单个值。

## 例子

**以 avg 为例**

实现细节可以在 [aggregate_avg.rs](https://github.com/databendlabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_avg.rs) 中找到。

因为我们需要累积每个值并将它们除以非空行的总数，所以 `avg` 函数被定义为一个结构体 `AggregateAvgFunction<T, SumT>`，其中 `T` 和 `SumT` 是实现 [Number](https://github.com/databendlabs/databend/blob/2aec38605eebb7f0e1717f7f54ec52ae0f2e530b/src/query/expression/src/types/number.rs) 的逻辑类型。

在聚合过程中，avg 函数将获得累积值的总和和已扫描的非空行数。因此，`AggregateAvgState` 可以定义为以下结构：

```rust
#[derive(Serialize, Deserialize)]
struct AggregateAvgState<T: Number> {
    #[serde(bound(deserialize = "T: DeserializeOwned"))]
    pub value: T,
    pub count: u64,
}
```

- **return_type** 设置为 `Float64Type`。例如，`value = 3`，`count = 2`，`avg = value/count`。
- **init_state** 使用 `T` 的默认值初始化状态，并将 count 设置为 `0`。
- **accumulate** 累积块中非空行的 `AggregateAvgState` 的 count 和 value。
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

## 参考其他例子

正如你所看到的，在 Databend 中添加一个新的聚合函数并不像你想象的那么难。
在开始添加一个之前，请参考其他聚合函数示例，例如 `sum`、`count`。

- [sum](https://github.com/databendlabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_sum.rs)
- [count](https://github.com/databendlabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/aggregates/aggregate_count.rs)

## 测试

作为一个优秀的开发人员，你总是会测试你的代码，不是吗？完成新的聚合函数后，请添加单元测试和逻辑测试。

### 单元测试

聚合函数的单元测试位于 [agg.rs](https://github.com/databendlabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/tests/it/aggregates/agg.rs) 中。

### 逻辑测试

函数的逻辑测试位于 [tests/logictest/suites/base/02_function/](https://github.com/databendlabs/databend/tree/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/tests/sqllogictests/suites/query/02_function) 中。