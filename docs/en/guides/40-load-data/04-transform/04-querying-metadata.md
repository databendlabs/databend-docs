---
title: Working with File and Column Metadata
sidebar_label: Metadata
---

This guide explains how to query metadata from staged files. Metadata includes both file-level metadata (such as file name and row number) and column-level metadata (such as column names, types, and nullability).

## Accessing File-Level Metadata

Databend supports accessing the following file-level metadata fields when reading staged files in the formats CSV, TSV, Parquet, and NDJSON:

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
  metadata$file_row_number,
  *
FROM @my_internal_stage/iris.parquet
LIMIT 5;
```

```sql
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ metadata$filename │ metadata$file_row_number │        id       │    sepal_length   │    sepal_width    │    petal_length   │    petal_width    │      species     │ metadata$filename │ metadata$file_row_number │
├───────────────────┼──────────────────────────┼─────────────────┼───────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────┼───────────────────┼──────────────────────────┤
│ iris.parquet      │                        0 │               1 │               5.1 │               3.5 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        0 │
│ iris.parquet      │                        1 │               2 │               4.9 │                 3 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        1 │
│ iris.parquet      │                        2 │               3 │               4.7 │               3.2 │               1.3 │               0.2 │ setosa           │ iris.parquet      │                        2 │
│ iris.parquet      │                        3 │               4 │               4.6 │               3.1 │               1.5 │               0.2 │ setosa           │ iris.parquet      │                        3 │
│ iris.parquet      │                        4 │               5 │                 5 │               3.6 │               1.4 │               0.2 │ setosa           │ iris.parquet      │                        4 │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

2. Using Metadata in COPY INTO

You can pass metadata fields into target table columns using COPY INTO:

```sql
COPY INTO iris_with_meta 
FROM (SELECT metadata$filename, metadata$file_row_number, $1, $2, $3, $4, $5 FROM @my_internal_stage/iris.parquet) 
FILE_FORMAT=(TYPE=parquet); 
```

## Inferring Column Metadata from Files

Databend allows you to retrieve the following column-level metadata from your staged files in the Parquet format using the [INFER_SCHEMA](/sql/sql-functions/table-functions/infer-schema) function:

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