---
title: 外部字典
description: 本RFC提议在Databend中实现外部字典功能，以允许无缝访问来自外部数据源的数据。

---

- RFC PR: [datafuselabs/databend-docs#996](https://github.com/datafuselabs/databend-docs/pull/996)
- 跟踪问题: [datafuselabs/databend#15901](https://github.com/datafuselabs/databend/issues/15901)

## 概要

实现外部字典功能允许Databend访问来自其他外部数据源的数据。

## 动机

在Databend中访问来自外部数据库（如MySQL）的数据通常需要导出MySQL数据集，然后将其导入Databend数据库。当处理大量信息时，这一过程变得繁琐，并且由于频繁更新可能导致不一致。

引入外部字典功能通过简化Databend与多种数据库系统之间的无缝集成，解决了这些挑战。通过字典创建，直接访问外部数据集实现了实时修改，同时简化了整体数据管理。

## 指南级解释

DICTIONARY使用以下语法进行创建、删除和查询。

1. 创建名为user_info的字典。

```sql
CREATE DICTIONARY user_info(
  user_id UInt86,
  user_name String,
  user_address String
)
primary key(user_id)
SOURCE(MYSQL(
  host '[localhost](http://localhost/)'
  user 'root'
  password 'root'
  db 'db_name'
  table 'table_name'
));
```

2. 查询现有字典。

```sql
SHOW DICTIONARIES;
```

3. 查询用于创建字典user_info的SQL语句。

```sql
SHOW CREATE DICTIONARY user_info;
```

4. 删除字典user_info。

```sql
DROP DICTIONARY user_info;
```

您可以使用`dict_get(dict_name, dict_field, dict_id)`从字典中查询数据。

`dict_get`函数接受三个参数：第一个是字典的名称，第二个是要查询的字段，第三个是查询字典的ID。

## 参考级解释

DICTIONARY的相关元数据存储在Databend的meta模块中，并在执行SQL查询时用于检索必要信息。

### 使用protobuf编码数据

Protocol Buffers（Protobuf）是一种高级数据序列化框架，为高性能计算环境提供了一系列优势。其功能包括以紧凑的二进制格式高效存储数据、快速序列化和反序列化过程、跨语言支持以及为数据结构提供定义良好的模式。因此，Databend使用Protobuf来编码数据并将二进制结果转换为数据库。

一个体现该技术精髓的示例Protobuf结构如下：

```protobuf
syntax = "proto3";
package databend.meta;
//描述字典的元数据
message DictionaryMeta {
  //字典名称
  string name = 1;
  //字典数据源
  string source = 2;
  //字典配置选项
  map<string, string> options = 3;
  //表的架构，如列数据类型和其他元信息。
  DataSchema schema = 4;
  //主键列的ID
  u32 primary_column_id = 5; 
}
```

### 查询DICTIONARY的数据

在`async_function`模块中定义`DictionaryAsyncFunction`，以实现对外部数据的异步读取。

```rust
enum DictionarySourceEngine {
     MySQL,
     PostgreSQL,
     ..
}
```

```rust
pub struct DictionaryAsyncFunction {
    engine: DictionarySourceEngine,
    // 字典地址，例如：mysql://root:123@0.0.0.0:3306/default
    url: String,
    // 从源表获取值的SQL。
    // 例如：select name from user_info where id=1;
    query_sql: String,
    return_type: DataType,
    //指定连接数据源的最大尝试时间。
    connection_timeout: std::time::Duration,
    //指定查询操作的最大执行时间。
    query_timeout: std::time::Duration,
    //用于存储查询可能需要的附加参数，例如SQL查询中的占位符值。
    params: Vec<ParameterValue>,
}
```

将`async_function`模块中的`AsyncFunction`重命名为`AsyncFunctionDesc`，以避免与AsyncFunction的逻辑和物理计划命名冲突。同时，包含`DictionaryAsyncFunction`。定义如下：

```rust
pub enum AsyncFunctionDesc {
     SequenceAsyncFunction(SequenceAsyncFunction),
     DictonaryAsyncFunction(DictionaryAsyncFunction),
}
```

在逻辑和物理计划中更新`AsyncFunction`的定义，添加`AsyncFunctionDesc`字段。此过程重用现有逻辑生成字典AsyncFunction的逻辑和物理计划。

- 逻辑计划的结构如下：

```rust
pub struct AsyncFunction {
   pub func_name: String,
   pub display_name: String,
   pub arguments: Vec<String>,
   pub return_type: DataType,
   pub index: IndexType,
   pub desc: AsyncFunctionDesc,//新增属性
}
```

- 物理计划的结构如下：

```rust
pub struct AsyncFunction {
   pub plan_id: u32,
   pub func_name: String,
   pub display_name: String,
   pub arguments: Vec<String>,
   pub return_type: DataType,
   pub schema: DataSchemaRef,
   pub input: Box<PhysicalPlan>,
   pub stat_info: Option<PlanStatsInfo>,
   pub desc: AsyncFunctionDesc,//新增属性
}
```

在实际读取外部数据的pipeline中的`Transform`可以定义如下：

```rust
pub struct TransformDictionary {
     ctx: Arc<QueryContext>,
     dict_func: DictionaryAsyncFunction,
}
```

实现`AsyncTransform`特性的`transform`方法，并调用外部数据库获取字典数据。主要过程如下图所示：

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-1.png" alt="获取外部数据的流程图" style={{zoom:"80%"}} />

`dict_get`函数的执行过程总结如下图：

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-2.png" alt="dict_get的流程图" style={{zoom:"80%"}} />

## 未解决问题

- 是否可以使用算法来提高数据字典查询的速度？

## 未来可能性

1. 用户可以通过外部字典连接多种类型的数据源，从同一客户端对各种数据端点进行实时操作，如文件、HTTP接口和其他数据库（如ClickHouse、Redis、MongoDB等）。

   例如，如果数据源是本地CSV文件：

```sql
CREATE DICTIONARY dict_name
(
    ... -- 属性
)
SOURCE(FILE(path './user_files/os.csv' format 'CommaSeparated')) -- 源配置
```

2. 添加更多操作数据字典的函数，如`dict_get_or_default`、`dict_get_or_null`、`dict_has`等。

   例如，`dict_get_or_default(dict_name, dict_field, dict_id, default_value)`包含一个额外的默认值参数，如果未找到目标数据则返回该值。

3. 支持使用TOML格式配置内置字典。

## 参考

[Clickhouse Dictionary](https://clickhouse.com/docs/en/dictionary)
