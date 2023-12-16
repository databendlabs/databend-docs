---
title: Fuse Engine
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.223"/>

Databend使用Fuse引擎作为默认引擎，提供了一个类似Git的用户友好界面的数据管理系统。用户可以轻松地在任何时刻查询数据，并轻松地将数据恢复到任何所需的时间点。

**相关主题**：[在Databend中找到Peter Parker](https://www.databend.com/blog/time-travel)

## 语法

```sql
CREATE TABLE 表名 (
  列名1 列类型1,
  列名2 列类型2,
  ...
) [ENGINE = Fuse] [CLUSTER BY(<表达式> [, <表达式>, ...] )] [选项];
```

有关CREATE TABLE命令的更多信息，请参见[CREATE TABLE](../../14-sql-commands/00-ddl/20-table/10-ddl-create-table.md)。

### ENGINE

如果没有显式指定引擎，Databend将自动默认使用Fuse引擎来创建表，相当于`Engine = Fuse`。

### CLUSTER BY

`CLUSTER BY`参数指定由多个表达式组成的数据的排序方法，在压缩或重新聚集时非常有用。合适的`CLUSTER BY`参数可以显著加快查询速度。

### 选项

Fuse引擎提供以下选项（不区分大小写），可以进一步自定义引擎的功能。要修改现有表的选项，请使用[ALTER TABLE OPTION](../../14-sql-commands/00-ddl/20-table/90-alter-table-option.md)命令。

| 选项                 	| 语法                                              	| 描述                                                                                                                                                                                                                                                                                                	|
|----------------------	|-----------------------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| bloom_index_columns  	| `bloom_index_columns = '<column> [, <column> ...]'` 	| 指定用于布隆索引的列。这些列的数据类型可以是 Map、Number、String、Date 或 Timestamp。如果没有指定特定的列，则默认在所有支持的列上创建布隆索引。`bloom_index_columns=''` 禁用布隆索引。                                                            	|
| compression          	| `compression = '<compression>'`                     	| 指定引擎的压缩方法。压缩选项包括 lz4、zstd、snappy 或 none。在对象存储中，默认的压缩方法是 zstd，在文件系统 (fs) 存储中，默认的压缩方法是 lz4。                                                                                               	|
| storage_format       	| `storage_format = '<storage_format>'`               	| 指定数据的存储格式。默认情况下，storage_format 设置为 **Parquet**，它具有高压缩率，非常适合云原生对象存储。此外，还支持实验性的 **Native** 格式，优化了存储设备（如文件系统）的内存复制开销。 	|
| snapshot_loc         	| `snapshot_loc = '<snapshot_loc>'`                   	| 以字符串格式指定位置参数，方便共享表而无需复制数据。                                                                                                                                                                                                  	|
| block_size_threshold 	| `block_size_threshold = '<block_size_threshold>'`   	| 指定最大块大小（以字节为单位）。默认为 104,857,600 字节。                                                                                                                                                                                                                                                     	|
| block_per_segment    	| `block_per_segment = '<block_per_segment>'`         	| 指定段中的最大块数。默认为 1,000。                                                                                                                                                                                                                               	|
| row_per_block        	| `row_per_block = '<row_per_block>'`                 	| 指定文件中的最大行数。默认为 1,000,000。                                                                                                                                                                                                                                   	|
| change_tracking       | `change_tracking = True / False`                      | 在 Fuse 引擎中将此选项设置为 `True`，可以跟踪表的更改。<br/>为表创建流将自动将 `change_tracking` 设置为 `True`，并向表中引入额外的隐藏列作为更改跟踪元数据。有关更多信息，请参阅 [流式处理工作原理](../../14-sql-commands/00-ddl/stream/index.md#how-stream-works)。|