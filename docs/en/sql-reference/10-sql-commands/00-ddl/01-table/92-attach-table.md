---
title: ATTACH TABLE
sidebar_position: 6
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.549"/>

import EEFeature from '@site/src/components/EEFeature';

<EEFeature featureName='ATTACH TABLE'/>

Attaches an existing table to another one. The command moves the data and schema of a table from one database to another, but without actually copying the data. Instead, it creates a link that points to the original table data for accessing the data.

Attach Table enables you to seamlessly connect a table in the cloud service platform to an existing table deployed in a private deployment environment without the need to physically move the data. This is particularly useful when you want to migrate data from a private deployment of Databend to [Databend Cloud](https://www.databend.com) while minimizing the data transfer overhead.

The attached table operates in READ_ONLY mode. In this mode, changes in the source table are instantly reflected in the attached table. However, the attached table is exclusively for querying purposes and does not support updates. This means INSERT, UPDATE, and DELETE operations are not allowed on the attached table; only SELECT queries can be executed.

## Syntax

```sql
ATTACH TABLE <target_table_name> '<source_table_data_URI>'
CONNECTION = ( <connection_parameters> )
```

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

## Examples

This example illustrates how to link a new table in Databend Cloud with an existing table in Databend, which stores data within an Amazon S3 bucket named "databend-toronto".

#### Step 1. Creating Table in Databend

Create a table named "population" and insert some sample data:

```sql title='Databend:'
CREATE TABLE population (
  city VARCHAR(50),
  population INT
);

INSERT INTO population (city, population) VALUES
  ('Toronto', 2731571),
  ('Montreal', 1704694),
  ('Vancouver', 631486);
```

#### Step 2. Obtaining Database ID and Table ID

Use the [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md) function to obtain the database ID and table ID. The result below indicates that the database ID is **1**, and the table ID is **556**:

```sql title='Databend:'
SELECT * FROM FUSE_SNAPSHOT('default', 'population');

┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│            snapshot_id           │                 snapshot_location                 │ format_version │ previous_snapshot_id │ segment_count │ block_count │ row_count │ bytes_uncompressed │ bytes_compressed │ index_size │          timestamp         │
├──────────────────────────────────┼───────────────────────────────────────────────────┼────────────────┼──────────────────────┼───────────────┼─────────────┼───────────┼────────────────────┼──────────────────┼────────────┼────────────────────────────┤
│ f252dd43d1aa44898a04827808342daf │ 1/556/_ss/f252dd43d1aa44898a04827808342daf_v4.mpk │              4 │ NULL                 │             1 │           1 │         3 │                 70 │              448 │        531 │ 2023-11-01 02:35:47.325319 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

When you access the bucket page on Amazon S3, you'll observe that the data is organized within the path `databend-toronto` > `1` > `556`, like this:

![Alt text](/img/sql/attach-table-2.png)

#### Step 3. Linking Table in Databend Cloud

Sign in to Databend Cloud and run the following command in a worksheet to link a table named "population_readonly":

```sql title='Databend Cloud:'
ATTACH TABLE population_readonly 's3://databend-toronto/1/556/' CONNECTION = (
  AWS_KEY_ID = '<your_aws_key_id>',
  AWS_SECRET_KEY = '<your_aws_secret_key>'
);
```

To verify the success of the link, run the following query in Databend Cloud:

```sql title='Databend Cloud:'
SELECT * FROM population_readonly;

-- Expected result:
┌────────────────────────────────────┐
│       city       │    population   │
├──────────────────┼─────────────────┤
│ Toronto          │         2731571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```

You're all set! If you update the source table in Databend, you can observe the same changes reflected in the target table on Databend Cloud. For example, if you change the population of Toronto to 2,371,571 in the source table:

```sql title='Databend:'
UPDATE population
SET population = 2371571
WHERE city = 'Toronto';
```

You can see that the updates are synced to the attached table in Databend Cloud:

```sql title='Databend Cloud:'
SELECT * FROM population_readonly;

-- Expected result:
┌────────────────────────────────────┐
│       city       │    population   │
├──────────────────┼─────────────────┤
│ Toronto          │         2371571 │
│ Montreal         │         1704694 │
│ Vancouver        │          631486 │
└────────────────────────────────────┘
```
