---
title: Input & Output File Formats
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.713"/>

Databend accepts a variety of file formats both as a source and as a target for data loading or unloading. This page explains the supported file formats and their available options.

## Syntax

To specify a file format in a statement, use the following syntax:

```sql
-- Specify a standard file format
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ] )

-- Specify a custom file format
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

- Databend currently supports ORC and AVRO as a source ONLY. Unloading data into an ORC or AVRO file is not supported yet.
- If you don't specify the FILE_FORMAT when performing a COPY INTO or SELECT operation from a stage, Databend will use the file format that you initially defined for the stage when you created it. In cases where you didn't explicitly specify a file format during the stage creation, Databend defaults to using the PARQUET format. If you specify a different FILE_FORMAT from the one you defined when creating the stage, Databend will prioritize the FILE_FORMAT specified during the operation.
- For managing custom file formats in Databend, see [File Format](../10-sql-commands/00-ddl/13-file-format/index.md).

### formatTypeOptions

`formatTypeOptions` includes one or more options to describe other format details about the file. The options vary depending on the file format. See the sections below to find out the available options for each supported file format.

```sql
formatTypeOptions ::=
  RECORD_DELIMITER = '<character>'
  FIELD_DELIMITER = '<character>'
  SKIP_HEADER = <integer>
  QUOTE = '<character>'
  ESCAPE = '<character>'
  NAN_DISPLAY = '<string>'
  ROW_TAG = '<string>'
  USE_LOGIC_TYPE = TRUE | FALSE
  COMPRESSION = AUTO | GZIP | BZ2 | BROTLI | ZSTD | DEFLATE | RAW_DEFLATE | XZ | NONE
```

## CSV Options

Databend accepts CVS files that are compliant with [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) and is subject to the following conditions:

- A string must be quoted if it contains the character of a [QUOTE](#quote), [ESCAPE](#escape), [RECORD_DELIMITER](#record_delimiter), or [FIELD_DELIMITER](#field_delimiter).
- No character will be escaped in a quoted string except [QUOTE](#quote).
- No space should be left between a [FIELD_DELIMITER](#field_delimiter) and a [QUOTE](#quote).
- A string will be quoted in CSV if it comes from a serialized Array or Struct field.
- If you develop a program and generate the CSV files from it, Databend recommends using the CSV library from the programing language.

### RECORD_DELIMITER

Separates records in an input file.

**Available Values**:

- `\r\n`
- A one-byte, non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\n`

### FIELD_DELIMITER

Separates fields in a record.

**Available Values**:

- A one-byte, non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `,` (comma)

### QUOTE (Load Only)

