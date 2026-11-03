---
title: Input & Output File Formats
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.957"/>

Databend accepts a variety of file formats both as a source and as a target for data loading or unloading. This page explains the supported file formats and their available options.

## Syntax

To specify a file format in a statement, use the following syntax:

```sql
-- Specify a standard file format
... FILE_FORMAT = ( TYPE = { CSV | TSV | NDJSON | PARQUET | ORC | AVRO } [ formatTypeOptions ] )

-- Specify a custom file format
... FILE_FORMAT = ( FORMAT_NAME = '<your-custom-format>' )
```

:::note
- Starting in Databend `v1.2.891-nightly`, `TEXT` is supported as an alias for `TSV`.
- Older servers may reject `TYPE = TEXT`, so this page continues to use `TSV` in syntax and examples for cross-version compatibility.
- If you only target Databend `v1.2.891-nightly` or later, prefer `TYPE = TEXT` for new configurations.
:::

Databend determines the file format used by a COPY or Select statement in the following order of priority:
1. First, it checks if a FILE_FORMAT is explicitly specified within the statement.
2. If no FILE_FORMAT is specified in the operation, it uses the file format initially defined for the stage at the time of stage creation.
3. If no file format was defined for the stage during its creation, Databend defaults to using the PARQUET format.

:::note
- Databend currently supports ORC and AVRO as a source ONLY. Unloading data into an ORC or AVRO file is not supported yet.
- For managing custom file formats in Databend, see [File Format](../10-sql-commands/00-ddl/13-file-format/index.md).
:::

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
  COMPRESSION = AUTO | GZIP | BZ2 | BROTLI | ZSTD | DEFLATE | RAW_DEFLATE | XZ | NONE
```

## Numeric Input

These rules apply when loading numeric fields directly into integer or DECIMAL columns from CSV, TSV/TEXT, or NDJSON. They also apply to numeric fields handled by the fast INSERT VALUES decoder.

Set the session setting `numeric_cast_option` before loading. It is not a `FILE_FORMAT` option. The default `rounding` mode rounds to the nearest target value, with halfway values rounded away from zero. The `truncating` mode discards fractional digits toward zero.

### Decimal Targets

<FunctionDescription description="Introduced or updated: v1.2.954"/>

DECIMAL fields are parsed from decimal text at the target precision and scale. This includes scientific notation and unquoted NDJSON numbers. The decoder does not first convert them to Float64. JSON string values that represent decimals use the same rounding setting. Nested DECIMAL values also use this setting.

| Input text | Target type | `rounding` result | `truncating` result |
|------------|-------------|-------------------|---------------------|
| `1.235` | `DECIMAL(4, 2)` | `1.24` | `1.23` |
| `-1.235` | `DECIMAL(4, 2)` | `-1.24` | `-1.23` |
| `99.995` | `DECIMAL(4, 2)` | Conversion error | `99.99` |

A rounding carry can exceed the target precision. For example, `100.00` does not fit `DECIMAL(4, 2)`.

### Integer Targets

For NDJSON integer targets, use JSON numbers rather than quoted JSON strings. Fractional and scientific-notation text is converted through exact decimal parsing, not Float64. Values beyond `2^53` therefore retain their significant digits. Conversion then applies the session rounding setting and checks the target integer range. Out-of-range values produce conversion errors instead of being clamped to the type limit.

| Input text | Target type | Setting | Expected value |
|------------|-------------|---------|----------------|
| `1760000000123456789.4` | `BIGINT` | `rounding` | `1760000000123456789` |
| `1760000000123456789.5` | `BIGINT` | `rounding` | `1760000000123456790` |
| `1.760000000123456789e18` | `BIGINT` | `rounding` | `1760000000123456789` |
| `-1.5` | `BIGINT` | `rounding` | `-2` |
| `-1.9` | `BIGINT` | `truncating` | `-1` |
| `9223372036854775807.5` | `BIGINT` | `rounding` | Conversion error |
| `18446744073709551615.9` | `BIGINT UNSIGNED` | `truncating` | `18446744073709551615` |
| `18446744073709551616` | `BIGINT UNSIGNED` | `rounding` | Conversion error |

For COPY, `ON_ERROR` controls how conversion errors affect the load. These rules do not recover digits that a client or an earlier FLOAT/DOUBLE conversion has already lost. See [Numeric Conversion](../20-sql-functions/02-conversion-functions/index.md#numeric-conversion) for SQL cast behavior.

## CSV Options

Databend CSV is compliant with [RFC 4180](https://www.rfc-editor.org/rfc/rfc4180) and is subject to the following conditions:

- CSV output doubles embedded quotes inside quoted fields and preserves backslashes literally.
- With `QUOTE_STYLE = 'quote_minimal'`, output quotes a string-encoded value or header when it contains the quote, field delimiter, or the record delimiter's first byte. An [ESCAPE](#escape) character alone does not require output quoting.
- No space should be left between a [FIELD_DELIMITER](#field_delimiter) and a [QUOTE](#quote-load-only).

### RECORD_DELIMITER

Delimiter character(s) to separates records in a file.

**Available Values**:

- `\r\n`
- A one-byte, non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\n`

