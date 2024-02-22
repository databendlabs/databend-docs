---
title: Fuse Engine
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.223"/>

Databend utilizes the Fuse Engine as its default engine, offering a data management system with a user-friendly interface reminiscent of Git. Users have the ability to effortlessly query data at any given moment and effortlessly restore data to any desired point in time.

**Related topic**: [Find Peter Parker in Databend](https://www.databend.com/blog/time-travel)

## Syntax

```sql
CREATE TABLE table_name (
  column_name1 column_type1,
  column_name2 column_type2,
  ...
) [ENGINE = FUSE] [CLUSTER BY(<expr> [, <expr>, ...] )] [Options];
```

For more information about the CREATE TABLE command, see [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md).

### ENGINE

If an engine is not explicitly specified, Databend will automatically default to using the Fuse Engine to create tables, which is equivalent to `Engine = FUSE`.

### CLUSTER BY

The `CLUSTER BY` parameter specifies the sorting method for data that consists of multiple expressions, which is useful during compaction or recluster. A suitable `CLUSTER BY` parameter can significantly accelerate queries.

### Options

The Fuse Engine offers the following options (case-insensitive) that enable you to customize the engine's functionality even further. To modify the options of an existing table, use the [ALTER TABLE OPTION](../../10-sql-commands/00-ddl/01-table/90-alter-table-option.md) command.

| Option               	| Syntax                                              	| Description                                                                                                                                                                                                                                                                                           	|
|----------------------	|-----------------------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| bloom_index_columns  	| `bloom_index_columns = '<column> [, <column> ...]'` 	| Specifies the columns to be used for the bloom index. The data type of these columns can be Map, Number, String, Date, or Timestamp. If no specific columns are specified, the bloom index is created by default on all supported columns. `bloom_index_columns=''` disables the bloom indexing.                                                            	|
| compression          	| `compression = '<compression>'`                     	| Specifies the compression method for the engine. Compression options include lz4, zstd, snappy, or none. The compression method defaults to zstd in object storage and lz4 in file system (fs) storage.                                                                                               	|
| storage_format       	| `storage_format = '<storage_format>'`               	| Specifies how data is stored. By default, the storage_format is set to **Parquet**, which offers high compression and is ideal for cloud-native object storage. Additionally, the experimental **Native** format is supported, optimizing memory copy overhead for storage devices like file systems. 	|
| snapshot_loc         	| `snapshot_loc = '<snapshot_loc>'`                   	| Specifies a location parameter in string format, allowing easy sharing of a table without data copy.                                                                                                                                                                                                  	|
| block_size_threshold 	| `block_size_threshold = '<block_size_threshold>'`   	| Specifies the maximum block size in bytes. Defaults to 104,857,600 bytes.                                                                                                                                                                                                                                                     	|
| block_per_segment    	| `block_per_segment = '<block_per_segment>'`         	| Specifies the maximum number of blocks in a segment. Defaults to 1,000.                                                                                                                                                                                                                               	|
| row_per_block        	| `row_per_block = '<row_per_block>'`                 	| Specifies the maximum number of rows in a file. Defaults to 1,000,000.                                                                                                                                                                                                                                   	|
| change_tracking       | `change_tracking = True / False`                      | Setting this option to `True` in the Fuse Engine allows for tracking changes for a table.<br/>Creating a stream for a table will automatically set `change_tracking` to `True` and introduce additional hidden columns to the table as change tracking metadata. For more information, see [How Stream Works](../../10-sql-commands/00-ddl/04-stream/index.md#how-stream-works).|