Quotes strings in a CSV file. For data loading, the quote is not necessary unless a string contains the character of a [QUOTE](#quote), [ESCAPE](#escape), [RECORD_DELIMITER](#record_delimiter), or [FIELD_DELIMITER](#field_delimiter).

**Available Values**: `'`, `"`, or `(backtick)

**Default**: `"`

### ESCAPE

Escapes a quote in a quoted string.

**Available Values**: `'\\'` or `''`

**Default**: `''`

### SKIP_HEADER (Load Only)

Specifies how many lines to be skipped from the beginning of the file.

**Default**: `0`

### NAN_DISPLAY (Load Only)

Specifies how "NaN" (Not-a-Number) values are displayed in query results.

**Available Values**: Must be literal `'nan'` or `'null'` (case-insensitive)

**Default**: `'NaN'`

### NULL_DISPLAY (Load Only)

Specifies how NULL values are displayed in query results. 

**Default**: `'\N'`

### ERROR_ON_COLUMN_COUNT_MISMATCH (Load Only)

ERROR_ON_COLUMN_COUNT_MISMATCH is a boolean option that, when set to true, specifies that an error should be raised if the number of columns in the data file doesn't match the number of columns in the destination table. Setting it to true helps ensure data integrity and consistency during the loading process.

**Default**: `true`

### EMPTY_FIELD_AS (Load Only)

Specifies the value that should be used when encountering empty fields, including both `,,` and `,"",`, in the CSV data being loaded into the table.

| Available Values | Description                                                                       |
|------------------|-----------------------------------------------------------------------------------|
| `null` (Default) | Interprets empty fields as NULL values. Applicable to nullable columns only.      |
| `string`         | Interprets empty fields as empty strings (''). Applicable to String columns only. |
| `field_default`  | Uses the column's default value for empty fields.                                 |

### OUTPUT_HEADER (Unload Only)

Specifies whether to include a header row in the CSV file when exporting data with the `COPY INTO <location>` command. Defaults to `false`.

### BINARY_FORMAT

Controls the binary encoding format during both data export and import operations, with available values `HEX` (default) and `BASE64`.

### COMPRESSION

Specifies the compression algorithm.

| Available Values | Description                                                     |
|------------------|-----------------------------------------------------------------|
| `NONE` (Default) | Indicates that the files are not compressed.                    |
| `AUTO`           | Auto detect compression via file extensions                     |
| `GZIP`           |                                                                 |
| `BZ2`            |                                                                 |
| `BROTLI`         | Must be specified if loading/unloading Brotli-compressed files. |
| `ZSTD`           | Zstandard v0.8 (and higher) is supported.                       |
| `DEFLATE`        | Deflate-compressed files (with zlib header, RFC1950).           |
| `RAW_DEFLATE`    | Deflate-compressed files (without any header, RFC1951).         |
| `XZ`             |                                                                 |

## TSV Options

Databend is subject to the following conditions when dealing with a TSV file:

- These characters in a TSV file will be escaped: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\\`, `\'`, [RECORD_DELIMITER](#record_delimiter-1), [FIELD_DELIMITER](#field_delimiter-1).
- Neither quoting nor enclosing is currently supported.
- A string will be quoted in CSV if it comes from a serialized Array or Struct field.
- Null is serialized as `\N`.


:::note
1. In Databend, the main difference between TSV and CSV is NOT using a tab instead of a comma as a field delemiter (which can be changed by options), but using escaping instead of quoting for 
[delimter collision](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
2. We recommend CSV over TSV as a storage format since it has a formal standard.
3. TSV can be used to load files generated by
   1. Clickhouse TSV file format.
   2. MySQL `mysqldump` command with option `--tab` without `--fields-enclosed-by` or `--fields-optinally-enclosed-by`, if the later two is specified, use CSV instead.
   3. Snowflake CSV without `ESCAPE_UNENCLOSED_FIELD`. if `ESCAPE_UNENCLOSED_FIELD` is specified, use CSV instead.
:::

### RECORD_DELIMITER

Separates records in an input file.

**Available Values**:

- `\r\n`
- An arbitrary character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\n`

### FIELD_DELIMITER

Separates fields in a record.

**Available Values**:

- A non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\t` (TAB)

### COMPRESSION

Same as [the COMPRESSION option for CSV](#compression).

## NDJSON Options

### NULL_FIELD_AS (Load Only)

Specifies how to handle null values during data loading. Refer to the options in the table below for possible configurations.

| Available Values        | Description                                                                                             |
|-------------------------|---------------------------------------------------------------------------------------------------------|
| `NULL` (Default)        | Interprets null values as NULL for nullable fields. An error will be generated for non-nullable fields. |
| `FIELD_DEFAULT`         | Uses the default value of the field for null values.                                                    |

### MISSING_FIELD_AS (Load Only)

Determines the behavior when encountering missing fields during data loading. Refer to the options in the table below for possible configurations.

| Available Values | Description                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| `ERROR` (Default)  | Generates an error if a missing field is encountered.                                         |
| `NULL`             | Interprets missing fields as NULL values. An error will be generated for non-nullable fields. |
| `FIELD_DEFAULT`    | Uses the default value of the field for missing fields.                                       |

### COMPRESSION

Same as [the COMPRESSION option for CSV](#compression).

## PARQUET Options

### MISSING_FIELD_AS (Load Only)

Determines the behavior when encountering missing fields during data loading. Refer to the options in the table below for possible configurations.

| Available Values | Description                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| `ERROR` (Default)| Generates an error if a missing field is encountered.                                         |
| `FIELD_DEFAULT`  | Uses the default value of the field for missing fields.                                       |

### USE_LOGIC_TYPE (Load Only)

Controls how temporal data types (date and timestamp) are interpreted during loading.

| Available Values | Description                                                                                                                |
|------------------|----------------------------------------------------------------------------------------------------------------------------|
| `TRUE` (Default) | Date and timestamp values are loaded as their logical data types (DATE and TIMESTAMP).                                    |
| `FALSE`          | Date and timestamp values are loaded as raw integer values (INT32 for dates, INT64 for timestamps).                      |

### COMPRESSION (Unload Only)

Specifies the compression algorithm, which is used for compressing internal blocks of the file rather than the entire file, so the output remains in Parquet format.

| Available Values | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `ZSTD` (default) | Zstandard v0.8 (and higher) is supported.                                   |
| `SNAPPY`         | Snappy is a popular and fast compression algorithm often used with Parquet. |


## ORC Options

### MISSING_FIELD_AS (Load Only)

Determines the behavior when encountering missing fields during data loading. Refer to the options in the table below for possible configurations.

| Available Values | Description                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| `ERROR` (Default)| Generates an error if a missing field is encountered.                                         |
| `FIELD_DEFAULT`  | Uses the default value of the field for missing fields.                                       |


## AVRO Options

### MISSING_FIELD_AS (Load Only)

Determines the behavior when encountering missing fields during data loading. Refer to the options in the table below for possible configurations.

| Available Values | Description                                                                                   |
|------------------|-----------------------------------------------------------------------------------------------|
| `ERROR` (Default)| Generates an error if a missing field is encountered.                                         |
| `FIELD_DEFAULT`  | Uses the default value of the field for missing fields.                                       |

### USE_LOGIC_TYPE (Load Only)

Controls how temporal data types (date and timestamp) are interpreted during loading.

| Available Values | Description                                                                                                                |
|------------------|----------------------------------------------------------------------------------------------------------------------------|
| `TRUE` (Default) | Date and timestamp values are loaded as their logical data types (DATE and TIMESTAMP).                                    |
| `FALSE`          | Date and timestamp values are loaded as raw integer values (INT32 for dates, INT64 for timestamps).                      |