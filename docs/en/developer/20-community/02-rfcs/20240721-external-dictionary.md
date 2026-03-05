---
title: External Dictionaries
description: This RFC proposes the implementation of an external dictionary feature in Databend to allow seamless access to data from external sources.
---

- RFC PR: [datafuselabs/databend-docs#996](https://github.com/databendlabs/databend-docs/pull/996)
- Tracking Issue: [datafuselabs/databend#15901](https://github.com/databendlabs/databend/issues/15901)

## Summary

Implementing External Dictionary allows Databend to access data from other external data sources.

## Motivation

Accessing data from external databases like MySQL within Databend often requires exporting the MySQL dataset and subsequently importing it into the Databend database. This procedure becomes burdensome when handling substantial amounts of information and may result in inconsistencies due to frequent updates.

The introduction of an external dictionary feature resolves these challenges by facilitating seamless integration between Databend and diverse database systems. Through dictionary creation, direct access to external datasets enables real-time modifcations while streamlining overall data management.

## Guide-level explanation

DICTIONARY employs the subsequent syntax for creation, deletion, and querying.

1. Create a Dictionary named user_info.

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

2. Query the existing dictionary.

```sql
SHOW DICTIONARIES;
```

3. Inquire about the SQL statement utilized for creating the dictionary user_info.

```sql
SHOW CREATE DICTIONARY user_info;
```

4. Delete the Dictionary user_info.

```sql
DROP DICTIONARY user_info;
```

You can use the `dict_get(dict_name, dict_field, dict_id)` to query data from a dictionary.

The `dict_get` function takes three arguments: the first is the name of the dictionary, the second is the field to query, and the third is the ID of the query dictionary.

## Reference-level explanation

The relevant metadata of the DICTIONARY is stored in the meta module of Databend and is used to retrieve the necessary information when executing SQL queries.

### Use protobuf to encode the data

Protocol Buffers (Protobuf), a sophisticated data serialization framework, provides a suite of benefits that are particularly advantageous for high-performance computing environments. Its capabilities include the efficient storage of data in a compact binary format, rapid serialization and deserialization processes, cross-language support, and a well-defined schema for data structures. Therefore, Databend uses Protobuf to encode the data and convert the binary results to the database.

An exemplar Protobuf structure, which encapsulates the essence of this technology, is articulated as follows:

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

### Query the data of the DICTIONARY

Define `DictionaryAsyncFunction` in the `async_function` module to facilitate asynchronous reading of external data.

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

Rename `AsyncFunction` in the `async_function` module to `AsyncFunctionDesc` to avoid naming conflicts with the logical and physical plan of AsyncFunction. Additionally, include `DictionaryAsyncFunction`. The definition is as follows:

```rust
pub enum AsyncFunctionDesc {
     SequenceAsyncFunction(SequenceAsyncFunction),
     DictonaryAsyncFunction(DictionaryAsyncFunction),
}
```

Update the `AsyncFunction` definition in both the logical and physical plans by adding the `AsyncFunctionDesc` field. This process reuses existing logic for generating dictionary AsyncFunction logical and physical plans.

- The struct of logical plan is as follows:

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

- The struct of physical plan is as follows:

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

The `Transform` in the pipeline, where the actual reading of external data takes place, can be defined as follows:

```rust
pub struct TransformDictionary {
     ctx: Arc<QueryContext>,
     dict_func: DictionaryAsyncFunction,
}
```

Implement the `transform` method of the `AsyncTransform` trait and call an external database to obtain dictionary data. The main process is illustrated in the following diagram:

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-1.png" alt="Flowchart of getting external data" />

The execution process of the `dict_get` function is summarized in the following diagram:

<img src="/img/rfc/20240721-external-dictionary/external-dictionary-2.png" alt="Flowchart of the dict_get" />

## Unresolved questions

- Can algorithms be employed to improve the speed of data dictionary queries?

## Future possibilities

1. Users can connect multiple types of data sources through the External Dictionary to perform real-time operations on various data endpoints from the same client, such as files, HTTP interfaces, and additional databases like ClickHouse, Redis, MongoDB, etc.

   For example, if the data source is a local CSV file:

```sql
CREATE DICTIONARY dict_name
(
    ... -- attributes
)
SOURCE(FILE(path './user_files/os.csv' format 'CommaSeparated')) -- Source configuration
```

2. Add more functions for operating data dictionaries, such as `dict_get_or_default`, `dict_get_or_null`, `dict_has`, etc.

   For instance, `dict_get_or_default(dict_name, dict_field, dict_id, default_value)` includes an additional parameter for the default value to be returned if the target data is not found.

3. Support configuring the built-in dictionary using the TOML format.

## Reference

[Clickhouse Dictionary](https://clickhouse.com/docs/en/dictionary)
