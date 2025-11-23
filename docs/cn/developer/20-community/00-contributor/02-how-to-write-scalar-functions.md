---
title: 编写标量函数
sidebar_label: 编写标量函数
---

## 什么是标量函数

标量函数为每一行返回一个单一值，而不是一个结果集。标量函数可以用于查询或 SET 语句中的大多数位置（除了 FROM 子句）。

```text title="一对一映射执行"

┌─────┐                    ┌──────┐
│  a  │                    │   x  │
├─────┤                    ├──────┤
│  b  │                    │   y  │
├─────┤    ScalarFunction  ├──────┤
│  c  │                    │   z  │
├─────┼────────────────────►──────┤
│  d  │     Exec           │   u  │
├─────┤                    ├──────┤
│  e  │                    │   v  │
├─────┤                    │   w  │
└─────┘                    └──────┘
```

### 编写前需要了解的内容

#### 逻辑数据类型和物理数据类型

我们在 Databend 中使用逻辑数据类型，在执行/计算引擎中使用物理数据类型。

以 `Date` 为例，`Date` 是一个逻辑数据类型，而它的物理数据类型是 `Int32`，所以它的列由 `Buffer<i32>` 表示。

#### Arrow 的内存布局

Databend 的内存布局基于 Arrow 系统，你可以在 [这里] (https://arrow.apache.org/docs/format/Columnar.html#format-columnar) 找到 Arrow 的内存布局。

例如，一个 int32 类型的原始数组：

[1, null, 2, 4, 8]
看起来会是这样：

```text
* Length: 5, Null count: 1
* Validity bitmap buffer:

  |Byte 0 (validity bitmap) | Bytes 1-63            |
  |-------------------------|-----------------------|
  | 00011101                | 0 (padding)           |

* Value Buffer:

  |Bytes 0-3   | Bytes 4-7   | Bytes 8-11  | Bytes 12-15 | Bytes 16-19 | Bytes 20-63 |
  |------------|-------------|-------------|-------------|-------------|-------------|
  | 1          | unspecified | 2           | 4           | 8           | unspecified |

```

在大多数情况下，我们可以忽略 SIMD 操作的 null 值，并在操作后将 null 掩码添加到结果中。
这是一种非常常见的优化，并在 Arrow 的计算系统中广泛使用。

### 特殊列

- 常量列

  有时列在块中是常量，例如：`SELECT 3 from table`，列 3 始终为 3，因此我们可以使用常量列来表示它。这有助于在计算期间节省内存空间。

- 可空列

  默认情况下，列不可为空。要在列中包含 null 值，可以使用可空列。

## 函数注册

`FunctionRegistry` 用于注册函数。

```rust
#[derive(Default)]
pub struct FunctionRegistry {
    pub funcs: HashMap<&'static str, Vec<Arc<Function>>>,
    #[allow(clippy::type_complexity)]
    pub factories: HashMap<
        &'static str,
        Vec<Box<dyn Fn(&[usize], &[DataType]) -> Option<Arc<Function>> + 'static>>,
    >,
    pub aliases: HashMap<&'static str, &'static str>,
}
```

它包含三个 HashMap：`funcs`、`factories` 和 `aliases`。

`funcs` 和 `factories` 都存储已注册的函数。`funcs` 接受固定数量的参数（目前从 0 到 5），`register_0_arg`、`register_1_arg` 等。`factories` 接受可变长度的参数（例如 concat），并调用函数 `register_function_factory`。

`aliases` 使用键值对来存储函数的别名。一个函数可以有多个别名（例如，`minus` 有 `subtract` 和 'neg'）。键是函数的别名，值是当前函数的名称，并且将调用 `register_aliases` 函数。

此外，根据所需的功能，有不同级别的注册 API。

|                                     | 自动向量化 | 访问输出列构建器 | 自动 Null 传递 | 自动合并 Null | 自动向下转换 | 抛出运行时错误 | 变长参数 | 元组 |
| ----------------------------------- | ---------- | ---------------- | -------------- | ------------- | ------------ | -------------- | -------- | ---- |
| register_n_arg                      | ✔️         | ❌               | ✔️             | ❌            | ✔️           | ✔️             | ❌       | ❌   |
| register_passthrough_nullable_n_arg | ❌         | ✔️               | ✔️             | ❌            | ✔️           | ✔️             | ❌       | ❌   |
| register_combine_nullable_n_arg     | ❌         | ✔️               | ✔️             | ✔️            | ✔️           | ✔️             | ❌       | ❌   |
| register_n_arg_core                 | ❌         | ✔️               | ❌             | ❌            | ✔️           | ✔️             | ❌       | ❌   |
| register_function_factory           | ❌         | ✔️               | ❌             | ❌            | ❌           | ✔️             | ✔️       | ✔️   |

## 函数组合

由于 `funcs` 的值是函数的主体，让我们看看如何在 Databend 中构造一个 `Function`。

```rust
pub struct Function {
    pub signature: FunctionSignature,
    #[allow(clippy::type_complexity)]
    pub calc_domain: Box<dyn Fn(&[Domain]) -> Option<Domain>>,
    #[allow(clippy::type_complexity)]
    pub eval: Box<dyn Fn(&[ValueRef<AnyType>], FunctionContext) -> Result<Value<AnyType>, String>>,
}
```

函数由 `Function` 结构体表示，其中包括函数 `signature`、计算域 (`cal_domain`) 和评估函数 (`eval`)。

签名包括函数名称、参数类型、返回类型和函数属性（目前不可用，保留用于函数）。特别注意，注册时函数名称需要小写。一些 token 通过 `src/query/ast/src/parser/token.rs` 进行转换。

```rust
#[allow(non_camel_case_types)]
#[derive(Logos, Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum TokenKind {
    ...
    #[token("+")]
    Plus,
    ...
}
```

例如，让我们考虑查询 `select 1+2` 中使用的加法函数。`+` token 被转换为 `Plus`，并且函数名称需要小写。因此，用于注册的函数名称是 `plus`。

```rust
with_number_mapped_type!(|NUM_TYPE| match left {
    NumberDataType::NUM_TYPE => {
        registry.register_1_arg::<NumberType<NUM_TYPE>, NumberType<NUM_TYPE>, _, _>(
            "plus",

            |lhs| Some(lhs.clone()),
            |a, _| a,
        );
    }
});
```

`calc_domain` 用于计算输出值的输入值集。这由数学公式描述，例如 `y = f(x)`，其中域是可以作为 `f` 的参数以生成值 `y` 的值 `x` 的集合。这使我们能够轻松地过滤掉索引数据时不在域中的值，从而大大提高响应效率。

`eval` 可以理解为函数的具体实现，它接受字符或数字作为输入，将它们解析为表达式，并将它们转换为另一组值。

## 示例

函数有几个类别，包括算术、数组、布尔、控制、比较、日期时间、数学和字符串。

### `length` 函数

length 函数接受一个 `String` 参数并返回一个 `Number`。它被命名为 `length`，**没有域限制**，因为每个字符串都应该有一个长度。最后一个参数是一个闭包函数，用作 `length` 的实现。

```rust
registry.register_1_arg::<StringType, NumberType<u64>, _, _>(
    "length",

    |_| None,
    |val, _| val.len() as u64,
);
```

在 `register_1_arg` 的实现中，我们看到调用的函数是 `register_passthrough_nullable_1_arg`，其名称包含 **nullable**。`eval` 由 `vectorize_1_arg` 调用。

> 值得注意的是，[src/query/expression/src 中的 register.rs](https://github.com/databendlabs/databend/blob/2aec38605eebb7f0e1717f7f54ec52ae0f2e530b/src/query/codegen/src/writes/register.rs) 不应手动修改，因为它是由 [src/query/codegen/src/writes/register.rs](https://github.com/databendlabs/databend/blob/2aec38605eebb7f0e1717f7f54ec52ae0f2e530b/src/query/codegen/src/writes/register.rs) 生成的。

```rust
pub fn register_1_arg<I1: ArgType, O: ArgType, F, G>(
    &mut self,
    name: &'static str,
    property: FunctionProperty,
    calc_domain: F,
    func: G,
) where
    F: Fn(&I1::Domain) -> Option<O::Domain> + 'static + Clone + Copy,
    G: Fn(I1::ScalarRef<'_>, FunctionContext) -> O::Scalar + 'static + Clone + Copy,
{
    self.register_passthrough_nullable_1_arg::<I1, O, _, _>(
        name,
        property,
        calc_domain,
        vectorize_1_arg(func),
    )
}
```

在实际场景中，`eval` 不仅接受字符串或数字，还接受 null 或其他各种类型。`null` 无疑是最特殊的一个。我们收到的参数也可能是一个列或一个值。例如，在以下 SQL 查询中，length 使用 null 值或列调用：

```sql
select length(null);
+--------------+
| length(null) |
+--------------+
|         NULL |
+--------------+
select length(id) from t;
+------------+
| length(id) |
+------------+
|          2 |
|          3 |
+------------+
```

因此，如果我们在函数中不需要处理 `null` 值，我们可以简单地使用 `register_x_arg`。否则，我们可以参考 [try_to_timestamp](https://github.com/databendlabs/databend/blob/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/src/scalars/datetime.rs) 的实现。

对于需要在 vectorize 中进行专门化的函数，应使用 `register_passthrough_nullable_x_arg` 来执行特定的向量化优化。

例如，`regexp` 函数的实现接受两个 `String` 参数并返回一个 `Bool`。为了进一步优化并减少正则表达式的重复解析，引入了 `HashMap` 结构来进行向量化执行。因此，单独实现了 `vectorize_regexp` 来处理这种优化。

```rust
registry.register_passthrough_nullable_2_arg::<StringType, StringType, BooleanType, _, _>(
    "regexp",
```

```
    |_, _| None,
    vectorize_regexp(|str, pat, map, _| {
        let pattern = if let Some(pattern) = map.get(pat) {
            pattern
        } else {
            let re = regexp::build_regexp_from_pattern("regexp", pat, None)?;
            map.insert(pat.to_vec(), re);
            map.get(pat).unwrap()
        };
        Ok(pattern.is_match(str))
    }),
);
```

## 测试

作为一个优秀的开发者，你总是会测试你的代码，不是吗？请在完成新的标量函数后添加单元测试和逻辑测试。

### 单元测试

标量函数的单元测试位于 [scalars](https://github.com/databendlabs/databend/tree/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/src/query/functions/tests/it/scalars) 中。

### 逻辑测试

函数的逻辑测试位于 [02_function](https://github.com/databendlabs/databend/tree/d5e06af03ba0f99afdd6bdc974bf2f5c1c022db8/tests/sqllogictests/suites/query/02_function) 中。
