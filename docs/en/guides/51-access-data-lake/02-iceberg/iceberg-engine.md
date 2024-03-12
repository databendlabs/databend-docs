---
title: Table Engine
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

Databend's [Apache Iceberg](https://iceberg.apache.org/) engine allows you to seamlessly query and analyze data in Apache Iceberg tables stored in your object storage. When you create a table with the Apache Iceberg engine in Databend, you specify a location where the data files of an Apache Iceberg table are stored. This setup allows you to gain direct access to the table and perform queries seamlessly from within Databend.

- Databend's Apache Iceberg engine currently supported read-only operations. This means that querying data from your Apache Iceberg tables is supported, while writing to the tables is not.
- The schema for a table created with the Apache Iceberg engine is set at the time of its creation. Any modifications to the schema of the original Apache Iceberg table require the recreation of the corresponding table in Databend to ensure synchronization.

## Datatype Mapping

This table maps data types between Apache Iceberg and Databend. Please note that Databend does not currently support Iceberg data types that are not listed in the table.

| Apache Iceberg                  | Databend                |
| ------------------------------- | ----------------------- |
| BOOLEAN                         | [BOOLEAN](/sql/sql-reference/data-types/data-type-logical-types)                 |
| INT                             | [INT32](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)                   |
| LONG                            | [INT64](/sql/sql-reference/data-types/data-type-numeric-types#integer-data-types)                   |
| DATE                            | [DATE](/sql/sql-reference/data-types/data-type-time-date-types)                    |
| TIMESTAMP/TIMESTAMPZ            | [TIMESTAMP](/sql/sql-reference/data-types/data-type-time-date-types)               |
| FLOAT                           | [FLOAT](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-types)                  |
| DOUBLE                          | [DOUBLE](/sql/sql-reference/data-types/data-type-numeric-types#floating-point-data-type)                  |
| STRING/BINARY                   | [STRING](/sql/sql-reference/data-types/data-type-string-types)                  |
| DECIMAL                         | [DECIMAL](/sql/sql-reference/data-types/data-type-decimal-types)                 |
| ARRAY&lt;TYPE&gt;               | [ARRAY](/sql/sql-reference/data-types/data-type-array-types), supports nesting |
| MAP&lt;KEYTYPE, VALUETYPE&gt;       | [MAP](/sql/sql-reference/data-types/data-type-map)                     |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/data-type-tuple-types)           |
| LIST                            | [ARRAY](/sql/sql-reference/data-types/data-type-array-types)                   |

## Syntax

```sql
CREATE TABLE <table_name> 
ENGINE = Iceberg 
LOCATION = 's3://<path_to_table>' 
CONNECTION_NAME = '<connection_name>'
```

Before creating a table with the Apache Iceberg engine, you need to create a connection object used to establish a connection with your S3 storage. To create a connection in Databend, use the [CREATE CONNECTION](/sql/sql-reference/connect-parameters) command.

## Examples

```sql
--Set up connection
CREATE CONNECTION my_s3_conn 
STORAGE_TYPE = 's3' 
ACCESS_KEY_ID ='your-ak' SECRET_ACCESS_KEY ='your-sk';

-- Create table with Apache Iceberg engine
CREATE TABLE test_iceberg
ENGINE = Iceberg 
LOCATION = 's3://testbucket/iceberg_ctl/iceberg_db/iceberg_tbl/' 
CONNECTION_NAME = 'my_s3_conn';
```
