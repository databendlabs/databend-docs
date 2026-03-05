---
title: Fuse Engine 表
---

import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.736"/>

## 概述

Databend 使用 Fuse Engine 作为其默认存储引擎，提供类似于 Git 的数据管理系统，具有以下特点：

- **基于快照的架构**：可以查询和恢复任何时间点的数据，具有数据变更历史以进行恢复
- **高性能**：针对分析工作负载进行了优化，具有自动索引和 Bloom Filter
- **高效存储**：使用 Parquet 格式，具有高压缩率，可实现最佳存储效率
- **灵活配置**：可自定义压缩、索引和存储选项
- **数据维护**：自动数据保留、快照管理和变更跟踪功能

## 何时使用 Fuse Engine

适用于：

- **分析**：具有列式存储的 OLAP 查询
- **数仓**：大量历史数据
- **时间回溯**：访问历史数据版本
- **云存储**：针对对象存储进行了优化

## 语法

```sql
CREATE TABLE <table_name> (
  <column_definitions>
) [ENGINE = FUSE]
[CLUSTER BY (<expr> [, <expr>, ...] )]
[<Options>];
```

有关 `CREATE TABLE` 语法的更多详细信息，请参见 [CREATE TABLE](../../10-sql-commands/00-ddl/01-table/10-ddl-create-table.md)。

## 参数

以下是创建 Fuse Engine 表的主要参数：

#### `ENGINE`

- **描述：**
  如果未显式指定引擎，Databend 将自动默认使用 Fuse Engine 创建表，这等效于 `ENGINE = FUSE`。

---

#### `CLUSTER BY`

- **描述：**
  指定由多个表达式组成的数据的排序方法。有关更多信息，请参见 [Cluster Key](/guides/performance/cluster-key)。

---

#### `<Options>`

