---
title: External Dictionaries
description: This RFC proposes the implementation of an external dictionary feature in Databend to allow seamless access to data from external sources.
---

- RFC PR: [datafuselabs/databend-docs#996](https://github.com/datafuselabs/databend-docs/pull/996)
- Tracking Issue: [datafuselabs/databend#15901](https://github.com/datafuselabs/databend/issues/15901)

## Summary

Implementing External Dictionary allows Databend to access data from other external data sources.

## Motivation

To access data from other databases, such as MySQL, in Databend, it is typically necessary to export the MySQL data and then import it into the Databend database. When dealing with large volumes of data, this process can be cumbersome. Additionally, if the data changes frequently, the delay in importing can lead to inconsistencies.

The external dictionary feature addresses these issues by allowing Databend to seamlessly access data from other databases. By creating a dictionary, Databend can directly access external data sources, enabling real-time data modification and simplifying data management.

## Guide-level explanation

DICTIONARY uses the following syntax to create, delete, and query.

1. Create a Dictionary named user_info
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

2. Query the existing dictionary
   ```sql
   SHOW DICTIONARIES;
   ```

3. Query the sql statement used to create dictionary user_info
   ```sql
   SHOW CREATE DICTIONARY user_info;
   ```

4. Delete dictionary user_info

   ```sql
   DROP DICTIONARY user_info;
   ```

You can using the `dict_get(dict_name, dict_field, dict_id)`  function to query data from the dictionary.

`dict_get` takes three arguments, the first is the name of the dictionary, the second is the field of the query, and the third is the id of the query dictionary.

## Reference-level explanation

The relevant metadata of the DICTIONARY is stored in the meta module of the databend and is used to retrieve the relevant information when executing SQL queries.

### Use protobuf to encode the data

Protobuf has the advantages of storing data in binary format, fast serialization and deserialization, support for multiple programming languages, and the ability to clearly define the structure of data. Therefore, the databend uses protobuf to encode the data and convert the binary results to the database.

An example of the protobuf structure is defined as follows:

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

Define DictionaryAsyncFunction under the async_function module for asynchronously reading external data.

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

Change the name of AsyncFunction in the async_function module to AsyncFunctionDesc to avoid the same name as the logical and physical plan of AsyncFunction and add DictionaryAsyncFunction. The definition is as follows:

```rust
pub enum AsyncFunctionDesc {
     SequenceAsyncFunction(SequenceAsyncFunction),
     DictonaryAsyncFunction(DictionaryAsyncFunction),
}
```

Modify the AsyncFunction definition of a logical plan and a physical plan by adding the AsyncFunctionDesc field.The process that generates dictionary AsyncFunction logical and physical plans reuses existing logic.

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

The Transform in the pipline is where the actual reading of the external data takes place. It can be defined like this:

```rust
pub struct TransformDictionary {
     ctx: Arc<QueryContext>,
     dict_func: DictionaryAsyncFunction,
}
```

Implement the transform method of the AsyncTransform Trait and call an external database to obtain dictionary data. The main process is shown in the following figure:

![Flowchart of getting external data](/img/rfc/20240721-external-dictionary/external-dictionary-1.png)

The execution process of the `dict_get` is summarized as follows:

![Flowchart of the dict_get](/img/rfc/20240721-external-dictionary/external-dictionary-2.png)

## Unresolved questions

- In addition to supporting protobuf file definitions,is xml file configuration also supported?
- Use some algorithms to improve the speed of data dictionary queries.

## Future possibilities

1. Users can connect multiple types of data sources through External Dictionary to achieve real-time operations on multiple data ends from the same client,such as files, HTTP interfaces, and more databases like ClickHouse, Redis, MongoDB, etc.

   For example, the data source is from a local csv file.

   ```sql
   CREATE DICTIONARY dict_name
   (
       ... -- attributes
   )
   SOURCE(FILE(path './user_files/os.csv' format 'CommaSeparated')) -- Source configuration
   ```

2. Add more functions for operating data dictionaries, such as dict_get_or_default, dict_get_or_null, dict_has, etc.

   Taking `dict_get_or_default(dict_name, dict_field, dict_id, default_value)` as an example, the newly added last parameter refers to the default value returned when the target data is not obtained.


## Reference

[Clickhouse Dictionary](https://clickhouse.com/docs/en/dictionary)
