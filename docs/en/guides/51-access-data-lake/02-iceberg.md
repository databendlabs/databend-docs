---
title: Apache Iceberg
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend supports the integration of an [Apache Iceberg](https://iceberg.apache.org/) catalog, enhancing its compatibility and versatility for data management and analytics. This extends Databend's capabilities by seamlessly incorporating the powerful metadata and storage management capabilities of Apache Iceberg into the platform.

## Datatype Mapping

This table maps data types between Apache Iceberg and Databend. Please note that Databend does not currently support Iceberg data types that are not listed in the table.

| Apache Iceberg                  | Databend                |
| ------------------------------- | ----------------------- |
| BOOLEAN                         | [BOOLEAN](/sql/sql-reference/data-types/boolean)                 |
| INT                             | [INT32](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| LONG                            | [INT64](/sql/sql-reference/data-types/numeric#integer-data-types)                   |
| DATE                            | [DATE](/sql/sql-reference/data-types/datetime)                    |
| TIMESTAMP/TIMESTAMPZ            | [TIMESTAMP](/sql/sql-reference/data-types/datetime)               |
| FLOAT                           | [FLOAT](/sql/sql-reference/data-types/numeric#floating-point-data-types)                  |
| DOUBLE                          | [DOUBLE](/sql/sql-reference/data-types/numeric#floating-point-data-type)                  |
| STRING/BINARY                   | [STRING](/sql/sql-reference/data-types/string)                  |
| DECIMAL                         | [DECIMAL](/sql/sql-reference/data-types/decimal)                 |
| ARRAY&lt;TYPE&gt;               | [ARRAY](/sql/sql-reference/data-types/array), supports nesting |
| MAP&lt;KEYTYPE, VALUETYPE&gt;       | [MAP](/sql/sql-reference/data-types/map)                     |
| STRUCT&lt;COL1: TYPE1, COL2: TYPE2, ...&gt; | [TUPLE](/sql/sql-reference/data-types/tuple)           |
| LIST                            | [ARRAY](/sql/sql-reference/data-types/array)                   |

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
TYPE=ICEBERG
CONNECTION=(
    TYPE='<connection_type>'
    ADDRESS='<address>'
    WAREHOUSE='<warehouse_location>'
    "<connection_parameter>"='<connection_parameter_value>'
    "<connection_parameter>"='<connection_parameter_value>'
    ...
);
```

| Parameter                    | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<catalog_name>`             | Yes       | The name of the catalog you want to create.                                                                                                                                                                                                                                                                                                                                                                           |
| `TYPE`                       | Yes       | Specifies the catalog type. For Iceberg, set to `ICEBERG`.                                                                                                                                                                                                                                                                                                                                                            |
| `CONNECTION`                 | Yes       | The connection parameters for the Iceberg catalog.                                                                                                                                                                                                                                                                                                                                                                    |
| `TYPE` (inside `CONNECTION`) | Yes       | The connection type. For Iceberg, it is typically set to `rest` for REST-based connection.                                                                                                                                                                                                                                                                                                                            |
| `ADDRESS`                    | Yes       | The address or URL of the Iceberg service (e.g., `http://127.0.0.1:8181`).                                                                                                                                                                                                                                                                                                                                            |
| `WAREHOUSE`                  | Yes       | The location of the Iceberg warehouse, usually an S3 bucket or compatible object storage system.                                                                                                                                                                                                                                                                                                                      |
| `<connection_parameter>`     | Yes       | Connection parameters to establish connections with external storage. The required parameters vary based on the specific storage service and authentication methods. See the table below for a full list of the available parameters. |

| Connection Parameter              | Description                                                                                                                            |
|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `s3.endpoint`                     | S3 endpoint.                                                                                                                           |
| `s3.access-key-id`                | S3 access key ID.                                                                                                                      |
| `s3.secret-access-key`            | S3 secret access key.                                                                                                                  |
| `s3.session-token`                | S3 session token, required when using temporary credentials.                                                                           |
| `s3.region`                       | S3 region.                                                                                                                             |
| `client.region`                   | Region to use for the S3 client, takes precedence over `s3.region`.                                                                    |
| `s3.path-style-access`            | S3 Path Style Access.                                                                                                                  |
| `s3.sse.type`                     | S3 Server-Side Encryption (SSE) type.                                                                                                  |
| `s3.sse.key`                      | S3 SSE key. If encryption type is `kms`, this is a KMS Key ID. If encryption type is `custom`, this is a base-64 AES256 symmetric key. |
| `s3.sse.md5`                      | S3 SSE MD5 checksum.                                                                                                                   |
| `client.assume-role.arn`          | ARN of the IAM role to assume instead of using the default credential chain.                                                           |
| `client.assume-role.external-id`  | Optional external ID used to assume an IAM role.                                                                                       |
| `client.assume-role.session-name` | Optional session name used to assume an IAM role.                                                                                      |
| `s3.allow-anonymous`              | Option to allow anonymous access (e.g., for public buckets/folders).                                                                   |
| `s3.disable-ec2-metadata`         | Option to disable loading credentials from EC2 metadata (typically used with `s3.allow-anonymous`).                                    |
| `s3.disable-config-load`          | Option to disable loading configuration from config files and environment variables.                                                   |

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

This example shows how to create an Iceberg catalog using a REST-based connection, specifying the service address, warehouse location (S3), and optional parameters like AWS region and custom endpoint:

```sql
CREATE CATALOG ctl
TYPE=ICEBERG
CONNECTION=(
    TYPE='rest'
    ADDRESS='http://127.0.0.1:8181'
    WAREHOUSE='s3://iceberg-tpch'
    "s3.region"='us-east-1'
    "s3.endpoint"='http://127.0.0.1:9000'
);
```