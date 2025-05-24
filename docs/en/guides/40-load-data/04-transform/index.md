---
title: Querying & Transforming
slug: querying-stage
---

Databend enables direct querying of staged files without loading data into tables first. Query files from any stage type (user, internal, external) or directly from object storage and HTTPS URLs. Ideal for data inspection, validation, and transformation before or after loading.

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

Key parameters for controlling data access and parsing:

| Parameter | Description |
| --------- | ----------- |
| `FILE_FORMAT` | File format type (CSV, TSV, NDJSON, PARQUET, ORC, Avro) |
| `PATTERN` | Regex pattern to filter files |
| `FILES` | Explicit list of files to query |
| `CASE_SENSITIVE` | Column name case sensitivity (Parquet) |
| `table_alias` | Alias for referencing staged files |
| `$col_position` | Column selection by position (1-based) |
| `connection_parameters` | External storage connection details |
| `uri` | URI for remote files |

## Supported File Formats

| File Format | Return Format | Access Method | Example | Guide |
| ----------- | ------------ | ------------- | ------- | ----- |
| Parquet | Native data types | Direct column names | `SELECT id, name FROM` | [Querying Parquet Files](./00-querying-parquet.md) |
| ORC | Native data types | Direct column names | `SELECT id, name FROM` | [Querying ORC Files](./03-querying-orc.md) |
| CSV | String values | Positional references `$<position>` | `SELECT $1, $2 FROM` | [Querying CSV Files](./01-querying-csv.md) |
| TSV | String values | Positional references `$<position>` | `SELECT $1, $2 FROM` | [Querying TSV Files](./02-querying-tsv.md) |
| NDJSON | Variant object | Path expressions `$1:<field>` | `SELECT $1:id, $1:name FROM` | [Querying NDJSON Files](./03-querying-ndjson.md) |
| Avro | Variant object | Path expressions `$1:<field>` | `SELECT $1:id, $1:name FROM` | [Querying Avro Files](./04-querying-avro.md) |
