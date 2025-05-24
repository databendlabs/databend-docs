---
title: Querying TSV Files in Stage
sidebar_label: TSV
---

## Query TSV Files in Stage

Syntax:
```sql
SELECT [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'TSV| <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```


:::info Tips
**Query Return Content Explanation:**

* **Return Format**: Individual column values as strings by default
* **Access Method**: Use positional references `$<col_position>` (e.g., `$1`, `$2`, `$3`)
* **Example**: `SELECT $1, $2, $3 FROM @stage_name`
* **Key Features**:
  * Columns accessed by position, not by name
  * Each `$<col_position>` refers to a single column, not the whole row
  * Type casting required for non-string operations (e.g., `CAST($1 AS INT)`)
  * No embedded schema information in TSV files
:::

## Tutorial

### Step 1. Create an External Stage

Create an external stage with your own S3 bucket and credentials where your TSV files are stored.
```sql
CREATE STAGE tsv_query_stage 
URL = 's3://load/tsv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom TSV File Format

```sql
CREATE FILE FORMAT tsv_query_format 
    TYPE = TSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO;
```

- More TSV file format options refer to [TSV File Format Options](/sql/sql-reference/file-format-options#tsv-options)

### Step 3. Query TSV Files

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```

If the TSV files is compressed with gzip, we can use the following query:

```sql
SELECT $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv[.]gz'
);
```
### Query with Metadata

Query TSV files directly from a stage, including metadata columns like `metadata$filename` and `metadata$file_row_number`:

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    $1, $2, $3
FROM @tsv_query_stage
(
    FILE_FORMAT => 'tsv_query_format',
    PATTERN => '.*[.]tsv'
);
```