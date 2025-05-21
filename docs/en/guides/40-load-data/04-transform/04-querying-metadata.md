---
title: Working with File and Column Metadata
sidebar_label: Metadata
---

This guide explains how to query metadata from staged files. The supported file formats for metadata querying are summarized in the table below:

| Metadata Type       | Supported File Formats                               |
|---------------------|------------------------------------------------------|
| File-level metadata | CSV, TSV, Parquet, NDJSON, Avro                      |
| Column-level metadata (INFER_SCHEMA) | Parquet                                              |

The following file-level metadata fields are available for the supported file formats:

| File Metadata              | Type    | Description                                      |
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
  metadata$file_row_number
FROM @my_internal_stage
LIMIT 1;
```

```sql
│ metadata$filename │ metadata$file_row_number  │
├───────────────────┼───────────────────────────┤
│ iris.parquet      │                        10 │
```

2. Using Metadata in COPY INTO

You can pass metadata fields into target table columns using COPY INTO:

```sql
COPY INTO iris_with_meta 
FROM (SELECT metadata$filename, metadata$file_row_number, $1, $2, $3, $4, $5 FROM @my_internal_stage/iris.parquet) 
FILE_FORMAT=(TYPE=parquet); 
```

## Inferring Column Metadata from Files

Databend allows you to retrieve column-level metadata from your staged files using the [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) function. This is currently supported for **Parquet** files.

| Column Metadata | Type    | Description                                      |
|-----------------|---------|--------------------------------------------------|
| `column_name`   | String  | Indicates the name of the column.                |
| `type`          | String  | Indicates the data type of the column.           |
| `nullable`      | Boolean | Indicates whether the column allows null values. |
| `order_id`      | UInt64  | Represents the column's position in the table.   |

### Examples

The following example retrieves column metadata from a Parquet file staged in `@my_internal_stage`:

```sql
SELECT * FROM INFER_SCHEMA(location => '@my_internal_stage/iris.parquet');
```

```sql
┌──────────────────────────────────────────────┐
│  column_name │   type  │ nullable │ order_id │
├──────────────┼─────────┼──────────┼──────────┤
│ id           │ BIGINT  │ true     │        0 │
│ sepal_length │ DOUBLE  │ true     │        1 │
│ sepal_width  │ DOUBLE  │ true     │        2 │
│ petal_length │ DOUBLE  │ true     │        3 │
│ petal_width  │ DOUBLE  │ true     │        4 │
│ species      │ VARCHAR │ true     │        5 │
└──────────────────────────────────────────────┘
```

## Tutorials

- [Querying Metadata](/tutorials/load/query-metadata)