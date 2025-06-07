---
title: ATTACH TABLE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.698"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ATTACH TABLE'/>

Attaches an existing table to another one. The command moves the data and schema of a table from one database to another, but without actually copying the data. Instead, it creates a link that points to the original table data for accessing the data.

- Attach Table enables you to seamlessly connect a table in the cloud service platform to an existing table deployed in a private deployment environment without the need to physically move the data. This is particularly useful when you want to migrate data from a private deployment of Databend to [Databend Cloud](https://www.databend.com) while minimizing the data transfer overhead.

- The attached table operates in READ_ONLY mode. In this mode, changes in the source table are instantly reflected in the attached table. However, the attached table is exclusively for querying purposes and does not support updates. This means INSERT, UPDATE, and DELETE operations are not allowed on the attached table; only SELECT queries can be executed.

## Syntax

```sql
ATTACH TABLE <target_table_name> [ ( <column_list> ) ] '<source_table_data_URI>'
CONNECTION = ( <connection_parameters> )
```
- `<column_list>`: An optional, comma-separated list of columns to include from the source table, allowing users to specify only the necessary columns instead of including all of them. If not specified, all columns from the source table will be included.

  - Renaming an included column in the source table updates its name in the attached table, and it must be accessed using the new name.
  - Dropping an included column in the source table makes it inaccessible in the attached table.
  - Changes to non-included columns, such as renaming or dropping them in the source table, do not affect the attached table.

- `<source_table_data_URI>` represents the path to the source table's data. For S3-like object storage, the format is `s3://<bucket-name>/<database_ID>/<table_ID>`, for example, _s3://databend-toronto/1/23351/_, which represents the exact path to the table folder within the bucket.

  ![Alt text](/img/sql/attach.png)

  To obtain the database ID and table ID of a table, use the [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) function. In the example below, the part **1/23351/** in the value of _snapshot_location_ indicates that the database ID is **1**, and the table ID is **23351**.

  ```sql
  SELECT * FROM FUSE_SNAPSHOT('default', 'employees');

  Name                |Value                                              |
  --------------------+---------------------------------------------------+
  snapshot_id         |d6cd1f3afc3f4ad4af298ad94711ead1                   |
  snapshot_location   |1/23351/_ss/d6cd1f3afc3f4ad4af298ad94711ead1_v4.mpk|
  format_version      |4                                                  |
  previous_snapshot_id|                                                   |
  segment_count       |1                                                  |
  block_count         |1                                                  |
  row_count           |3                                                  |
  bytes_uncompressed  |122                                                |
  bytes_compressed    |523                                                |
  index_size          |470                                                |
  timestamp           |2023-07-11 05:38:27.0                              |
  ```

- `CONNECTION` specifies the connection parameters required for establishing a link to the object storage where the source table's data is stored. The connection parameters vary for different storage services based on their specific requirements and authentication mechanisms. For more information, see [Connection Parameters](../../../00-sql-reference/51-connect-parameters.md).

## Tutorials

- [Linking Tables with ATTACH TABLE](/tutorials/databend-cloud/link-tables)

## Examples

This example creates an attached table, which includes all columns from a source table stored in AWS S3:

```sql
ATTACH TABLE population_all_columns 's3://databend-doc/1/16/' CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>'
);
```

This example creates an attached table, which includes only selected columns (`city` and `population`) from a source table stored in AWS S3:

```sql
ATTACH TABLE population_only (city, population) 's3://databend-doc/1/16/' CONNECTION = (
  ACCESS_KEY_ID = '<your_aws_key_id>',
  SECRET_ACCESS_KEY = '<your_aws_secret_key>'
);
```