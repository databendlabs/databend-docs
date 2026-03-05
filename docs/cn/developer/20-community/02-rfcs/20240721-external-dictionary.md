---
title: 外部字典
description: 此 RFC 提议在 Databend 中实现外部字典功能，以允许无缝访问来自外部源的数据。
---

- RFC PR: [datafuselabs/databend-docs#996](https://github.com/databendlabs/databend-docs/pull/996)
- Tracking Issue: [datafuselabs/databend#15901](https://github.com/databendlabs/databend/issues/15901)

## 概要

实现外部字典允许 Databend 访问来自其他外部数据源的数据。

## 动机

在 Databend 中访问来自 MySQL 等外部数据库的数据通常需要导出 MySQL 数据集，然后将其导入到 Databend 数据库中。当处理大量信息时，此过程会变得繁琐，并且可能由于频繁更新而导致不一致。

引入外部字典功能通过促进 Databend 和各种数据库系统之间的无缝集成来解决这些挑战。通过创建字典，可以直接访问外部数据集，从而实现实时修改，同时简化整体数据管理。

## 指导性解释

DICTIONARY 采用以下语法进行创建、删除和查询。

1. 创建一个名为 user_info 的字典。

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

3. 查询用于创建字典 user_info 的 SQL 语句。

```sql
SHOW CREATE DICTIONARY user_info;
```

4. 删除字典 user_info。

```sql
DROP DICTIONARY user_info;
```

您可以使用 `dict_get(dict_name, dict_field, dict_id)` 从字典中查询数据。

`dict_get` 函数接受三个参数：第一个是字典的名称，第二个是要查询的字段，第三个是查询字典的 ID。

## 参考级解释

DICTIONARY 的相关元数据存储在 Databend 的 meta 模块中，用于在执行 SQL 查询时检索必要的信息。

### 使用 protobuf 编码数据

Protocol Buffers (Protobuf) 是一种复杂的数据序列化框架，提供了一套特别有利于高性能计算环境的优势。其功能包括以紧凑的二进制格式高效存储数据、快速序列化和反序列化过程、跨语言支持以及用于数据结构的明确定义的模式。因此，Databend 使用 Protobuf 编码数据并将二进制结果转换为数据库。

一个示例 Protobuf 结构，封装了这项技术的本质，阐述如下：

```protobuf
syntax = "proto3";
package databend.meta;
//Describes the metadata of the dictionary
message DictionaryMeta {
  //Dictionary name
  string name = 1;
  //Dictionary data source
  string source = 2;
  //Dictionary configuration options
  map<string, string> options = 3;
  //The schema of a table, such as column data types and other meta info.
  DataSchema schema = 4;
  //ID of the primary key column
  u32 primary_column_id = 5;
}
```

### 查询 DICTIONARY 的数据

在 `async_function` 模块中定义 `DictionaryAsyncFunction`，以方便异步读取外部数据。

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
    // dictonary address, for examaple: mysql://root:123@0.0.0.0:3306/default
    url: String,
    // sql to get the value from source table.
    // for example: select name from user_info where id=1;
    query_sql: String,
    return_type: DataType,
    //Specify the maximum time to attempt a connection to the data source.
    connection_timeout: std::time::Duration,
    //Specify the maximum execution time for the query operation.
    query_timeout: std::time::Duration,
    //Used to store additional parameters that the query might require, such as the values for placeholders in the SQL query.
    params: Vec<ParameterValue>,
}
```

将 `async_function` 模块中的 `AsyncFunction` 重命名为 `AsyncFunctionDesc`，以避免与 AsyncFunction 的逻辑和物理计划发生命名冲突。此外，包括 `DictionaryAsyncFunction`。定义如下：

```rust
pub enum AsyncFunctionDesc {
     SequenceAsyncFunction(SequenceAsyncFunction),
     DictonaryAsyncFunction(DictionaryAsyncFunction),
}
```

通过添加 `AsyncFunctionDesc` 字段来更新逻辑和物理计划中的 `AsyncFunction` 定义。此过程重用现有逻辑来生成字典 AsyncFunction 逻辑和物理计划。

- 逻辑计划的结构如下：

```rust
pub struct AsyncFunction {
   pub func_name: String,
   pub display_name: String,
   pub arguments: Vec<String>,
   pub return_type: DataType,
   pub index: IndexType,
   pub desc: AsyncFunctionDesc,//Newly added property
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
   pub desc: AsyncFunctionDesc,//Newly added property
}
```

pipeline 中的 `Transform`，实际读取外部数据的地方，可以定义如下：

```rust
pub struct TransformDictionary {
     ctx: Arc<QueryContext>,
     dict_func: DictionaryAsyncFunction,
}
```

实现 `AsyncTransform` trait 的 `transform` 方法，并调用外部数据库以获取字典数据。主要过程如下图所示：

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-1.png" alt="Flowchart of getting external data" />

`dict_get` 函数的执行过程总结如下图所示：

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-2.png" alt="Flowchart of the dict_get" />

## 未解决的问题

- 是否可以使用算法来提高数据字典查询的速度？

## 未来的可能性

1. 用户可以通过外部字典连接多种类型的数据源，以从同一客户端对各种数据端点执行实时操作，例如文件、HTTP 接口以及其他数据库，如 ClickHouse、Redis、MongoDB 等。

   例如，如果数据源是本地 CSV 文件：

```sql
CREATE DICTIONARY dict_name
(
    ... -- attributes
)
SOURCE(FILE(path './user_files/os.csv' format 'CommaSeparated')) -- Source configuration
```

2. 添加更多用于操作数据字典的函数，例如 `dict_get_or_default`、`dict_get_or_null`、`dict_has` 等。

   例如，`dict_get_or_default(dict_name, dict_field, dict_id, default_value)` 包含一个额外的参数，用于在未找到目标数据时返回默认值。

3. 支持使用 TOML 格式配置内置字典。

## 参考

[Clickhouse Dictionary](https://clickhouse.com/docs/en/dictionary)
