---
title: Table Functions
---

This page provides reference information for the table functions in Databend. Table functions return a set of rows (similar to a table) and can be used in the FROM clause of a query.

## Data Exploration Functions

| Function | Description | Example |
|----------|-------------|--------|
| [INFER_SCHEMA](01-infer-schema) | Detects file metadata schema and retrieves column definitions | `SELECT * FROM INFER_SCHEMA(LOCATION => '@mystage/data/')` |
| [INSPECT_PARQUET](02-inspect-parquet) | Inspects the structure of Parquet files | `SELECT * FROM INSPECT_PARQUET(LOCATION => '@mystage/data.parquet')` |
| [LIST_STAGE](03-list-stage) | Lists files in a stage | `SELECT * FROM LIST_STAGE(LOCATION => '@mystage/data/')` |
| [RESULT_SCAN](result-scan) | Retrieves the result set of a previous query | `SELECT * FROM RESULT_SCAN(LAST_QUERY_ID())` |

## Data Generation Functions

| Function | Description | Example |
|----------|-------------|--------|
| [GENERATE_SERIES](05-generate-series) | Generates a sequence of values | `SELECT * FROM GENERATE_SERIES(1, 10, 2)` |

## System Management Functions

| Function | Description | Example |
|----------|-------------|--------|
| [SHOW_GRANTS](show-grants) | Shows granted privileges | `SELECT * FROM SHOW_GRANTS()` |
| [SHOW_VARIABLES](show-variables) | Shows system variables | `SELECT * FROM SHOW_VARIABLES()` |
| [STREAM_STATUS](stream-status) | Shows stream status information | `SELECT * FROM STREAM_STATUS('mystream')` |
| [TASK_HISTROY](task_histroy) | Shows task execution history | `SELECT * FROM TASK_HISTROY('mytask')` |
| [FUSE_VACUUM_TEMPORARY_TABLE](fuse-vacuum-temporary-table) | Cleans up temporary tables | `SELECT * FROM FUSE_VACUUM_TEMPORARY_TABLE()` |
| [FUSE_AMEND](fuse-amend) | Manages data amendments | `SELECT * FROM FUSE_AMEND()` |

## Iceberg Integration Functions

| Function | Description | Example |
|----------|-------------|--------|
| [ICEBERG_MANIFEST](iceberg-manifest) | Shows Iceberg table manifest information | `SELECT * FROM ICEBERG_MANIFEST('mytable')` |
| [ICEBERG_SNAPSHOT](iceberg-snapshot) | Shows Iceberg table snapshot information | `SELECT * FROM ICEBERG_SNAPSHOT('mytable')` |

## Usage Examples

### Schema Inference for Data Loading

```sql
-- Create a stage for data files
CREATE STAGE mystage;

-- Upload files to the stage
PUT file:///path/to/data.parquet @mystage;

-- Infer the schema from Parquet files
SELECT * FROM INFER_SCHEMA(LOCATION => '@mystage/');

-- Create a table using the inferred schema
CREATE TABLE mytable AS 
  SELECT * FROM INFER_SCHEMA(LOCATION => '@mystage/');
```

### Generating Test Data

```sql
-- Generate a sequence of dates for the last 30 days
SELECT 
  value::DATE AS date,
  DAYNAME(value) AS day_of_week
FROM 
  GENERATE_SERIES(
    DATEADD(DAY, -30, CURRENT_DATE()),
    CURRENT_DATE(),
    INTERVAL '1 DAY'
  )
ORDER BY date;
```

### Analyzing Previous Query Results

```sql
-- Run a query and capture its ID
SELECT LAST_QUERY_ID() INTO @query_id;

-- Process the results further
SELECT 
  COUNT(*) AS row_count,
  AVG(column1) AS avg_value
FROM 
  RESULT_SCAN(@query_id);
```