---
title: Fuse Engine
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.733"/>

Databend 采用 Fuse Engine 作为其默认引擎，提供了一个用户界面友好的数据管理系统，让人联想到 Git。用户可以轻松地查询任何给定时刻的数据，并毫不费力地将数据恢复到任何所需的点。

## 语法

```sql
CREATE TABLE <table_name> (
  <column_definitions>
) [ENGINE = FUSE]
[CLUSTER BY (<expr> [, <expr>, ...] )]
[<Options>];
```

有关 `CREATE TABLE` 语法的更多详细信息，请参见 [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md)。

| 参数         | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ENGINE`     | 如果未明确指定引擎，Databend 将自动默认使用 Fuse Engine 创建表，这等效于 `ENGINE = FUSE`。                                                                                                                                                                                                                                                                                                                                                                              |
| `CLUSTER BY` | 指定由多个表达式组成的数据的排序方法。有关更多信息，请参见 [Cluster Key](/guides/performance/cluster-key)。                                                                                                                                                                                                                                                                                                                                                                |
| `<Options>`  | Fuse Engine 提供了各种选项（不区分大小写），允许您自定义表的属性。有关详细信息，请参见 [Fuse Engine Options](#fuse-engine-options)。<br/>- 使用空格分隔多个选项。<br/>- 使用 [ALTER TABLE OPTION](../../10-sql-commands/00-ddl/01-table/90-alter-table-option.md) 修改表的选项。<br/>- 使用 [SHOW CREATE TABLE](../../10-sql-commands/00-ddl/01-table/show-create-table.md) 显示表的选项。 |

## Fuse Engine Options

以下是可用的 Fuse Engine 选项：


| 选项                         | 语法                                              | 描述                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------ | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bloom_index_columns            | `bloom_index_columns = '<column> [, <column> ...]'` | 指定用于 Bloom 索引的列。这些列的数据类型可以是 Map、Number、String、Date 或 Timestamp。如果未指定特定列，则默认在所有支持的列上创建 Bloom 索引。`bloom_index_columns=''` 禁用 Bloom 索引。                                                                                                                                                                                                                    |
| compression                    | `compression = '<compression>'`                     | 指定引擎的压缩方法。压缩选项包括 lz4、zstd、snappy 或 none。默认情况下，对象存储中的压缩方法为 zstd，文件系统 (fs) 存储中的压缩方法为 lz4。                                                                                                                                                                                                                |
| storage_format                 | `storage_format = '<storage_format>'`               | 指定数据的存储方式。默认情况下，storage_format 设置为 **Parquet**，它提供高压缩率，非常适合云原生对象存储。此外，还支持实验性的 **Native** 格式，优化了文件系统等存储设备的内存复制开销。                                                                                                                                                                                               |
| snapshot_loc                   | `snapshot_loc = '<snapshot_loc>'`                   | 以字符串格式指定位置参数，允许轻松共享表，而无需复制数据。                                                                                                                                                                                                                                                                                    |
| block_size_threshold           | `block_size_threshold = <n>`                        | 指定最大块大小（以字节为单位）。默认为 104,857,600 字节。                                                                                                                                                                                                                                                                                                               |
| block_per_segment              | `block_per_segment = <n>`                           | 指定一个段中的最大块数。默认为 1,000。                                                                                                                                                                                                                                                                                                                 |
| row_per_block                  | `row_per_block = <n>`                               | 指定文件中的最大行数。默认为 1,000,000。                                                                                                                                                                                                                                                                                                                  |
| change_tracking                | `change_tracking = True / False`                    | 在 Fuse 引擎中将此选项设置为 `True` 允许跟踪表的更改。<br/>为表创建流将自动将 `change_tracking` 设置为 `True`，并向表中引入额外的隐藏列作为更改跟踪元数据。有关更多信息，请参见 [流的工作原理](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。     |
| data_retention_period_in_hours | `data_retention_period_in_hours = <n>`              | 指定保留表数据的小时数。最小值为 1 小时。最大值由 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的 `data_retention_time_in_days_max` 设置定义，如果未指定，则默认为 2,160 小时（90 天 x 24 小时）。 |
| data_retention_num_snapshots_to_keep | `data_retention_num_snapshots_to_keep = <n>`  | 指定要为表保留的快照数。此选项与 `enable_auto_vacuum` 设置结合使用，以提供对每个表的快照保留策略的精细控制。设置后，在 vacuum 操作后，只会保留指定数量的最新快照。 |