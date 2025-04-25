---
title: CREATE DICTIONARY
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.636"/>

Creates a dictionary that enables real-time data access from external sources. Dictionaries allow Databend to query data directly from external systems like MySQL and Redis without traditional ETL processes, ensuring data consistency and improving query performance.

## Syntax

```sql
CREATE [ OR REPLACE ] DICTIONARY [ IF NOT EXISTS ] <dictionary_name>
(
    <column_name1> <data_type1> [ DEFAULT <default-value-1> ],
    <column_name2> <data_type2> [ DEFAULT <default-value-2> ],
    ...
)
PRIMARY KEY <primary_key_column>
SOURCE(<source_type>(<source_parameters>))
```

When a dictionary is created, Databend establishes a connection to the specified external data source. The dictionary can then be queried using the `dict_get()` function to retrieve data directly from the source at query time.

| Parameter              | Description                                                                                                                                |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `<dictionary_name>`    | The name of the dictionary to be referenced in queries.                                                                                     |
| `<column_name>`        | The name of a column in the dictionary. These columns define the structure of data that can be retrieved from the external source.           |
| `<data_type>`          | The data type for each column. For MySQL sources, Databend supports boolean, string, and numeric types (including int, bigint, float32, float64). For Redis sources, only string type is supported. |
| `<default-value>`      | Optional default value for a column when no value is found in the external source. This ensures queries return meaningful results even when data is missing. |
| `<primary_key_column>` | The column used as the lookup key when querying the dictionary. This should correspond to a unique identifier in the external data source. |
| `<source_type>`        | The type of external data source. Currently supported: `MYSQL` or `REDIS`. Future versions will support additional sources. |
| `<source_parameters>`  | Connection and configuration parameters specific to the selected source type. |

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
| db_index  | No        | Specifies the Redis database index, default is 0. The index ranges from 0 to 15, as Redis supports 16 databases indexed from 0 to 15. |

## Examples

### MySQL Dictionary Example

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

### Redis Dictionary Example

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

## Usage with dict_get()

After creating a dictionary, you can query it using the `dict_get()` function:

```sql
-- Query student information using the dictionary
SELECT 
    student_id,
    dict_get(student_name_dict, 'student_name', to_string(student_id)) as student_name,
    course_id,
    dict_get(courses_dict, 'course_name', course_id) as course_name
FROM student_scores;
```

This approach enables real-time data integration across multiple sources without complex ETL processes.