---
title: Loading from Files
---

Databend offers simple, powerful commands to load data files into tables. Most operations require just a single command. Your data must be in a [supported format](/sql/sql-reference/file-format-options).

![Data Loading and Unloading Overview](/img/load/load-unload.jpeg)

## Supported File Formats

| Format | Type | Description |
|--------|------|-------------|
| [**CSV**](/guides/load-data/load-semistructured/load-csv), [**TSV**](/guides/load-data/load-semistructured/load-tsv) | Delimited | Text files with customizable delimiters |
| [**NDJSON**](/guides/load-data/load-semistructured/load-ndjson) | Semi-structured | JSON objects, one per line |
| [**Parquet**](/guides/load-data/load-semistructured/load-parquet) | Semi-structured | Efficient columnar storage format |
| [**ORC**](/guides/load-data/load-semistructured/load-orc) | Semi-structured | High-performance columnar format |
| [**Avro**](/guides/load-data/load-semistructured/load-avro) | Semi-structured | Compact binary format with schema |

## Loading by File Location

Select the location of your files to find the recommended loading method:

| Data Source | Recommended Tool | Description | Documentation |
|-------------|-----------------|-------------|---------------|
| **Staged Data Files** | **COPY INTO** | Fast, efficient loading from internal/external stages or user stage | [Loading from Stage](stage) |
| **Cloud Storage** | **COPY INTO** | Load from Amazon S3, Google Cloud Storage, Microsoft Azure | [Loading from Bucket](s3) |
| **Local Files** | [**BendSQL**](https://github.com/databendlabs/BendSQL) | Databend's native CLI tool for local file loading | [Loading from Local File](local) |
| **Remote Files** | **COPY INTO** | Load data from remote HTTP/HTTPS locations | [Loading from Remote File](http) |
