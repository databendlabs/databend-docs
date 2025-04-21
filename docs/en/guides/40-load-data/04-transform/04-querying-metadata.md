---
title: Querying File Metadata
sidebar_label: Metadata
---

## Retrieving File Metadata Fields

Databend supports accessing file-level metadata fields when reading staged files in the format CSV, TSV, Parquet, and NDJSON. These fields are useful for tracking data origin, debugging, or enriching downstream tables via COPY INTO.

### Available Metadata Fields

| Field                      | Type    | Description                                      |
|----------------------------|---------|--------------------------------------------------|
| `metadata$filename`        | VARCHAR | The name of the file from which the row was read |
| `metadata$file_row_number` | INT     | The row number within the file (starting from 0) |

These metadata fields are available in:

- SELECT queries over stages (e.g., `SELECT FROM @stage`)
- `COPY INTO <table>` statements

### Examples

1. Querying Metadata Fields

You can directly select metadata fields when reading from a stage:

```sql
SELECT
  metadata$filename,
  metadata$file_row_number,
  *
FROM @my_s3/data/
FILE_FORMAT = (type => 'csv');
```

2. Using Metadata in COPY INTO

You can pass metadata fields into target table columns using COPY INTO:

```sql
-- Make sure your target table has columns like filename and row_index to store the metadata values
COPY INTO my_table
FROM (
  SELECT
    metadata$filename AS filename,
    metadata$file_row_number AS row_index,
    $1 AS name,
    $2 AS age
  FROM @my_s3/data/
)
FILE_FORMAT = (type => 'csv');
```

## Retrieving Column Definitions

Databend allows you to retrieve metadata from your staged files using the [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) function. This means you can extract column definitions from data files stored in internal or external stages. Retrieving metadata through the `INFER_SCHEMA` function provides a better understanding of the data structure, ensures data consistency, and enables automated data integration and analysis. The metadata for each column includes the following information:

- **column_name**: Indicates the name of the column.
- **type**: Indicates the data type of the column.
- **nullable**: Indicates whether the column allows null values.
- **order_id**: Represents the column's position in the table.

:::note
This feature is currently only available for the Parquet file format.
:::

The syntax for `INFER_SCHEMA` is as follows. For more detailed information about this function, see [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema).

```sql
INFER_SCHEMA(
  LOCATION => '{ internalStage | externalStage }'
  [ PATTERN => '<regex_pattern>']
)
```

## Tutorials

- [Querying Metadata](/tutorials/load/query-metadata)