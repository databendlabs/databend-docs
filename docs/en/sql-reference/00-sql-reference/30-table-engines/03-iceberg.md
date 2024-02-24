---
title: Apache Iceberg Engine
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.262"/>

Databend's Apache Iceberg engine allows you to seamlessly query and analyze data in Apache Iceberg tables stored in your object storage. When you create a table with the Apache Iceberg engine in Databend, you specify a location where the data files of an Apache Iceberg table are stored. This setup allows you to gain direct access to the table and perform queries seamlessly from within Databend.

- Databend's Apache Iceberg engine currently supported read-only operations. This means that querying data from your Apache Iceberg tables is supported, while writing to the tables is not.
- The schema for a table created with the Apache Iceberg engine is set at the time of its creation. Any modifications to the schema of the original Apache Iceberg table require the recreation of the corresponding table in Databend to ensure synchronization.

## Syntax

```sql
CREATE TABLE <table_name> 
ENGINE = Iceberg 
LOCATION = 's3://<path_to_table>' 
CONNECTION_NAME = '<connection_name>'
```

Before creating a table with the Apache Iceberg engine, you need to create a connection object used to establish a connection with your S3 storage. To create a connection in Databend, use the [CREATE CONNECTION](../../10-sql-commands/00-ddl/13-connection/create-connection.md) command.

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
