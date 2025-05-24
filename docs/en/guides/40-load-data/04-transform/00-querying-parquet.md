---
title: Querying Parquet Files in Stage
sidebar_label: Parquet
---

## Query Parquet Files in Stage

Syntax:
```sql
SELECT [<alias>.]<column> [, <column> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'PARQUET | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ],
  [ CASE_SENSITIVE => true | false ]
)]
```

:::info Tips
**Query Return Content Explanation:**

* **Return Format**: Column values in their native data types (not variants)
* **Access Method**: Directly use column names `column_name`
* **Example**: `SELECT id, name, age FROM @stage_name`
* **Key Features**:
  * No need for path expressions (like `$1:name`)
  * No type casting required
  * Parquet files contain embedded schema information
:::

## Tutorial

### Step 1. Create an External Stage

Create an external stage with your own S3 bucket and credentials where your Parquet files are stored.
```sql
CREATE STAGE parquet_query_stage 
URL = 's3://load/parquet/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom Parquet File Format

```sql
CREATE FILE FORMAT parquet_query_format 
    TYPE = PARQUET
    ;
```
- More Parquet file format options refer to [Parquet File Format Options](/sql/sql-reference/file-format-options#parquet-options)

### Step 3. Query Parquet Files

```sql
SELECT *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```
### Query with Metadata

Query Parquet files directly from a stage, including metadata columns like `METADATA$FILENAME` and `METADATA$FILE_ROW_NUMBER`:

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    *
FROM @parquet_query_stage
(
    FILE_FORMAT => 'parquet_query_format',
    PATTERN => '.*[.]parquet'
);
```