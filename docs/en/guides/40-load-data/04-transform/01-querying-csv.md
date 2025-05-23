---
title: Querying CSV Files in Stage
sidebar_label: CSV
---

## Query CSV Files in Stage

Syntax:
```sql
SELECT [<alias>.]$<col_position> [, $<col_position> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV| <custom_format_name>'],
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
  * No embedded schema information in CSV files
:::

## Tutorial

### Step 1. Create an External Stage

Create an external stage with your own S3 bucket and credentials where your CSV files are stored.
```sql
CREATE STAGE csv_query_stage 
URL = 's3://load/csv/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom CSV File Format

```sql
CREATE FILE FORMAT csv_query_format 
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = AUTO,
    SKIP_HEADER = 1;        -- Skip first line when querying if the CSV file has header
```

- More CSV file format options refer to [CSV File Format Options](/sql/sql-reference/file-format-options#csv-options)

### Step 3. Query CSV Files

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```

If the CSV files is compressed with gzip, we can use the following query:

```sql
SELECT $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv[.]gz'
);
```
### Query with Metadata

Query CSV files directly from a stage, including metadata columns like `METADATA$FILENAME` and `METADATA$FILE_ROW_NUMBER`:

```sql
SELECT
    METADATA$FILENAME,
    METADATA$FILE_ROW_NUMBER,
    $1, $2, $3
FROM @csv_query_stage
(
    FILE_FORMAT => 'csv_query_format',
    PATTERN => '.*[.]csv'
);
```