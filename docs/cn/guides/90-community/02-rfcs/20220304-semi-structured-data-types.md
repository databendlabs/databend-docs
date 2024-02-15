---
title: 半结构化数据类型
description:
  半结构化数据类型设计 RFC
---

## 摘要

### 当前 `DataType` 的不足


- `DataType` 是一个枚举类型，我们必须在匹配后使用特定类型。例如，如果我们想通过 `DataType` 创建反序列化器/序列化器，我们应该总是进行匹配。这并不意味着匹配不是必要的。如果我们想为 `DataType` 添加越来越多的功能，匹配可能会非常烦人。

- `DataType` 表示为枚举类型，我们不能将其用作泛型参数。

- `DataType` 可能涉及一些嵌套的数据类型，例如 `DataType::Struct`，但我们将 `DataField` 放在 `DataType` 内部，这在逻辑上是不合理的。

- 难以将属性放入基于枚举的 `DataType` 中，例如可空属性 #3726 #3769

### 关于列的概念过多（Series/Column/Array）

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

## 摘要

半结构化数据类型用于表示无模式的数据格式，如 JSON、XML 等。
为了与 [Snowflake 的 SQL 语法](https://docs.snowflake.com/en/sql-reference/data-types-semistructured.html) 兼容，我们支持以下三种半结构化数据类型：

- `Variant`：一个带标签的通用类型，可以存储任何其他类型的值，包括 `Object` 和 `Array`。
- `Object`：用于表示键值对的集合，其中键是非空字符串，值是 `Variant` 类型的值。
- `Array`：用于表示任意大小的密集或稀疏数组，其中索引是非负整数（最大为 2^31-1），值是 `Variant` 类型。

由于 `Object` 和 `Array` 可以被视为 `Variant` 的一种类型，以下介绍主要以 `Variant` 为例。

### 示例

以下示例展示了如何创建一个包含 `VARIANT`、`ARRAY` 和 `OBJECT` 数据类型的表，插入和查询一些测试数据。

```sql
CREATE TABLE test_semi_structured (
    var variant,
    arr array,
    obj object
);

INSERT INTO test_semi_structured (var, arr, obj)
SELECT 1, array_construct(1, 2, 3)
    , parse_json(' { "key1": "value1", "key2": "value2" } ');

INSERT INTO test_semi_structured (var, arr, obj)
SELECT to_variant('abc')
    , array_construct('a', 'b', 'c')
    , parse_json(' { "key1": [1, 2, 3], "key2": ["a", "b", "c"] } ');


SELECT * FROM test_semi_structured;

+-------+-------------------+----------------------------------------------------+
| var   | arr               | obj                                                |
+-------+-------------------+----------------------------------------------------+
| 1     | [ 1, 2, 3 ]       | { "key1": "value1", "key2": "value2" }             |
| "abc" | [ "a", "b", "c" ] | { "key1": [ 1, 2, 3 ], "key2": [ "a", "b", "c" ] } |
+-------+-------------------+----------------------------------------------------+
```

## 设计细节

### 数据存储格式

为了将 `Variant` 类型值以带有模式的 `parquet` 格式文件存储，我们需要对原始原始值进行一些转换。我们有以下两种选择：

#### 将数据存储在一个列中，以 JSON 或类似二进制 JSON 格式

JSON（JavaScript 对象表示法）是最常见的半结构化格式，可以表示任意复杂的层次值。它非常适合表示这种类型的半结构化数据。`Variant` 类型的数据可以编码为 JSON 格式并存储为原始字符串值。
JSON 格式的主要缺点是每次访问都需要对原始字符串进行昂贵的解析，因此有几种优化的类二进制 JSON 格式来提高解析速度和单键访问。
例如，MongoDB 和 PostgreSQL 分别使用 [BSON](https://bsonspec.org/) 和 [jsonb](https://www.postgresql.org/docs/14/datatype-json.html) 来以 JSON 格式存储数据。
[UBJSON](https://ubjson.org/) 也是一个兼容的二进制 JSON 格式规范，它可以提供通用兼容性，使用起来和 JSON 一样简单，同时更快更高效。
所有这些二进制 JSON 格式都有更好的性能，唯一的问题是它们缺乏好的 Rust 实现库。

#### 将数据的每个唯一键存储在子列中

尽管 JSON 格式可以表示任意数据，实际上，JSON 数据通常由机器生成，因此我们可以预测 Shema 和结构。
基于这个特点，我们可以将 JSON 数据中的每个唯一键提取并展平为多个独立的虚拟子列。

例如，假设我们有一个名为 `tweet` 的列，并存储以下 JSON 数据：

```json
{"id":1, "date": "1/11", type: "story", "score": 3, "desc": 2, "title": "...", "url": "..."}
{"id":2, "date": "1/12", type: "poll", "score": 5, "desc": 2, "title": "..."}
{"id":3, "date": "1/13", type: "pollop", "score": 6, "poll": 2, "title": "..."}
{"id":4, "date": "1/14", type: "story", "score": 1, "desc": 1, "title": "...", "url": "..."}
{"id":5, "date": "1/15", type: "comment", "parent": 4, "text": "..."}
{"id":6, "date": "1/16", type: "comment", "parent": 1, "text": "..."}
{"id":7, "date": "1/17", type: "pollop", "score": 3, "poll": 2, "title": "..."}
{"id":8, "date": "1/18", type: "comment", "parent": 1, "text": "..."}
```

这个列可以被拆分为 10 个虚拟子列：`tweet.id`、`tweet.date`、`tweet.type`、`tweet.score`、`tweet.desc`、`tweet.title`、`tweet.url`、`tweet.parent`、`tweet.text`、`tweet.poll`。
每个子列的数据类型也可以从值中自动推断出来，然后我们可以自动创建这些子列并插入相应的值。

这种存储格式的主要优点是查询数据时不需要解析原始 JSON 字符串，这可以大大加快查询处理速度。
缺点是插入数据时需要额外处理，且每行数据的模式不完全相同。在一些差异较大的场景中，许多子列数据将是 Null。
为了在各种场景中拥有良好的性能和平衡，我们可以参考论文 [JSON Tiles](https://db.in.tum.de/people/sites/durner/papers/json-tiles-sigmod21.pdf) 中介绍的优化算法。

从性能的角度来看，更好的解决方案是以类二进制 JSON 格式存储数据，并将一些频繁查询的唯一键作为子列提取出来。
然而，为了简化开发，我们在第一个版本中使用 JSON 格式。
类二进制 JSON 格式和单独存储的子列将在未来的优化版本中采用。

### 数据类型



将三个新值 `Variant`、`VariantArray`、`VariantObject` 添加到枚举 `TypeID` 中，分别支持这三种半结构化数据类型。
由于我们现在有一个称为 `Array` 的值，我们将半结构化的 `Array` 类型命名为 `VariantArray`，以便与它区分。
为这些类型定义相应的结构，并实现特征 `DataType`。
这些类型对应的 `PhysicalTypeID` 是 `String`，JSON 值将被转换为原始字符串进行存储。

```rust
pub enum TypeID {
    ...
    Variant
    VariantArray
    VariantObject
}

pub struct VariantType {}

pub struct VariantArrayType {}

pub struct VariantObjectType {}

```

### 对象列

目前 `Column` 仅为基本类型、自定义结构或像 `serde_json::Value` 这样的枚举实现，没有适合存储的 `Column` 实现。
定义 `ObjectColumn` 和 `MutableObjectColumn` 作为通用结构来存储自定义数据类型，并分别实现特征 `Column` 和 `MutableColumn`。
`ObjectType` 可以是任何自定义类型的结构或枚举，我们可以通过指定参数为 `serde_json::Value` 来定义 `JsonColumn`。
所有的 `variant` 数据将自动转换为 `serde_json::Value` 并生成一个 `JsonColumn`。
其他自定义数据类型如 BitmapColumn 未来也可以轻松支持。

```rust
#[derive(Clone)]
pub struct ObjectColumn<T: ObjectType> {
    values: Vec<T>,
}

#[derive(Debug)]
pub struct MutableObjectColumn<T: ObjectType> {
    data_type: DataTypeImpl,
    pub(crate) values: Vec<T>,
}

type JsonColumn = ObjectColumn<serde_json::Value>;

```

## 待办事项

- 使用更好的存储格式来提高查询性能