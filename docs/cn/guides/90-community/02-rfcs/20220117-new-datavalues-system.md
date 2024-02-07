---
title: 新的 DataValues 系统
description:
  新的 DataValues 系统设计 RFC
---

:::tip
**你知道吗？** 这份 RFC 中的内容已经过时，Databend 现在拥有一个正式的类型系统。

**了解更多**

- [RFC: 正式类型系统](https://github.com/datafuselabs/databend/discussions/5438)
- [重构: 合并新表达式](https://github.com/datafuselabs/databend/pull/9411)
:::

## 摘要

### 当前 `DataType` 的不足


- `DataType` 是一个枚举类型，我们必须在匹配后使用特定类型。例如，如果我们想根据 `DataType` 创建反序列化器/序列化器，我们应该始终进行匹配。这并不意味着匹配不是必要的。如果我们想要为 `DataType` 添加越来越多的函数，匹配可能会非常烦人。

- `DataType` 表示为枚举类型，我们不能将其用作泛型参数。

- `DataType` 可能涉及一些嵌套的数据类型，例如 `DataType::Struct`，但我们将 `DataField` 放在 `DataType` 内部，这在逻辑上是不合理的。

- 难以将属性放入基于枚举的 `DataType` 中，例如可空属性 #3726 #3769

### 关于列（Series/Column/Array）的概念过多

- DataColumn 是一个枚举，包括 `Constant(value)` 和 `Array(Series)`
```rust
pub enum DataColumn {
    // 值的数组。
    Array(Series),
    // 单个值。
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

- 对于函数，我们必须考虑 `Column` 的 `Constant` 情况，因此有许多分支匹配。
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


### 将 `DataType` 引入为一个特征

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

可空是 `DataType` 的一个特殊情况，它是 `DataType` 的一个包装器。

```rust

pub struct DataTypeNull {inner: DataTypeImpl}
```

### 简化 `DataValue`

```rust
pub enum DataValue {
    /// 基本类型。
    Null,
    Boolean(bool),
    Int64(i64),
    UInt64(u64),
    Float64(f64),
    String(Vec<u8>),
    // 容器结构。
    Array(Vec<DataValue>),
    Struct(Vec<DataValue>),
}
```

`DataValue` 可以根据其值转换为适当的 `DataType`。

```rust
// 转换为最小化的数据类型
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

此外，`DataValue` 可以转换为 Rust 原始值，反之亦然。

### 将 `Series/Array/Column` 统一为 `Column`

- `Column` 作为一个特征

```rust
pub type ColumnRef = Arc<dyn Column>;
pub trait Column: Send + Sync {
    fn as_any(&self) -> &dyn Any;
    /// 列包含的数据类型。它是一个底层的物理类型：
    /// Date 的 UInt16，DateTime 的 UInt32，等等。
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

- 引入 `常量列`

> `常量列` 是单个值（大小 = 1）的 `列` 的包装器
```rust
#[derive(Clone)]
pub struct ConstColumn {
    length: usize,
    column: ColumnRef,
}
impl Column for ConstColumn {..}
```

- 引入 `可空列`

> `可空列` 是 `列` 的包装器，并保留一个额外的位图以指示空值。

```rust
pub struct NullableColumn {
    validity: Bitmap,
    column: ColumnRef,
}
impl Column for NullableColumn {..}
```

- 从 Arrow 的列格式转换或转换为 Arrow 的列格式没有额外成本。

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

- 将 `Series` 保留为一个工具结构体，这有助于快速生成列。

```rust
// 可空列从选项创建
let column = Series::from_data(vec![Some(1i8), None, Some(3), Some(4), Some(5)]);

// 非可空列
let column = Series::from_data(vec![1，2，3，4);
```

- 向下转型为特定的 `Column`
```rust
impl Series {
    /// 获取指向此 Series 底层数据的指针。
    /// 对于快速比较很有用。
    /// # 安全性
    /// 假设 `column` 是 T 类型。
    pub unsafe fn static_cast<T>(column: &ColumnRef) -> &T {
        let object = column.as_ref();
        &*(object as *const dyn Column as *const T)
    }

    pub fn check_get<T: 'static + Column>(column: &ColumnRef) -> Result<&T> {
        let arr = column.as_any().downcast_ref::<T>().ok_or_else(|| {
            ErrorCode::UnknownColumn(format!(
                "向下转型列错误，列类型: {:?}",
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

## 待办事项

- 使 `datavalues2` 更加成熟。
- 将 `datavalues2` 合并进 Databend。