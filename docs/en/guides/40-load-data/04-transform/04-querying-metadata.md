---
title: Working with File and Column Metadata
sidebar_label: Metadata
---

The following file-level metadata fields are available for the supported file formats:

| File Metadata              | Type    | Description                                      |
| -------------------------- | ------- | ------------------------------------------------ |
| `METADATA$FILENAME`        | VARCHAR | The name of the file from which the row was read |
| `METADATA$FILE_ROW_NUMBER` | INT     | The row number within the file (starting from 0) |

These metadata fields are available in:

- SELECT queries over stages (e.g., `SELECT FROM @stage`)
- `COPY INTO <table>` statements

## Detailed Guides for Querying Metadata

| File Format | Guide                                                                                |
| ----------- | ------------------------------------------------------------------------------------ |
| Parquet     | [Querying Parquet Files with Metadata](./00-querying-parquet.md#query-with-metadata) |
| CSV         | [Querying CSV Files with Metadata](./01-querying-csv.md#query-with-metadata)         |
| TSV         | [Querying TSV Files with Metadata](./02-querying-tsv.md#query-with-metadata)         |
| NDJSON      | [Querying NDJSON Files with Metadata](./03-querying-ndjson.md#query-with-metadata)   |
| ORC         | [Querying ORC Files with Metadata](./03-querying-orc.md#query-with-metadata)         |
| Avro        | [Querying Avro Files with Metadata](./04-querying-avro.md#query-with-metadata)       |
