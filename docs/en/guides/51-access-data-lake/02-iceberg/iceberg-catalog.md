---
title: Iceberg Catalog
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend supports the integration of an [Apache Iceberg](https://iceberg.apache.org/) catalog, enhancing its compatibility and versatility for data management and analytics. This extends Databend's capabilities by seamlessly incorporating the powerful metadata and storage management capabilities of Apache Iceberg into the platform.

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

## Managing Catalogs

Databend provides you the following commands to manage catalogs:

- [CREATE CATALOG](#create-catalog)
- [SHOW CREATE CATALOG](#show-create-catalog)
- [SHOW CATALOGS](#show-catalogs)
- [USE CATALOG](#use-catalog)

### CREATE CATALOG

Defines and establishes a new catalog in the Databend query engine.

#### Syntax

```sql
CREATE CATALOG <catalog_name>
TYPE = <catalog_type>
CONNECTION = (
    METASTORE_ADDRESS = '<hive_metastore_address>'
    URL = '<data_storage_path>'
    <connection_parameter> = '<connection_parameter_value>'
    <connection_parameter> = '<connection_parameter_value>'
    ...
)
```

| Parameter             | Required? | Description                                                                                                               | 
|-----------------------|-----------|---------------------------------------------------------------------------------------------------------------------------| 
| TYPE                  | Yes       | Type of the catalog: 'HIVE' for Hive catalog or 'ICEBERG' for Iceberg catalog.                                      | 
| METASTORE_ADDRESS     | No        | Hive Metastore address. Required for Hive catalog only.| 
| URL                   | Yes       | Location of the external storage linked to this catalog. This could be a bucket or a folder within a bucket. For example, 's3://databend-toronto/'.                       | 
| connection_parameter  | Yes       | Connection parameters to establish connections with external storage. The required parameters vary based on the specific storage service and authentication methods. Refer to [Connection Parameters](/sql/sql-reference/connect-parameters) for detailed information. |

:::note
To read data from HDFS, you need to set the following environment variables before starting Databend. These environment variables ensure that Databend can access the necessary Java and Hadoop dependencies to interact with HDFS effectively. Make sure to replace "/path/to/java" and "/path/to/hadoop" with the actual paths to your Java and Hadoop installations, and adjust the CLASSPATH to include all the required Hadoop JAR files.
```shell
export JAVA_HOME=/path/to/java
export LD_LIBRARY_PATH=${JAVA_HOME}/lib/server:${LD_LIBRARY_PATH}
export HADOOP_HOME=/path/to/hadoop
export CLASSPATH=/all/hadoop/jar/files
```
:::

### SHOW CREATE CATALOG

Returns the detailed configuration of a specified catalog, including its type and storage parameters.

#### Syntax

```sql
SHOW CREATE CATALOG <catalog_name>;
```

### SHOW CATALOGS

Shows all the created catalogs.

#### Syntax

```sql
SHOW CATALOGS [LIKE '<pattern>']
```

### USE CATALOG

Switches the current session to the specified catalog.

#### Syntax

```sql
USE CATALOG <catalog_name>
```

## Usage Examples

This example demonstrates the creation of a catalog configured to interact with an Iceberg data storage located in MinIO at 's3://databend/iceberg/'.

```sql
CREATE CATALOG iceberg_ctl
TYPE = ICEBERG
CONNECTION = (
    URL = 's3://databend/iceberg/'
    AWS_KEY_ID = 'minioadmin'
    AWS_SECRET_KEY = 'minioadmin'
    ENDPOINT_URL = 'http://127.0.0.1:9000'
    REGION = 'us-east-2'
);

SHOW CREATE CATALOG iceberg_ctl;

┌─────────────┬─────────┬────────────────────────────────────────────────────────────────────────────────────────┐
│  Catalog    │  Type   │  Option                                                                                │
├─────────────┼─────────┼────────────────────────────────────────────────────────────────────────────────────────┤
│ iceberg_ctl │ iceberg │ STORAGE PARAMS s3 | bucket=databend, root=/iceberg/, endpoint=http://127.0.0.1:9000    │
└─────────────┴─────────┴────────────────────────────────────────────────────────────────────────────────────────┘
```