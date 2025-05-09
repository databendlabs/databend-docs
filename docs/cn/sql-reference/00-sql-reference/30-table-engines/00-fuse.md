---
title: Fuse Engine 表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.733"/>

## 概述

Databend 使用 Fuse Engine 作为其默认存储引擎，提供类似于 Git 的数据管理系统，具有以下特点：

- **基于快照的架构**: 查询和恢复任何时间点的数据，具有数据变更历史以进行恢复
- **高性能**: 针对分析工作负载进行了优化，具有自动索引和 Bloom 过滤器
- **高效存储**: 使用 Parquet 格式，具有高压缩率，可实现最佳存储效率
- **灵活配置**: 可自定义压缩、索引和存储选项
- **数据维护**: 自动数据保留、快照管理和变更跟踪功能

## 何时使用 Fuse Engine

适用于：
- **分析**: 具有列式存储的 OLAP 查询
- **数仓**: 大量历史数据
- **时间回溯**: 访问历史数据版本
- **云存储**: 针对对象存储进行了优化

## 语法

```sql
CREATE TABLE <table_name> (
  <column_definitions>
) [ENGINE = FUSE]
[CLUSTER BY (<expr> [, <expr>, ...] )]
[<Options>];
```

有关 `CREATE TABLE` 语法的更多详细信息，请参阅 [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md)。

## 参数

以下是创建 Fuse Engine 表的主要参数：

#### `ENGINE`
- **描述:**
  如果未显式指定引擎，Databend 将自动默认使用 Fuse Engine 创建表，这等效于 `ENGINE = FUSE`。

---

#### `CLUSTER BY`
- **描述:**
  指定由多个表达式组成的数据的排序方法。 有关更多信息，请参见 [Cluster Key](/guides/performance/cluster-key)。

---

#### `<Options>`
- **描述:**
  Fuse Engine 提供了各种选项（不区分大小写），允许您自定义表的属性。
  - 有关详细信息，请参见 [Fuse Engine 选项](#fuse-engine-options)。
  - 使用空格分隔多个选项。
  - 使用 [ALTER TABLE OPTION](../../10-sql-commands/00-ddl/01-table/90-alter-table-option.md) 修改表的选项。
  - 使用 [SHOW CREATE TABLE](../../10-sql-commands/00-ddl/01-table/show-create-table.md) 显示表的选项。

---

## Fuse Engine 选项

以下是可用的 Fuse Engine 选项，按其用途分组：

---

### `compression`
- **语法:**
  `compression = '<compression>'`
- **描述:**
  指定引擎的压缩方法。 压缩选项包括 lz4、zstd、snappy 或 none。 压缩方法在对象存储中默认为 zstd，在文件系统 (fs) 存储中默认为 lz4。

---

### `snapshot_loc`
- **语法:**
  `snapshot_loc = '<snapshot_loc>'`
- **描述:**
  以字符串格式指定位置参数，允许轻松共享表而无需复制数据。

---


### `block_size_threshold`
- **语法:**
  `block_size_threshold = <n>`
- **描述:**
  指定最大块大小（以字节为单位）。 默认为 104,857,600 字节。

---

### `block_per_segment`
- **语法:**
  `block_per_segment = <n>`
- **描述:**
  指定段中的最大块数。 默认为 1,000。

---

### `row_per_block`
- **语法:**
  `row_per_block = <n>`
- **描述:**
  指定文件中的最大行数。 默认为 1,000,000。

---

### `bloom_index_columns`
- **语法:**
  `bloom_index_columns = '<column> [, <column> ...]'`
- **描述:**
  指定要用于 Bloom 索引的列。 这些列的数据类型可以是 Map、Number、String、Date 或 Timestamp。 如果未指定特定列，则默认情况下会在所有支持的列上创建 Bloom 索引。 `bloom_index_columns=''` 禁用 Bloom 索引。

---

### `change_tracking`
- **语法:**
  `change_tracking = True / False`
- **描述:**
  在 Fuse Engine 中将此选项设置为 `True` 允许跟踪表的更改。 为表创建 Stream 会自动将 `change_tracking` 设置为 `True`，并向表中引入额外的隐藏列作为更改跟踪元数据。 有关更多信息，请参见 [How Stream Works](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。

---

### `data_retention_period_in_hours`
- **语法:**
  `data_retention_period_in_hours = <n>`
- **描述:**
  指定保留表数据的小时数。 最小值为 1 小时。 最大值由 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的 `data_retention_time_in_days_max` 设置定义，如果未指定，则默认为 2,160 小时（90 天 x 24 小时）。

---

### `data_retention_num_snapshots_to_keep`
- **语法:**
  `data_retention_num_snapshots_to_keep = <n>`
- **描述:**
  指定要为表保留的快照数。 此选项与 `enable_auto_vacuum` 设置结合使用，以提供对每个表的快照保留策略的精细控制。 设置后，在 vacuum 操作后，只会保留指定数量的最新快照。

---