---
title: Querying & Transforming
slug: querying-stage
---

Databend introduces a transformative approach to data processing with its ELT (Extract, Load, Transform) model. The important aspect of this model is to query data in staged files.

You can query data in staged files using the `SELECT` statement. This feature is available for the following types of stages:

- User stage, internal stage, or external stage.
- Bucket or container created within your object storage, such as Amazon S3, Google Cloud Storage, and Microsoft Azure.
- Remote servers accessible via HTTPS.

This feature can be particularly useful for inspecting or viewing the contents of staged files, whether it's before or after loading data.

## Syntax

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::note
When the stage path contains special characters such as spaces or parentheses, enclose the entire path in single quotes:
```sql
SELECT * FROM 's3://mybucket/dataset(databend)/' ...
SELECT * FROM 's3://mybucket/dataset databend/' ...
```
:::

## Parameters Overview

The `SELECT` statement for staged files supports various parameters to control data access and parsing. For detailed information and examples on each parameter, please refer to their respective documentation sections:

-   **`FILE_FORMAT`**: Specifies the format of the file (e.g., CSV, TSV, NDJSON, PARQUET, ORC, Avro, or custom formats).
-   **`PATTERN`**: Uses a regular expression to match and filter file names.
-   **`FILES`**: Explicitly lists specific file names to query.
-   **`CASE_SENSITIVE`**: Controls case sensitivity for column names in Parquet files.
-   **`table_alias`**: Assigns an alias to staged files for easier referencing in queries.
-   **`$col_position`**: Selects columns by their positional index (1-based).
-   **`connection_parameters`**: Provides connection details for external storage.
-   **`uri`**: Specifies the URI for remote files.

## Limitations

When querying a staged file, the following format-specific constraints apply:

-   Selecting all fields with `*` is only supported for Parquet files.
-   For CSV or TSV files:
    -   All fields are parsed as strings.
    -   Only column positions (`$N`) are allowed for selection.
    -   The number of fields in the file must not exceed `max.N+1000`. For example, if the statement is `SELECT $1, $2 FROM @my_stage (FILES=>('sample.csv'))`, `sample.csv` can have a maximum of 1,002 fields.

## Tutorials

### Tutorial 1: Querying Data from Stage

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This example shows how to query data in a Parquet file stored in different locations. Click the tabs below to see details.

<Tabs groupId="query2stage">
<TabItem value="Stages" label="Stages">

Assume you have `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) uploaded to your user stage, an internal stage (`_my_internal_stage_`), and an external stage (`_my_external_stage_`). Use [PRESIGN](/sql/sql-commands/ddl/stage/presign) to upload files.

```sql
-- Query file in user stage
SELECT * FROM @~/books.parquet;

-- Query file in internal stage
SELECT * FROM @my_internal_stage/books.parquet;

-- Query file in external stage
SELECT * FROM @my_external_stage/books.parquet;
```

</TabItem>
<TabItem value="Bucket" label="Bucket">

Assume `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) is in an Amazon S3 bucket (`databend-toronto`, region `us-east-2`). Query by specifying connection parameters:

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret-access-key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        FILES => ('books.parquet')
    );
```

</TabItem>
<TabItem value="Remote" label="Remote">

Assume `books.parquet` ([link](https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet)) is on a remote server. Query by specifying the file URI:

```sql
SELECT * FROM 'https://datafuse-1253727613.cos.ap-hongkong.myqcloud.com/data/books.parquet';
```

</TabItem>
</Tabs>

### Tutorial 2: Querying Data with PATTERN and FILES

Assume you have Parquet files with the same schema in an Amazon S3 bucket (`databend-toronto`, region `us-east-2`):

```text
databend-toronto/
  ├── books-2023.parquet
  ├── books-2022.parquet
  ├── books-2021.parquet
  ├── books-2020.parquet
  └── books-2019.parquet
```

To query all Parquet files in the folder using `PATTERN`:

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        PATTERN => '.*parquet'
    );
```

To query specific Parquet files ("books-2023.parquet", "books-2022.parquet", and "books-2021.parquet") using `FILES`:

```sql
SELECT
    *
FROM
    's3://databend-toronto' (
        CONNECTION => (
            ACCESS_KEY_ID = '<your-access-key-id>',
            SECRET_ACCESS_KEY = '<your-secret_access_key>',
            ENDPOINT_URL = 'https://databend-toronto.s3.us-east-2.amazonaws.com'
        ),
        FILES => (
            'books-2023.parquet',
            'books-2022.parquet',
            'books-2021.parquet'
        )
    );
