---
title: Fuse 引擎
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新：v1.2.223"/>

Databend 使用 FUSE 引擎作为其默认引擎，提供了一个类似于 Git 的用户友好界面的数据管理系统。用户可以随时轻松查询数据，并且可以轻松地将数据恢复到任何期望的时间点。

**相关主题**：[在 Databend 中找到 Peter Parker](https://www.databend.com/blog/time-travel)

## 语法

```sql
CREATE TABLE table_name (
  column_name1 column_type1,
  column_name2 column_type2,
  ...
) [ENGINE = FUSE] [CLUSTER BY(<expr> [, <expr>, ...] )] [选项];
```

有关 CREATE TABLE 命令的更多信息，请参见 [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md)。

### ENGINE

如果没有明确指定引擎，Databend 将自动默认使用 FUSE 引擎来创建表，这等同于 `Engine = FUSE`。

### CLUSTER BY

`CLUSTER BY` 参数指定了由多个表达式组成的数据的排序方法，这在压缩或重新聚类时非常有用。合适的 `CLUSTER BY` 参数可以显著加速查询。

### 选项

FUSE 引擎提供以下选项（不区分大小写），使您能够进一步自定义引擎的功能。要修改现有表的选项，请使用 [ALTER TABLE OPTION](../../10-sql-commands/00-ddl/01-table/90-alter-table-option.md) 命令。

| 选项                    | 语法                                                   | 描述                                                                                                                                                                                                                                                                     |
|----------------------   |-----------------------------------------------------   |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------   |
| bloom_index_columns    | `bloom_index_columns = '<column> [, <column> ...]'`    | 指定用于布隆索引的列。这些列的数据类型可以是 Map、Number、String、Date 或 Timestamp。如果没有指定特定列，则默认在所有支持的列上创建布隆索引。`bloom_index_columns=''` 禁用布隆索引。                                                                                      |
| compression            | `compression = '<compression>'`                        | 指定引擎的压缩方法。压缩选项包括 lz4、zstd、snappy 或 none。在对象存储中，默认的压缩方法为 zstd，在文件系统（fs）存储中为 lz4。                                                                                                                                       |
| storage_format         | `storage_format = '<storage_format>'`                  | 指定数据的存储方式。默认情况下，storage_format 设置为 **Parquet**，它提供高压缩率，非常适合云原生对象存储。此外，还支持实验性的 **Native** 格式，优化了存储设备（如文件系统）的内存复制开销。                                                                                     |
| snapshot_loc           | `snapshot_loc = '<snapshot_loc>'`                      | 以字符串格式指定位置参数，允许轻松共享表而无需数据复制。                                                                                                                                                                                                                 |
| block_size_threshold   | `block_size_threshold = '<block_size_threshold>'`      | 指定最大块大小（以字节为单位）。默认为 104,857,600 字节。                                                                                                                                                                                                               |
| block_per_segment      | `block_per_segment = '<block_per_segment>'`            | 指定段中的最大块数。默认为 1,000。                                                                                                                                                                                                                                       |
| row_per_block          | `row_per_block = '<row_per_block>'`                    | 指定文件中的最大行数。默认为 1,000,000。                                                                                                                                                                                                                                 |
| change_tracking        | `change_tracking = True / False`                       | 在 FUSE 引擎中将此选项设置为 `True` 允许跟踪表的更改。<br/>为表创建流将自动将 `change_tracking` 设置为 `True` 并为表引入额外的隐藏列作为更改跟踪元数据。更多信息，请参见 [如何工作流](../../10-sql-commands/00-ddl/04-stream/index.md#how-stream-works)。|