### FIELD_DELIMITER

Delimiter character to separates fields in a record.

**Available Values**:

- A one-byte, non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `,` (comma)

### QUOTE (Load Only)

Character used to quote values.

For data loading, the quote is not necessary unless a string contains the character of a [QUOTE](#quote-load-only), [ESCAPE](#escape), [RECORD_DELIMITER](#record_delimiter), or [FIELD_DELIMITER](#field_delimiter).

**Available Values**: `'\''`, `'"'`, or ``'`'``(backtick)

**Default**: `'"'`

### ESCAPE

Character used to escape the quote character within quoted values, in addition to [QUOTE](#quote-load-only) itself. 

In some variants of CSV, quotes are escaped using a special escape character like `\`, instead of escaping quotes by doubling quoting.

**Load only.** Since v1.2.957, `ESCAPE` consistently affects only input parsing. It changes neither output contents nor output quoting, including headers. Unloading with `ESCAPE = ''` or `ESCAPE = '\\'` produces identical bytes for the same quote style. Databend does not output a backslash-escaped CSV dialect.

To read Databend CSV output without consuming literal backslashes, use `ESCAPE = ''` on load. A reader with backslash escaping can consume literal backslashes or misread a trailing backslash before a closing quote. Reusing the same named format for input and output does not guarantee a lossless round trip.

**Available Values**: `'\\'` or `''` (empty, means only use double quoting)

**Default**: `''`

### SKIP_HEADER (Load Only)

Number of lines to be skipped from the beginning of the file.

**Default**: `0`

### TRIM_SPACE (Load Only)

Trim leading and trailing ASCII whitespace from each field value before type conversion.

The trim set is fixed to ASCII whitespace: space, tab, LF, CR, VT, FF.

For CSV, trimming happens after csv-core extracts fields, so quoted field contents are also trimmed.

**Default**: `false`

### OUTPUT_HEADER (Unload Only)

Include a header row with column names.

**Default**: `false`

### QUOTE_STYLE (Unload Only)

Controls how CSV values are quoted during output.

| Available Values          | Description                                                  |
|---------------------------|--------------------------------------------------------------|
| `QUOTE_NOT_NULL` (Default)| Quote every non-NULL field in the CSV output.                |
| `QUOTE_MINIMAL`           | Quote a field only when required by the CSV output format.   |

**Default**: `QUOTE_NOT_NULL`

Since v1.2.957, minimal quoting no longer quotes a value solely because it contains the configured input `ESCAPE` character. This can change output bytes for nonempty `ESCAPE`. Minimal quoting can still make empty strings or literal `NULL_DISPLAY` strings indistinguishable from NULL. For example, a literal `\N` can collide with the default NULL marker. Disabling input escaping does not resolve these collisions; choose distinct NULL markers and suitable quoting for your data.

### NAN_DISPLAY

String that represent a "NaN" (Not-a-Number).

**Available Values**: Must be literal `'nan'` or `'null'` (case-insensitive)

**Default**: `'NaN'`

### NULL_DISPLAY

String that represent a NULL value.

When loading data, unquoted matches always become NULL, quoted matches convert to NULL only when `ALLOW_QUOTED_NULLS=true`.

**Default**: `'\N'`

### ALLOW_QUOTED_NULLS (Load Only)

Allow the conversion of quoted strings to NULL values. 

Quoted strings that match `NULL_DISPLAY` become NULL only when this flag is true. Unquoted matches become NULL regardless of this option.

**Default**: `false`

### ERROR_ON_COLUMN_COUNT_MISMATCH (Load Only)

Return error if the number of columns in the data file doesn't match the number of columns in the destination table.

**Default**: `true`

### EMPTY_FIELD_AS (Load Only)

The value that unquoted empty fields(i.e `,,`) is converted to.

| Available Values | Convert to                                                          |
|------------------|----------------------------------------------------------------------------------|
| `NULL`           | `NULL`. Error if column is not nullable.                                         |
| `STRING`         | For String columns:`''`. <br/> For other columns: `NULL`. Error if not nullable. |
| `FIELD_DEFAULT`  | The column's default value.                                                      |

**Default**: `NULL`

### QUOTED_EMPTY_FIELD_AS (Load Only)

The value that quoted empty fields(i.e `,"",`) is converted to.

**Available Values**: same as [EMPTY_FIELD_AS](#empty_field_as-load-only)

**Default**: `STRING`

### BINARY_FORMAT

Encoding format for `Binary` column.

**Available Values**: `HEX` or `BASE64`

**Default**: `HEX`

### GEOMETRY_FORMAT

Encoding format for `Geometry` column.

**Available Values**: `EWKT`, `WKB`, `WKB`, `EWKB`, `GEOJSON`

**Default**: `EWKT`

### ENCODING (Load Only)

Character set encoding of the source file. When set to a non-UTF-8 encoding, the file content is transcoded to UTF-8 before field parsing.

Any label recognized by the [Encoding Standard](https://encoding.spec.whatwg.org/) is accepted (e.g., `UTF-8`, `GBK`, `SHIFT_JIS`, `EUC-KR`, `ISO-8859-1`). The label is validated at file format / stage creation time.

**Default**: `UTF-8`

### ENCODING_ERROR_MODE (Load Only)

How to handle bytes that are invalid in the declared encoding (or invalid UTF-8 when encoding is `UTF-8`).

| Available Values   | Description                                                          |
|--------------------|----------------------------------------------------------------------|
| `STRICT` (Default) | Abort with an error on the first malformed byte sequence.            |
| `REPLACE`          | Replace each malformed byte sequence with U+FFFD and continue.       |

**Default**: `STRICT`

### COMPRESSION

The compression algorithm.

| Available Values | Description                                                     |
|------------------|-----------------------------------------------------------------|
| `NONE`           | Indicates that the files are not compressed.                    |
| `AUTO`           | Auto detect compression via file extensions                     |
| `GZIP`           |                                                                 |
| `BZ2`            |                                                                 |
| `BROTLI`         | Must be specified if loading/unloading Brotli-compressed files. |
| `ZSTD`           | Zstandard v0.8 (and higher) is supported.                       |
| `DEFLATE`        | Deflate-compressed files (with zlib header, RFC1950).           |
| `RAW_DEFLATE`    | Deflate-compressed files (without any header, RFC1951).         |
| `XZ`             |                                                                 |

**Default**: `NONE`

<a id="tsv-options"></a>

## TEXT / TSV Options

Databend TSV (also called `TEXT` in `v1.2.891-nightly` and later) uses the same format and options under both names. The examples use `TSV` for compatibility with older server versions.

Databend TSV is subject to the following conditions:

- [RECORD_DELIMITER](#record_delimiter-1), [FIELD_DELIMITER](#field_delimiter-1) are escaped by `\` to resolve [delimter collision](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
- In addition to delimters, these characters in are also escaped: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\\`, `\'`.
- [QUOTE](#quote-load-only) is NOT part of the format.
- NULL is represent as `\N`.

Since v1.2.957, loading decodes a backslash followed by a configured field or record delimiter to the delimiter itself. For example, with `FIELD_DELIMITER = '|'`, the value `a|b` unloads as `a\|b` and reloads as `a|b`, not with an extra backslash. This applies to `COPY` loading, stage `SELECT`, and schema inference. Standard escapes keep their behavior. Unrelated unknown escapes, such as `\q` when `q` is not a delimiter, keep the backslash.

An empty field delimiter remains supported for whole-line loading. TEXT/TSV unloading requires a nonempty field delimiter.

:::note
1. In Databend, the main difference between TSV and CSV is NOT using a tab instead of a comma as a field delemiter (which can be changed by options), but using escaping instead of quoting for
[delimter collision](https://en.wikipedia.org/wiki/Delimiter#Delimiter_collision)
2. We recommend CSV over TSV as a storage format since it has a formal standard.
3. TSV can be used to load files generated by
   1. [Postgresql TEXT](https://www.postgresql.org/docs/current/sql-copy.html).
   2. [Clickhouse TSV](https://clickhouse.com/docs/integrations/data-formats/csv-tsv#tsv-tab-separated-files)
   3. [MySQL TabSeperated](https://dev.mysql.com/doc/refman/8.4/en/mysqldump.html) MySQL `mysqldump --tab`. If `--fields-enclosed-by` or `--fields-optinally-enclosed-by`, use CSV instead.
   4. [Snowflake CSV](https://docs.snowflake.com/en/sql-reference/sql/create-file-format#type-csv) with default options. If `ESCAPE_UNENCLOSED_FIELD` is specified, use CSV instead.
   5. Hive Textfile.
:::

### RECORD_DELIMITER

Delimiter character(s) to separates records in a file.

**Available Values**:

- `\r\n`
- An arbitrary character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\n`

### FIELD_DELIMITER

Delimiter character to separates fields in a record.

**Available Values**:

- A non-alphanumeric character, such as `#` and `|`.
- A character with the escape char: `\b`, `\f`, `\r`, `\n`, `\t`, `\0`, `\xHH`

**Default**: `\t` (TAB)

### SKIP_HEADER (Load Only)

Same as [the SKIP_HEADER option for CSV](#skip_header-load-only).

### TRIM_SPACE (Load Only)

Same as [the TRIM_SPACE option for CSV](#trim_space-load-only).

### OUTPUT_HEADER (Unload Only)

Same as [the OUTPUT_HEADER option for CSV](#output_header-unload-only).

### NAN_DISPLAY

Same as [the NAN_DISPLAY option for CSV](#nan_display).

### NULL_DISPLAY

Same as [the NULL_DISPLAY option for CSV](#null_display).

### EMPTY_FIELD_AS (Load Only)

Same as [the EMPTY_FIELD_AS option for CSV](#empty_field_as-load-only).

Note: the default for TSV is `FIELD_DEFAULT` (different from CSV which defaults to `NULL`).

**Default**: `FIELD_DEFAULT`

### ERROR_ON_COLUMN_COUNT_MISMATCH (Load Only)

Same as [the ERROR_ON_COLUMN_COUNT_MISMATCH option for CSV](#error_on_column_count_mismatch-load-only).

### ENCODING (Load Only)

Same as [the ENCODING option for CSV](#encoding-load-only).

### ENCODING_ERROR_MODE (Load Only)

Same as [the ENCODING_ERROR_MODE option for CSV](#encoding_error_mode-load-only).

### COMPRESSION

Same as [the COMPRESSION option for CSV](#compression).

## NDJSON Options

### NULL_FIELD_AS (Load Only)

The value that `null` is converted to.

| Available Values        | Convert to                                               |
|-------------------------|----------------------------------------------------------|
| `NULL` (Default)        | NULL for nullable fields. Error for non-nullable fields. |
| `FIELD_DEFAULT`         | The default value of the field.                          |

### MISSING_FIELD_AS (Load Only)

The value that missing field is converted to.

| Available Values | Convert to                                               |
|------------------|----------------------------------------------------------|
| `ERROR` (Default)| Error.                                                   |
| `NULL`           | NULL for nullable fields. Error for non-nullable fields. |
| `FIELD_DEFAULT`  | The default value of the field.                          |

### NULL_IF (Load Only)

A list of strings. When a field value in the source file equals one of these strings, it is loaded as NULL. Matching is exact and case-sensitive.

**Syntax**: `NULL_IF = ('value1', 'value2', ...)`

**Default**: empty (no extra NULL markers)

### COMPRESSION

Same as [the COMPRESSION option for CSV](#compression).

## PARQUET Options

### MISSING_FIELD_AS (Load Only)

The value that missing field is converted to.

| Available Values | Convert to                                               |
|------------------|----------------------------------------------------------|
| `ERROR` (Default)| Error.                                                   |
| `FIELD_DEFAULT`  | The default value of the field.                          |

### NULL_IF (Load Only)

Same as [the NULL_IF option for NDJSON](#null_if-load-only).

### USE_LOGIC_TYPE (Load Only)

When enabled, Parquet logical types (e.g., DATE, TIMESTAMP, DECIMAL annotations) are used to determine the target column type during loading. When disabled, only the physical storage type is considered.

**Default**: `true`

### COMPRESSION (Unload Only)

Compression algorithm for internal blocks of parquet file.

| Available Values | Description                                                                 |
|------------------|-----------------------------------------------------------------------------|
| `ZSTD` (default) | Zstandard v0.8 (and higher) is supported.                                   |
| `SNAPPY`         | Snappy is a popular and fast compression algorithm often used with Parquet. |

## ORC Options


### MISSING_FIELD_AS (Load Only)

The value that missing field is converted to.

| Available Values | Convert to                                               |
|------------------|----------------------------------------------------------|
| `ERROR` (Default)| Error.                                                   |
| `FIELD_DEFAULT`  | The default value of the field.                          |


## AVRO Options

### MISSING_FIELD_AS (Load Only)

The value that missing field is converted to.

| Available Values | Convert to                                               |
|------------------|----------------------------------------------------------|
| `ERROR` (Default)| Error.                                                   |
| `FIELD_DEFAULT`  | The default value of the field.                          |

### NULL_IF (Load Only)

Same as [the NULL_IF option for NDJSON](#null_if-load-only).

### USE_LOGIC_TYPE (Load Only)

When enabled, Avro logical types (e.g., date, timestamp-millis, decimal) are used to determine the target column type during loading. When disabled, only the underlying Avro type is considered.

**Default**: `true`
