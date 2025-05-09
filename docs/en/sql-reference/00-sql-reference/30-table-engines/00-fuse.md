---
title: Fuse Engine Tables
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.733"/>

## Overview

Databend uses the Fuse Engine as its default storage engine, providing a Git-like data management system with:

- **Snapshot-based Architecture**: Query and restore data at any point in time, with history of data changes for recovery
- **High Performance**: Optimized for analytical workloads with automatic indexing and bloom filters
- **Efficient Storage**: Uses Parquet format with high compression for optimal storage efficiency
- **Flexible Configuration**: Customizable compression, indexing, and storage options
- **Data Maintenance**: Automatic data retention, snapshot management, and change tracking capabilities

## When to Use Fuse Engine

Ideal for:
- **Analytics**: OLAP queries with columnar storage
- **Data Warehousing**: Large volumes of historical data
- **Time-Travel**: Access to historical data versions
- **Cloud Storage**: Optimized for object storage

## Syntax

```sql
CREATE TABLE <table_name> (
  <column_definitions>
) [ENGINE = FUSE]
[CLUSTER BY (<expr> [, <expr>, ...] )]
[<Options>];
```

For more details about the `CREATE TABLE` syntax, see [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md).

| Parameter    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENGINE`     | If an engine is not explicitly specified, Databend will automatically default to using the Fuse Engine to create tables, which is equivalent to `ENGINE = FUSE`.                                                                                                                                                                                                                                                                                                          |
| `CLUSTER BY` | Specifies the sorting method for data that consists of multiple expressions. For more information, see [Cluster Key](/guides/performance/cluster-key).                                                                                                                                                                                                                                                                                                                    |
| `<Options>`  | The Fuse Engine offers various options (case-insensitive) that allow you to customize the table's properties. See [Fuse Engine Options](#fuse-engine-options) for details.<br/>- Separate multiple options with a space.<br/>- Use [ALTER TABLE OPTION](../../10-sql-commands/00-ddl/01-table/90-alter-table-option.md) to modify a table's options.<br/>- Use [SHOW CREATE TABLE](../../10-sql-commands/00-ddl/01-table/show-create-table.md) to show a table's options. |



## Fuse Engine Options

The following are the available Fuse Engine options:

| Option                         | Syntax                                              | Description                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bloom_index_columns            | `bloom_index_columns = '<column> [, <column> ...]'` | Specifies the columns to be used for the bloom index. The data type of these columns can be Map, Number, String, Date, or Timestamp. If no specific columns are specified, the bloom index is created by default on all supported columns. `bloom_index_columns=''` disables the bloom indexing.                                                                                        |
| compression                    | `compression = '<compression>'`                     | Specifies the compression method for the engine. Compression options include lz4, zstd, snappy, or none. The compression method defaults to zstd in object storage and lz4 in file system (fs) storage.                                                                                                                                                                                 |
| storage_format                 | `storage_format = '<storage_format>'`               | Specifies how data is stored. By default, the storage_format is set to **Parquet**, which offers high compression and is ideal for cloud-native object storage. Additionally, the experimental **Native** format is supported, optimizing memory copy overhead for storage devices like file systems.                                                                                   |
| snapshot_loc                   | `snapshot_loc = '<snapshot_loc>'`                   | Specifies a location parameter in string format, allowing easy sharing of a table without data copy.                                                                                                                                                                                                                                                                                    |
| block_size_threshold           | `block_size_threshold = <n>`                        | Specifies the maximum block size in bytes. Defaults to 104,857,600 bytes.                                                                                                                                                                                                                                                                                                               |
| block_per_segment              | `block_per_segment = <n>`                           | Specifies the maximum number of blocks in a segment. Defaults to 1,000.                                                                                                                                                                                                                                                                                                                 |
| row_per_block                  | `row_per_block = <n>`                               | Specifies the maximum number of rows in a file. Defaults to 1,000,000.                                                                                                                                                                                                                                                                                                                  |
| change_tracking                | `change_tracking = True / False`                    | Setting this option to `True` in the Fuse Engine allows for tracking changes for a table.<br/>Creating a stream for a table will automatically set `change_tracking` to `True` and introduce additional hidden columns to the table as change tracking metadata. For more information, see [How Stream Works](/guides/load-data/continuous-data-pipelines/stream#how-stream-works).     |
| data_retention_period_in_hours | `data_retention_period_in_hours = <n>`              | Specifies the number of hours to retain table data. The minimum value is 1 hour. The maximum value is defined by the `data_retention_time_in_days_max` setting in the [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) configuration file , or defaults to 2,160 hours (90 days x 24 hours) if not specified. |
| data_retention_num_snapshots_to_keep | `data_retention_num_snapshots_to_keep = <n>`  | Specifies the number of snapshots to retain for a table. This option works in conjunction with the `enable_auto_vacuum` setting to provide granular control over snapshot retention policies on a per-table basis. When set, only the specified number of most recent snapshots will be kept after vacuum operations. |

