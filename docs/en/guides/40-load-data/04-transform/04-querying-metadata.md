---
title: Working with File and Column Metadata
sidebar_label: Metadata
---

The following file-level metadata fields are available for the supported file formats:

| File Metadata              | Type    | Description                                      |
|----------------------------|---------|--------------------------------------------------|
| `metadata$filename`        | VARCHAR | The name of the file from which the row was read |
| `metadata$file_row_number` | INT     | The row number within the file (starting from 0) |

These metadata fields are available in:

- SELECT queries over stages (e.g., `SELECT FROM @stage`)
- `COPY INTO <table>` statements

## Detailed Guides for Querying Metadata

| File Format | Guide                                                                                             |
|-------------|---------------------------------------------------------------------------------------------------|
| Parquet     | [Querying Parquet Files with Metadata](/docs/en/guides/40-load-data/04-transform/00-querying-parquet.md#query-with-metadata) |
| CSV         | [Querying CSV Files with Metadata](/docs/en/guides/40-load-data/04-transform/01-querying-csv.md#query-with-metadata)     |
| TSV         | [Querying TSV Files with Metadata](/docs/en/guides/40-load-data/04-transform/02-querying-tsv.md#query-with-metadata)     |
| NDJSON      | [Querying NDJSON Files with Metadata](/docs/en/guides/40-load-data/04-transform/03-querying-ndjson.md#query-with-metadata) |
| ORC         | [Querying ORC Files with Metadata](/docs/en/guides/40-load-data/04-transform/03-querying-orc.md#query-with-metadata)     |
| Avro        | [Querying Avro Files with Metadata](/docs/en/guides/40-load-data/04-transform/04-querying-avro.md#query-with-metadata)     |