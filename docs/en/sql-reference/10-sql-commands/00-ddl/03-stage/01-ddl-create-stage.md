---
title: CREATE STAGE
sidebar_position: 1
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.941"/>

Creates an internal or external stage.

For an end-to-end S3 workflow, start with [Loading from Bucket](/guides/load-data/load/s3). That tutorial covers authentication, Connection and Stage creation, access verification, and loading. Use this page to check Stage syntax and options.

## Syntax

```sql
-- Internal stage
CREATE [ OR REPLACE ] STAGE [ IF NOT EXISTS ] <internal_stage_name>
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
  [ COMMENT = '<string_literal>' ]

-- External stage
CREATE STAGE [ IF NOT EXISTS ] <external_stage_name>
    externalStageParams
  [ FILE_FORMAT = (
         FORMAT_NAME = '<your-custom-format>'
         | TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ]
       ) ]
  [ COMMENT = '<string_literal>' ]
```

### externalStageParams

:::tip
For external stages, it is recommended to use the `CONNECTION` parameter to reference pre-configured connection objects instead of inline credentials. This approach provides better security and maintainability.
:::

```sql
externalStageParams ::=
  '<protocol>://<location>'
  CONNECTION = (
        <connection_parameters>
  )
|
  CONNECTION = (
        CONNECTION_NAME = '<your-connection-name>'
  );
```

For the connection parameters available for different storage services, see [Connection Parameters](/sql/sql-reference/connect-parameters).

For more information on `CONNECTION_NAME`, see [CREATE CONNECTION](../13-connection/create-connection.md).

### FILE_FORMAT

See [Input & Output File Formats](../../../00-sql-reference/50-file-format-options.md) for details.

## Access control requirements

| Privilege | Object Type   | Description                                                               |
| :-------- | :------------ | :------------------------------------------------------------------------ |
| SUPER     | Global, Table | Operates a stage(Lists stages. Creates, Drops a stage), catalog or share. |

To create a stage, the user performing the operation or the [current_role](/guides/security/access-control/roles) must have the SUPER [privilege](/guides/security/access-control/privileges).

## Examples

### Example 1: Create Internal Stage

This example creates an internal stage named _my_internal_stage_:

```sql
CREATE STAGE my_internal_stage;

DESC STAGE my_internal_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│       name        │ stage_type │ storage_type │ url  │ endpoint │ has_credentials │ has_encryption_key │ storage_params │ file_format_options │  creator │         created_on         │ comment │     owner     │
├───────────────────┼────────────┼──────────────┼──────┼──────────┼─────────────────┼────────────────────┼────────────────┼─────────────────────┼──────────┼────────────────────────────┼─────────┼───────────────┤
│ my_internal_stage │ Internal   │ NULL         │ NULL │ NULL     │ false           │ false              │ NULL           │ {"compression":...} │ root@%   │ 2026-06-16 22:21:19.000000 │         │ account_admin │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Example 2: Create External Stage with Connection

This example creates an external stage named _my_s3_stage_ on Amazon S3 using a connection:

```sql
-- First create a connection
CREATE CONNECTION my_s3_connection
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

-- Create stage using the connection
CREATE STAGE my_s3_stage
  URL='s3://load/files/'
  CONNECTION = (CONNECTION_NAME = 'my_s3_connection');

DESC STAGE my_s3_stage;

┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│    name     │ stage_type │ storage_type │       url        │ endpoint │ has_credentials │ has_encryption_key │   storage_params      │ file_format_options │ creator │         created_on         │ comment │     owner     │
├─────────────┼────────────┼──────────────┼──────────────────┼──────────┼─────────────────┼────────────────────┼───────────────────────┼─────────────────────┼─────────┼────────────────────────────┼─────────┼───────────────┤
│ my_s3_stage │ External   │ s3           │ s3://load/files/ │ NULL     │ true            │ false              │ {"bucket":"load",...} │ {"compression":...} │ root@%  │ 2026-06-16 22:21:19.000000 │         │ account_admin │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Example 3: Create External Stage with AWS IAM User

This example uses an IAM user's access keys. For Databend Cloud, [IAM role authentication](/guides/cloud/security/iam-role/aws) is recommended because it does not require storing access keys in Databend.

#### Prepare AWS Access {/* #step-1-create-access-policy-for-s3-bucket */}

<span id="step-2-create-iam-user" />

Follow [Configure Access Keys](/guides/load-data/load/s3#access-keys) to create a prefix-scoped read policy and an IAM user with an access key. That tutorial owns the AWS setup; you do not need a second policy or user for this example.

#### Create the Stage {/* #step-3-create-external-stage */}

Use the IAM user's credentials in a Connection. This example uses the same bucket, prefix, and SQL object names as the loading tutorial. Replace the example values with your own configuration. Do not put real keys in shared examples, screenshots, or source control.

```sql
CREATE CONNECTION s3_books_conn
  STORAGE_TYPE = 's3'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>'
  REGION = 'us-east-2';

CREATE STAGE s3_books_stage
  URL = 's3://databend-toronto/load/'
  CONNECTION = (CONNECTION_NAME = 's3_books_conn');
```

If these objects already exist from the loading tutorial, reuse them. Continue with [Verify S3 Access](/guides/load-data/load/s3#verify-s3-access) and [Load the Sample Data](/guides/load-data/load/s3#load-sample-data).

### Example 4: Create External Stage on Cloudflare R2

[Cloudflare R2](https://www.cloudflare.com/products/r2/) is an object storage service introduced by Cloudflare that is fully compatible with Amazon's AWS S3 service. This example creates an external stage named _r2_stage_ on Cloudflare R2.

#### Step 1: Create Bucket

The procedure below creates a bucket named _databend_ on Cloudflare R2.

1. Log into the Cloudflare dashboard, and select **R2** in the left navigation pane.
2. Click **Create bucket** to create a bucket, and set the bucket name to _databend_. Once the bucket is successfully created, you can find the bucket endpoint right below the bucket name when you view the bucket details page.

#### Step 2: Create R2 API Token

The procedure below creates an R2 API token that includes an Access Key ID and a Secret Access Key.

1. Click **Manage R2 API Tokens** on **R2** > **Overview**.
2. Click **Create API token** to create an API token.
3. When configuring the API token, select the necessary permission and set the **TTL** as needed.
4. Click **Create API Token** to obtain the Access Key ID and Secret Access Key. Copy and save them to a safe place.

#### Step 3: Create External Stage {/* #step-3-create-external-stage-1 */}

Use the created Access Key ID and Secret Access Key to create an external stage named _r2_stage_.

```sql
-- First create a connection
CREATE CONNECTION r2_connection
  STORAGE_TYPE = 's3'
  REGION = 'auto'
  ENDPOINT_URL = '<your-bucket-endpoint>'
  ACCESS_KEY_ID = '<your-access-key-id>'
  SECRET_ACCESS_KEY = '<your-secret-access-key>';

-- Create stage using the connection
CREATE STAGE r2_stage
  URL='s3://databend/'
  CONNECTION = (CONNECTION_NAME = 'r2_connection');
```
