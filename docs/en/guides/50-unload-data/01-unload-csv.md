---
title: Unloading CSV File
---

import FunctionDescription from '@site/src/components/FunctionDescription';

## Unloading CSV File

Syntax:

```sql
COPY INTO { internalStage | externalStage | externalLocation }
FROM { [<database_name>.]<table_name> | ( <query> ) }
FILE_FORMAT = (
    TYPE = CSV,
    RECORD_DELIMITER = '<character>',
    FIELD_DELIMITER = '<character>',
    COMPRESSION = gzip,
    OUTPUT_HEADER = true -- Unload with header
)
[MAX_FILE_SIZE = <num>]
[DETAILED_OUTPUT = true | false]
```

- More CSV options refer to [CSV File Format Options](/sql/sql-reference/file-format-options#csv-options)
- Unloading into multiple files use the [MAX_FILE_SIZE Copy Option](/sql/sql-commands/dml/dml-copy-into-location#copyoptions)
- More details about the syntax can be found in [COPY INTO location](/sql/sql-commands/dml/dml-copy-into-location)

<h2 id="csv-output-compatibility">CSV Output Compatibility</h2>

<FunctionDescription description="Introduced or updated: Unreleased"/>

The default `QUOTE_STYLE = 'QUOTE_NOT_NULL'` now quotes every non-NULL value. Previously, it left numbers, BOOLEAN, and non-empty BINARY values unquoted. After you upgrade to a release with this change, CSV contents, byte counts, compressed sizes, and file splits can change. TSV output is unchanged.

To leave ordinary integers, floats, and DECIMAL values unquoted, use `QUOTE_STYLE = 'QUOTE_NON_NUMERIC'`. This style still quotes BOOLEAN and BINARY values. For all three choices, see [QUOTE_STYLE](/sql/sql-reference/file-format-options#csv-quote-style).

All styles now quote empty STRING and BINARY values and non-NULL values equal to `NULL_DISPLAY`. To preserve these values on reload, keep `QUOTED_EMPTY_FIELD_AS = STRING` and `ALLOW_QUOTED_NULLS = false`. Match the export's delimiters, quote character, `NULL_DISPLAY`, and `BINARY_FORMAT`. Other load options, such as `TRIM_SPACE`, can still change values.

## Tutorial

### Step 1. Create an External Stage

```sql
CREATE STAGE csv_unload_stage
URL = 's3://unload/csv/'
CONNECTION = (
    ACCESS_KEY_ID = '<your-access-key-id>'
    SECRET_ACCESS_KEY = '<your-secret-access-key>'
);
```

### Step 2. Create Custom CSV File Format

```sql
CREATE FILE FORMAT csv_unload_format
    TYPE = CSV,
    RECORD_DELIMITER = '\n',
    FIELD_DELIMITER = ',',
    COMPRESSION = gzip,     -- Unload with gzip compression
    OUTPUT_HEADER = true,   -- Unload with header
    SKIP_HEADER = 1;        -- Only for loading, skip first line when querying if the CSV file has header
```

### Step 3. Unload into CSV File

```sql
COPY INTO @csv_unload_stage
FROM (
    SELECT *
    FROM generate_series(1, 100)
)
FILE_FORMAT = (FORMAT_NAME = 'csv_unload_format')
DETAILED_OUTPUT = true;
```

Result (historical example; the file name and size can differ, including after the quoting change above):

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                             file_name                            │ file_size │ row_count │
├──────────────────────────────────────────────────────────────────┼───────────┼───────────┤
│   data_c8382216-0a04-4920-9eca-7b5debe3eed6_0000_00000000.csv.gz │       187 │       100 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Step 4. Verify the Unloaded CSV Files

```sql
SELECT COUNT($1)
FROM @csv_unload_stage
(
    FILE_FORMAT => 'csv_unload_format',
    PATTERN => '.*[.]csv[.]gz'
);
```

Result:

```text
┌───────────┐
│ count($1) │
├───────────┤
│       100 │
└───────────┘
```
