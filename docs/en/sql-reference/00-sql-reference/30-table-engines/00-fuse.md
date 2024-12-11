---
title: Fuse Engine
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.617"/>

Databend utilizes the Fuse Engine as its default engine, offering a data management system with a user-friendly interface reminiscent of Git. Users have the ability to effortlessly query data at any given moment and effortlessly restore data to any desired point in time.

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
