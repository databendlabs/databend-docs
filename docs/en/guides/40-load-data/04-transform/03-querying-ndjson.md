---
title: Querying NDJSON Files in Stage
sidebar_label: NDJSON
---

## Query NDJSON Files in Stage

Syntax:
```sql
SELECT [<alias>.]$1:<column> [, $1:<column> ...] 
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]} 
[( 
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'NDJSON| <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ] [ , ... ] ) ]
)]
```


:::info Tips
NDJSON is a variant for the whole row, the column is `$1:<column> [, $1:<column> ...]`.
:::

## Tutorial

### Step 1. Create an External Stage

Create an external stage with your own S3 bucket and credentials where your NDJSON files are stored.
```sql
CREATE STAGE ndjson_query_stage 
URL = 's3://load/ndjson/' 
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>' 
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom NDJSON File Format

```sql
CREATE FILE FORMAT ndjson_query_format 
    TYPE = NDJSON,
    COMPRESSION = AUTO;
```

- More NDJSON file format options refer to [NDJSON File Format Options](/sql/sql-reference/file-format-options#ndjson-options)

### Step 3. Query NDJSON Files

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```

If the NDJSON files are compressed with gzip, we can use the following query:

```sql
SELECT $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson[.]gz'
);
```
### Query with Metadata

Query NDJSON files directly from a stage, including metadata columns like `metadata$filename` and `metadata$file_row_number`:

```sql
SELECT
    metadata$filename AS file,
    metadata$file_row_number AS row,
    $1:title, $1:author
FROM @ndjson_query_stage
(
    FILE_FORMAT => 'ndjson_query_format',
    PATTERN => '.*[.]ndjson'
);
```