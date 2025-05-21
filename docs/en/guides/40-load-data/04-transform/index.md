---
title: Querying & Transforming
slug: querying-stage
---

Databend supports querying and transforming data directly from staged files using the `SELECT` statement. This feature is available for user, internal, and external stages, as well as buckets in object storage (e.g., Amazon S3, Google Cloud Storage, Microsoft Azure) and remote servers via HTTPS. It's useful for inspecting staged file contents before or after data loading.

## Syntax

```sql
SELECT [<alias>.]<column> [, <column> ...] | [<alias>.]$<col_position> [, $<col_position> ...]
FROM {@<stage_name>[/<path>] [<table_alias>] | '<uri>' [<table_alias>]}
[(
  [<connection_parameters>],
  [ PATTERN => '<regex_pattern>'],
  [ FILE_FORMAT => 'CSV | TSV | NDJSON | PARQUET | ORC | Avro | <custom_format_name>'],
  [ FILES => ( '<file_name>' [ , '<file_name>' ... ])],
  [ CASE_SENSITIVE => true | false ]
)]
```

## Parameters Overview

The `SELECT` statement for staged files supports various parameters to control data access and parsing. For detailed information and examples on each parameter, please refer to their respective documentation sections:

-   **`FILE_FORMAT`**: Specifies the format of the file (e.g., CSV, TSV, NDJSON, PARQUET, ORC, Avro, or custom formats).
-   **`PATTERN`**: Uses a regular expression to match and filter file names.
-   **`FILES`**: Explicitly lists specific file names to query.
-   **`CASE_SENSITIVE`**: Controls case sensitivity for column names in Parquet files.
-   **`table_alias`**: Assigns an alias to staged files for easier referencing in queries.
-   **`$col_position`**: Selects columns by their positional index (1-based).
-   **`connection_parameters`**: Provides connection details for external storage.
-   **`uri`**: Specifies the URI for remote files.

## Supported File Formats


| File Format | Guide                                                                                             |
|-------------|---------------------------------------------------------------------------------------------------|
| Parquet     | [Querying Parquet Files](/docs/en/guides/40-load-data/04-transform/00-querying-parquet.md) |
| CSV         | [Querying CSV Files](/docs/en/guides/40-load-data/04-transform/01-querying-csv.md)     |
| TSV         | [Querying TSV Files](/docs/en/guides/40-load-data/04-transform/02-querying-tsv.md)     |
| NDJSON      | [Querying NDJSON Files](/docs/en/guides/40-load-data/04-transform/03-querying-ndjson.md) |
| ORC         | [Querying ORC Files](/docs/en/guides/40-load-data/04-transform/03-querying-orc.md)     |
| Avro        | [Querying Avro Files](/docs/en/guides/40-load-data/04-transform/04-querying-avro.md)     |
