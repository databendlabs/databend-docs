---
title: CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

Creates a dictionary using a specified source.

## Syntax

```sql
CREATE DICTIONARY <dictionary_name>
(
    <column_name1> <data_type1>,
    <column_name2> <data_type2>,
    ...
)
PRIMARY KEY <primary_key_column>
SOURCE(<source_type>(<source_parameters>))
```

| Parameter              | Description                                                                                                                                |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `<dictionary_name>`    | The name of the dictionary.                                                                                                                |
| `<column_name>`        | The name of a column in the dictionary.                                                                                                    |
| `<data_type>`          | The type of data stored in the column.                                                                                                     |
| `<primary_key_column>` | The primary key column used for fast lookups. This key should correspond to a unique value for each entry in the dictionary.               |
| `<source_type>`        | Specifies the type of data source, `MYSQL` or `REDIS`. |
| `<source_parameters>`  | Defines the configuration parameters required for the specified source type. |

### MySQL Parameters

The following table lists the required and optional parameters for configuring a MySQL data source:

| Parameter | Required? | Description                                                                      |
|-----------|-----------|----------------------------------------------------------------------------------|
| host      | Yes       | The IP address or hostname of the MySQL server.                                  |
| port      | Yes       | The port on which the MySQL server is listening.                                 |
| username  | Yes       | The username used to connect to the MySQL server.                                |
| password  | Yes       | The password associated with the username to access the MySQL server.            |
| db        | Yes       | The name of the database on the MySQL server from which the data will be pulled. |
| table     | Yes       | The name of the table in the database where the data resides.                    |

### Redis Parameters

The following table lists the required and optional parameters for configuring a Redis data source:

| Parameter | Required? | Description                                                                                                                                 |
|-----------|-----------|---------------------------------------------------------------------------------------------------------------------------------------------|
| host      | Yes       | The hostname or IP address of the Redis server.                                                                                             |
| port      | Yes       | The port number of the Redis server.                                                                                                        |
| username  | No        | Username if the Redis server requires user authentication.                                                                                  |
| password  | No        | The password for user authentication.                                                                                                       |
| db_index  | No        | Specifies the Redis database index, default is 0. The index must be within the range of 0 to the maximum number of Redis databases minus 1. |

## Examples

The following example creates a dictionary named `courses_dict` using data from a MySQL database:

```sql
CREATE DICTIONARY courses_dict
(
    course_id INT,
    course_name STRING
)
PRIMARY KEY course_id
SOURCE(MYSQL(
    host='localhost'
    port='3306'
    username='root'
    password='123456'
    db='test'
    table='courses'
));
```

The following example creates a dictionary named `student_name_dict` using data from a Redis data source:

```sql
CREATE DICTIONARY student_name_dict
(
    student_id STRING,
    student_name STRING
)
PRIMARY KEY student_id
SOURCE(REDIS(
    host='127.0.0.1'
    port='6379'
));
```