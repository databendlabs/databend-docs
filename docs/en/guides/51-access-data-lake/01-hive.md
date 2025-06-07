---
title: Apache Hive
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend supports the integration of an [Apache Hive](https://hive.apache.org/) catalog, enhancing its compatibility and versatility for data management and analytics. This extends Databend's capabilities by seamlessly incorporating the powerful metadata and storage management capabilities of Apache Hive into the platform.

## Datatype Mapping

This table maps data types between Apache Hive and Databend. Please note that Databend does not currently support Hive data types that are not listed in the table.

| Apache Hive         | Databend             |
| ------------------- | -------------------- |
| BOOLEAN             | [BOOLEAN](/sql/sql-reference/data-types/boolean)              |
| TINYINT             | [TINYINT (INT8)](/sql/sql-reference/data-types/numeric#integer-data-types)       |
| SMALLINT            | [SMALLINT (INT16)](/sql/sql-reference/data-types/numeric#integer-data-types)     |
| INT                 | [INT (INT32)](/sql/sql-reference/data-types/numeric#integer-data-types)          |
| BIGINT              | [BIGINT (INT64)](/sql/sql-reference/data-types/numeric#integer-data-types)       |
| DATE                | [DATE](/sql/sql-reference/data-types/datetime)                 |
| TIMESTAMP           | [TIMESTAMP](/sql/sql-reference/data-types/datetime)            |
| FLOAT               | [FLOAT (FLOAT32)](/sql/sql-reference/data-types/numeric#floating-point-data-types)      |
| DOUBLE              | [DOUBLE (FLOAT64)](/sql/sql-reference/data-types/numeric#floating-point-data-types)     |
| VARCHAR             | [VARCHAR (STRING)](/sql/sql-reference/data-types/string)     |
| DECIMAL             | [DECIMAL](/sql/sql-reference/data-types/decimal)              |
| ARRAY&lt;TYPE&gt;    | [ARRAY](/sql/sql-reference/data-types/array), supports nesting |
| MAP&lt;KEYTYPE, VALUETYPE&gt; | [MAP](/sql/sql-reference/data-types/map)             |

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

This example demonstrates the creation of a catalog configured to interact with the Hive Metastore and access data stored on Amazon S3, located at 's3://databend-toronto/'.

```sql
CREATE CATALOG hive_ctl 
TYPE = HIVE 
CONNECTION =(
    METASTORE_ADDRESS = '127.0.0.1:9083' 
    URL = 's3://databend-toronto/' 
    ACCESS_KEY_ID = '<your_key_id>' 
    SECRET_ACCESS_KEY = '<your_secret_key>' 
);

SHOW CREATE CATALOG hive_ctl;

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Catalog │  Type  │                                                          Option                                                          │
├──────────┼────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ hive_ctl │ hive   │ METASTORE ADDRESS\n127.0.0.1:9083\nSTORAGE PARAMS\ns3 | bucket=databend-toronto,root=/,endpoint=https://s3.amazonaws.com │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```