---
title: 新 DataValues 系统
description: 新的 DataValues 系统设计 RFC
---

:::tip
**您知道吗？** 此 RFC 中的内容已过时，Databend 现在有一个正式的类型系统。

**了解更多**

- [RFC: Formal Type System](https://github.com/databendlabs/databend/discussions/5438)
- [refactor: Merge new expression](https://github.com/databendlabs/databend/pull/9411)
  :::

## 概要

### 当前 `DataType` 的缺点

- `DataType` 是一个枚举类型，我们必须在使用前匹配特定的类型。例如，如果我们想通过 `DataType` 创建反序列化器/序列化器，我们应该总是进行匹配。这并不意味着匹配是不必要的。如果我们想向 `DataType` 添加越来越多的函数，匹配可能会非常烦人。

- `DataType` 表示为枚举类型，我们不能将其用作泛型参数。

- `DataType` 可能涉及一些嵌套的数据类型，例如 `DataType::Struct`，但是我们将 `DataField` 放在 `DataType` 内部，这在逻辑上是不合理的。

- 难以将属性放入基于枚举的 `DataType` 中，例如 nullable 属性 #3726 #3769

### 关于列的太多概念 (Series/Column/Array)

- DataColumn 是一个枚举，包括 `Constant(value)` 和 `Array(Series)`

```rust
pub enum DataColumn {
    // Array of values.
    Array(Series),
    // A Single value.
    Constant(DataValue, usize),
}
```

- Series 是 `SeriesTrait` 的包装

```rust
pub struct Series(pub Arc<dyn SeriesTrait>);
```

- SeriesTrait 可以实现各种数组，使用许多宏。

```rust
pub struct SeriesWrap<T>(pub T);
   impl SeriesTrait for SeriesWrap<$da> {
            fn data_type(&self) -> &DataType {
                self.0.data_type()
            }

            fn len(&self) -> usize {
                self.0.len()
            }
            ...
  }
```

- 对于函数，我们必须考虑 `Column` 的 `Constant` 情况，因此有很多分支匹配。

```rust
match (
            columns[0].column().cast_with_type(&DataType::String)?,
            columns[1].column().cast_with_type(&DataType::UInt64)?,
        ) {
            (
                DataColumn::Constant(DataValue::String(input_string), _),
                DataColumn::Constant(DataValue::UInt64(times), _),
            ) => Ok(DataColumn::Constant(
                DataValue::String(repeat(input_string, times)?),
                input_rows,
            )),
            (
                DataColumn::Constant(DataValue::String(input_string), _),
                DataColumn::Array(times),
            )
            ...
```

## 新的 DataValues 系统设计

### 引入 `DataType` 作为 trait

```rust
#[typetag::serde(tag = "type")]
pub trait DataType: std::fmt::Debug + Sync + Send + DynClone {
    fn data_type_id(&self) -> TypeID;

    fn is_nullable(&self) -> bool {
        false
    }
    ..
 }
```

Nullable 是 `DataType` 的一个特殊情况，它是 `DataType` 的一个包装。

```rust

pub struct DataTypeNull {inner: DataTypeImpl}
```

### 简化 `DataValue`

```rust
pub enum DataValue {
    /// Base type.
    Null,
    Boolean(bool),
    Int64(i64),
    UInt64(u64),
    Float64(f64),
    String(Vec<u8>),
    // Container struct.
    Array(Vec<DataValue>),
    Struct(Vec<DataValue>),
}
```

`DataValue` 可以通过它的值转换为适当的 `DataType`。

```rust
// convert to minialized data type
    pub fn data_type(&self) -> DataTypeImpl {
        match self {
            DataValue::Null => Arc::new(NullType {}),
            DataValue::Boolean(_) => BooleanType::new_impl(),
            DataValue::Int64(n) => {
                if *n >= i8::MIN as i64 && *n <= i8::MAX as i64 {
                    return Int8Type::new_impl();
                }
            ...
   }
```

此外，`DataValue` 可以转换为 rust 原始值，反之亦然。

### 将 `Series/Array/Column` 统一为 `Column`

- `Column` 作为一个 trait

```rust
pub type ColumnRef = Arc<dyn Column>;
pub trait Column: Send + Sync {
    fn as_any(&self) -> &dyn Any;
    /// Type of data that column contains. It's an underlying physical type:
    /// UInt16 for Date, UInt32 for DateTime, so on.
    fn data_type_id(&self) -> TypeID {
        self.data_type().data_type_id()
    }
    fn data_type(&self) -> DataTypeImpl;

    fn is_nullable(&self) -> bool {
        false
    }

    fn is_const(&self) -> bool {
        false
    }
   ..
 }

```

- 引入 `Constant column`

> `Constant column` 是一个 `Column` 的包装，带有一个单一的值 (size = 1)

```rust
#[derive(Clone)]
pub struct ConstColumn {
    length: usize,
    column: ColumnRef,
}
impl Column for ConstColumn {..}
```

- 引入 `nullable column`

> `nullable column` 是一个 `Column` 的包装，并保留一个额外的位图来指示 null 值。

```rust
pub struct NullableColumn {
    validity: Bitmap,
    column: ColumnRef,
}
impl Column for NullableColumn {..}
```

- 从 Arrow 的列格式转换或转换为 Arrow 的列格式没有额外的成本。

```rust
 fn as_arrow_array(&self) -> common_arrow::ArrayRef {
    let data_type = self.data_type().arrow_type();
    Arc::new(PrimitiveArray::<T>::from_data(
        data_type,
        self.values.clone(),
        None,
    ))
 }
```

- 保留 `Series` 作为一个工具结构，这可能有助于快速生成一个列。

```rust
// nullable column from options
let column = Series::from_data(vec![Some(1i8), None, Some(3), Some(4), Some(5)]);

// no nullable column
let column = Series::from_data(vec![1，2，3，4);
```

- 向下转换为特定的 `Column`

```rust
impl Series {
    /// Get a pointer to the underlying data of this Series.
    /// Can be useful for fast comparisons.
    /// # Safety
    /// Assumes that the `column` is  T.
    pub unsafe fn static_cast<T>(column: &ColumnRef) -> &T {
        let object = column.as_ref();
        &*(object as *const dyn Column as *const T)
    }

    pub fn check_get<T: 'static + Column>(column: &ColumnRef) -> Result<&T> {
        let arr = column.as_any().downcast_ref::<T>().ok_or_else(|| {
            ErrorCode::UnknownColumn(format!(
                "downcast column error, column type: {:?}",
                column.data_type()
            ))
        });
        arr
    }
}
```

- 通过 `ColumnViewer` 方便地查看列

无需关心 `Constants` 和 `Nullable`。

```rust
let wrapper = ColumnViewer::<i8>::try_create(&column)?;

assert_eq!(wrapper.len(), 10);
assert!(!wrapper.null_at(0));
for i in 0..wrapper.len() {
    assert_eq!(*wrapper.value(i), (i + 1) as i8);
}
Ok(())


let wrapper = ColumnViewer::<bool>::try_create(&column)?;
let c = wrapper.value(0);

let wrapper =  ColumnViewer::<&str>::try_create(&column)?;
let c = wrapper.value(1);
Ok(())
```

## TODO

- 使 `datavalues2` 更加成熟。
- 将 `datavalues2` 合并到 Databend 中。
