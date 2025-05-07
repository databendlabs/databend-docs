---
title: Apache Iceberg
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.668"/>

Databend supports the integration of an [Apache Iceberg](https://iceberg.apache.org/) catalog, enhancing its compatibility and versatility for data management and analytics. This extends Databend's capabilities by seamlessly incorporating the powerful metadata and storage management capabilities of Apache Iceberg into the platform.

## Quick Start with Apache Iceberg

If you want to quickly try out Apache Iceberg and experiment with table operations locally, a [Docker-based starter project](https://github.com/databendlabs/iceberg-quick-start) is available. This setup allows you to:

- Run Spark with Iceberg support
- Use a REST catalog (Iceberg REST Fixture)
- Simulate an S3-compatible object store using MinIO
- Load sample TPC-H data into Iceberg tables for query testing

### Prerequisites

Before you start, make sure Docker and Docker Compose are installed on your system.

### Start Iceberg Environment

```bash
git clone https://github.com/databendlabs/iceberg-quick-start.git
cd iceberg-quick-start
docker compose up -d
```

This will start the following services:

- `spark-iceberg`: Spark 3.4 with Iceberg
- `rest`: Iceberg REST Catalog
- `minio`: S3-compatible object store
- `mc`: MinIO client (for setting up the bucket)

```bash
WARN[0000] /Users/eric/iceberg-quick-start/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
[+] Running 5/5
 ✔ Network iceberg-quick-start_iceberg_net  Created                        0.0s
 ✔ Container iceberg-rest-test              Started                        0.4s
 ✔ Container minio                          Started                        0.4s
 ✔ Container mc                             Started                        0.6s
 ✔ Container spark-iceberg                  S...                           0.7s
```

### Load TPC-H Data via Spark Shell

Run the following command to generate and load sample TPC-H data into the Iceberg tables:

```bash
docker exec spark-iceberg bash /home/iceberg/load_tpch.sh
```

```bash
Collecting duckdb
  Downloading duckdb-1.2.2-cp310-cp310-manylinux_2_24_aarch64.manylinux_2_28_aarch64.whl (18.7 MB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 18.7/18.7 MB 5.8 MB/s eta 0:00:00
Requirement already satisfied: pyspark in /opt/spark/python (3.5.5)
Collecting py4j==0.10.9.7
  Downloading py4j-0.10.9.7-py2.py3-none-any.whl (200 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 200.5/200.5 kB 5.9 MB/s eta 0:00:00
Installing collected packages: py4j, duckdb
Successfully installed duckdb-1.2.2 py4j-0.10.9.7

[notice] A new release of pip is available: 23.0.1 -> 25.1.1
[notice] To update, run: pip install --upgrade pip
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
25/05/07 12:17:27 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
25/05/07 12:17:28 WARN Utils: Service 'SparkUI' could not bind on port 4040. Attempting port 4041.
[2025-05-07 12:17:18] [INFO] Starting TPC-H data generation and loading process
[2025-05-07 12:17:18] [INFO] Configuration: Scale Factor=1, Data Dir=/home/iceberg/data/tpch_1
[2025-05-07 12:17:18] [INFO] Generating TPC-H data with DuckDB (Scale Factor: 1)
[2025-05-07 12:17:27] [INFO] Generated 8 Parquet files in /home/iceberg/data/tpch_1
[2025-05-07 12:17:28] [INFO] Loading data into Iceberg catalog
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.part from part.parquet
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.region from region.parquet
[2025-05-07 12:17:33] [INFO] Created Iceberg table: demo.tpch.supplier from supplier.parquet
[2025-05-07 12:17:35] [INFO] Created Iceberg table: demo.tpch.orders from orders.parquet
[2025-05-07 12:17:35] [INFO] Created Iceberg table: demo.tpch.nation from nation.parquet
[2025-05-07 12:17:40] [INFO] Created Iceberg table: demo.tpch.lineitem from lineitem.parquet
[2025-05-07 12:17:40] [INFO] Created Iceberg table: demo.tpch.partsupp from partsupp.parquet
[2025-05-07 12:17:41] [INFO] Created Iceberg table: demo.tpch.customer from customer.parquet
+---------+---------+-----------+
|namespace|tableName|isTemporary|
+---------+---------+-----------+
|     tpch| customer|      false|
|     tpch| lineitem|      false|
|     tpch|   nation|      false|
|     tpch|   orders|      false|
|     tpch|     part|      false|
|     tpch| partsupp|      false|
|     tpch|   region|      false|
|     tpch| supplier|      false|
+---------+---------+-----------+

[2025-05-07 12:17:42] [SUCCESS] TPCH data generation and loading completed successfully
```

### Query Data in Databend

Once the TPC-H tables are loaded, you can query the data in Databend:

1. Launch Databend in Docker:

```bash
docker network create iceberg_net
```

```bash
docker run -d \
  --name databend \
  --network iceberg_net \
  -p 3307:3307 \
  -p 8000:8000 \
  -p 8124:8124 \
  -p 8900:8900 \
  datafuselabs/databend
```

2. Connect to Databend using BendSQL first, and then create an Iceberg catalog:

```bash
bendsql
```

```bash
Welcome to BendSQL 0.24.1-f1f7de0(2024-12-04T12:31:18.526234000Z).
Connecting to localhost:8000 as user root.
Connected to Databend Query v1.2.725-8d073f6b7a(rust-1.88.0-nightly-2025-04-21T11:49:03.577976082Z)
Loaded 1436 auto complete keywords from server.
Started web server at 127.0.0.1:8080
```

```sql
CREATE CATALOG iceberg TYPE = ICEBERG CONNECTION = (
    TYPE = 'rest'
    ADDRESS = 'http://host.docker.internal:8181'  
    warehouse = 's3://warehouse/wh/'
    "s3.endpoint" = 'http://host.docker.internal:9000'  
    "s3.access-key-id" = 'admin'
    "s3.secret-access-key" = 'password'
    "s3.region" = 'us-east-1'
);
```

3. Use the newly created catalog:

```sql
USE CATALOG iceberg;
```

4. Show available databases:

```sql
SHOW DATABASES;
```

```sql
╭──────────────────────╮
│ databases_in_iceberg │
│        String        │
├──────────────────────┤
│ tpch                 │
╰──────────────────────╯
```

5. Run a sample query to aggregate TPC-H data:

```bash
SELECT
    l_returnflag,
    l_linestatus,
    SUM(l_quantity) AS sum_qty,
    SUM(l_extendedprice) AS sum_base_price,
    SUM(l_extendedprice * (1 - l_discount)) AS sum_disc_price,
    SUM(l_extendedprice * (1 - l_discount) * (1 + l_tax)) AS sum_charge,
    AVG(l_quantity) AS avg_qty,
    AVG(l_extendedprice) AS avg_price,
    AVG(l_discount) AS avg_disc,
    COUNT(*) AS count_order
FROM
    iceberg.tpch.lineitem
GROUP BY
    l_returnflag,
    l_linestatus
ORDER BY
    l_returnflag,
    l_linestatus;
```

```sql
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│   l_returnflag   │   l_linestatus   │          sum_qty         │      sum_base_price      │      sum_disc_price      │        sum_charge        │          avg_qty         │         avg_price        │         avg_disc         │ count_order │
│ Nullable(String) │ Nullable(String) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 2)) │ Nullable(Decimal(38, 4)) │ Nullable(Decimal(38, 6)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │ Nullable(Decimal(38, 8)) │    UInt64   │
├──────────────────┼──────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼──────────────────────────┼─────────────┤
│ A                │ F                │ 37734107.00              │ 56586554400.73           │ 53758257134.8700         │ 55909065222.827692       │ 25.52200585              │ 38273.12973462           │ 0.04998530               │     1478493 │
│ N                │ F                │ 991417.00                │ 1487504710.38            │ 1413082168.0541          │ 1469649223.194375        │ 25.51647192              │ 38284.46776085           │ 0.05009343               │       38854 │
│ N                │ O                │ 76633518.00              │ 114935210409.19          │ 109189591897.4720        │ 113561024263.013782      │ 25.50201964              │ 38248.01560906           │ 0.05000026               │     3004998 │
│ R                │ F                │ 37719753.00              │ 56568041380.90           │ 53741292684.6040         │ 55889619119.831932       │ 25.50579361              │ 38250.85462610           │ 0.05000941               │     1478870 │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

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

## Caching Iceberg Catalog

Databend offers a Catalog Metadata Cache specifically designed for Iceberg catalogs. When a query is executed on an Iceberg table for the first time, the metadata is cached in memory. By default, this cache remains valid for 10 minutes, after which it is asynchronously refreshed. This ensures that queries on Iceberg tables are faster by avoiding repeated metadata retrieval.

If you need fresh metadata, you can manually refresh the cache using the following commands:

```sql
USE CATALOG iceberg;
ALTER DATABASE tpch REFRESH CACHE; -- Refresh metadata cache for the tpch database
ALTER TABLE tpch.lineitem REFRESH CACHE; -- Refresh metadata cache for the lineitem table
```

If you prefer not to use the metadata cache, you can disable it entirely by configuring the `iceberg_table_meta_count` setting to `0` in the [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file:

```toml
...
# Cache config.
[cache]
...
iceberg_table_meta_count = 0
...
```

In addition to metadata caching, Databend also supports table data caching for Iceberg catalog tables, similar to Fuse tables. For more information on data caching, refer to the `[cache] Section` in the [Query Configurations](../10-deploy/04-references/02-node-config/02-query-config.md) reference.

## Iceberg Table Functions

Databend provides the following table functions for querying Iceberg metadata, allowing users to inspect snapshots and manifests efficiently:

- [ICEBERG_MANIFEST](/sql/sql-functions/table-functions/iceberg-manifest)
- [ICEBERG_SNAPSHOT](/sql/sql-functions/table-functions/iceberg-snapshot)

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