- **描述：**
  Fuse Engine 提供了各种选项（不区分大小写），允许您自定义表的属性。
  - 有关详细信息，请参见 [Fuse Engine Options](#fuse-engine-options)。
  - 使用空格分隔多个选项。
  - 使用 [ALTER TABLE](../../10-sql-commands/00-ddl/01-table/90-alter-table.md#fuse-引擎选项) 修改表的选项。
  - 使用 [SHOW CREATE TABLE](../../10-sql-commands/00-ddl/01-table/show-create-table.md) 显示表的选项。

---

## Fuse Engine 选项

以下是可用的 Fuse Engine 选项，按其用途分组：

---

### `compression`

- **语法：**
  `compression = '<compression>'`
- **描述：**
  指定引擎的压缩方法。压缩选项包括 lz4、zstd、snappy 或 none。压缩方法在对象存储中默认为 zstd，在文件系统 (fs) 存储中默认为 lz4。

---

### `snapshot_loc`

- **语法：**
  `snapshot_loc = '<snapshot_loc>'`
- **描述：**
  以字符串格式指定位置参数，允许轻松共享表而无需复制数据。

---

### `block_size_threshold`

- **语法：**
  `block_size_threshold = <n>`
- **描述：**
  指定最大块大小（以字节为单位）。默认为 104,857,600 字节。

---

### `block_per_segment`

- **语法：**
  `block_per_segment = <n>`
- **描述：**
  指定一个段中的最大块数。默认为 1,000。

---

### `row_per_block`

- **语法：**
  `row_per_block = <n>`
- **描述：**
  指定文件中的最大行数。默认为 1,000,000。

---

### `bloom_index_columns`

- **语法：**
  `bloom_index_columns = '<column> [, <column> ...]'`
- **描述：**
  指定要用于 Bloom Index 的列。这些列的数据类型可以是 Map、Number、String、Date 或 Timestamp。如果未指定任何特定列，则默认情况下会在所有受支持的列上创建 Bloom Index。 `bloom_index_columns=''` 禁用 Bloom Index。

---

### `change_tracking`

- **语法：**
  `change_tracking = True / False`
- **描述：**
  在 Fuse Engine 中将此选项设置为 `True` 允许跟踪表的更改。为表创建 Stream 会自动将 `change_tracking` 设置为 `True`，并将其他隐藏列引入到表中作为更改跟踪元数据。有关更多信息，请参见 [How Stream Works](/guides/load-data/continuous-data-pipelines/stream#how-stream-works)。

---

### `data_retention_period_in_hours`

- **语法：**
  `data_retention_period_in_hours = <n>`
- **描述：**
  指定保留表数据的小时数。最小值为 1 小时。最大值由 [databend-query.toml](https://github.com/databendlabs/databend/blob/main/scripts/distribution/configs/databend-query.toml) 配置文件中的 `data_retention_time_in_days_max` 设置定义，如果未指定，则默认为 2,160 小时（90 天 x 24 小时）。

---

### `enable_auto_vacuum`

- **语法：**
  `enable_auto_vacuum = 0 / 1`
- **描述：**
  控制表是否在 mutations 期间自动触发 vacuum 操作。这可以全局设置为所有表的设置，也可以在表级别进行配置。表级别选项的优先级高于同名的会话/全局设置。启用后（设置为 1），在 INSERT 或 ALTER TABLE 等 mutations 之后将自动触发 vacuum 操作，根据配置的保留策略清理表数据。

  **示例：**

  ```sql
  -- 全局设置 enable_auto_vacuum，适用于所有会话中的所有表
  SET GLOBAL enable_auto_vacuum = 1;

  -- 创建一个禁用自动 vacuum 的表（覆盖全局设置）
  CREATE OR REPLACE TABLE t1 (id INT) ENABLE_AUTO_VACUUM = 0;
  INSERT INTO t1 VALUES(1); -- 即使有全局设置也不会触发 vacuum

  -- 创建另一个继承全局设置的表
  CREATE OR REPLACE TABLE t2 (id INT);
  INSERT INTO t2 VALUES(1); -- 由于全局设置，将触发 vacuum

  -- 为现有表启用自动 vacuum
  ALTER TABLE t1 SET OPTIONS(ENABLE_AUTO_VACUUM = 1);
  INSERT INTO t1 VALUES(2); -- 现在将触发 vacuum

  -- 表选项优先于全局设置
  SET GLOBAL enable_auto_vacuum = 0; -- 全局关闭
  -- t1 仍然会 vacuum，因为表设置覆盖了全局设置
  INSERT INTO t1 VALUES(3); -- 仍然会触发 vacuum
  INSERT INTO t2 VALUES(2); -- 不再触发 vacuum
  ```

---

### `data_retention_num_snapshots_to_keep`

- **语法：**
  `data_retention_num_snapshots_to_keep = <n>`
- **描述：**
  指定在 vacuum 操作期间要保留的快照数。这可以全局设置为所有表的设置，也可以在表级别进行配置。表级别选项的优先级高于同名的会话/全局设置。设置后，在 vacuum 操作后只会保留指定数量的最新快照。覆盖 `data_retention_time_in_days` 设置。如果设置为 0，则将忽略此设置。此选项与 `enable_auto_vacuum` 设置结合使用，以提供对快照保留策略的精细控制。

  **示例：**

  ```sql
  -- 将全局保留设置为所有会话中所有表的 10 个快照
  SET GLOBAL data_retention_num_snapshots_to_keep = 10;

  -- 创建一个具有自定义快照保留的表（覆盖全局设置）
  CREATE OR REPLACE TABLE t1 (id INT)
    enable_auto_vacuum = 1
    data_retention_num_snapshots_to_keep = 5;

  -- 创建另一个继承全局设置的表
  CREATE OR REPLACE TABLE t2 (id INT) enable_auto_vacuum = 1;

  -- 当触发 vacuum 时：
  -- t1 将保留 5 个快照（表设置）
  -- t2 将保留 10 个快照（全局设置）

  -- 更改全局设置
  SET GLOBAL data_retention_num_snapshots_to_keep = 20;

  -- 表选项仍然优先：
  -- t1 仍然只会保留 5 个快照
  -- t2 现在将保留 20 个快照

  -- 修改现有表的快照保留
  ALTER TABLE t1 SET OPTIONS(data_retention_num_snapshots_to_keep = 3);
  -- 现在，当触发 vacuum 时，t1 将保留 3 个快照
  ```

---
