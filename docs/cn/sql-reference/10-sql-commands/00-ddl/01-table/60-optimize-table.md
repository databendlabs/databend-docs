---
title: OPTIMIZE TABLE
sidebar_position: 8
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="Introduced or updated: v1.2.395"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

在 Databend 中优化表包括压缩或清除历史数据，以节省存储空间并提高查询性能。

<DetailsWrap>

<details>
  <summary>为什么要优化？</summary>
    <div>Databend 使用 Parquet 格式将数据存储在表中，Parquet 格式被组织成块。此外，Databend 支持时间回溯功能，其中每个修改表的操作都会生成一个 Parquet 文件，该文件捕获并反映对表所做的更改。</div><br/>

   <div>随着时间的推移，当一个表积累了更多的 Parquet 文件时，可能会导致性能问题和存储需求的增加。为了优化表的性能，可以删除不再需要的历史 Parquet 文件。这种优化有助于提高查询性能并减少表使用的存储空间量。</div>
</details>

</DetailsWrap>

## Databend 数据存储：快照、段和块

快照、段和块是 Databend 用于数据存储的概念。Databend 使用它们来构建用于存储表数据的分层结构。

![](/img/sql/storage-structure.PNG)

Databend 在数据更新时自动创建表快照。快照表示表段元数据的版本。

当使用 Databend 时，当您使用 [AT](../../20-query-syntax/03-query-at.md) 子句检索和查询表的先前版本的数据时，您最有可能使用快照 ID 访问快照。

快照是一个 JSON 文件，它不保存表的数据，但指示快照链接到的段。如果您对表运行 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)，您可以找到为该表保存的快照。

段是一个 JSON 文件，用于组织存储数据的存储块（至少 1 个，最多 1,000 个）。如果您使用快照 ID 对快照运行 [FUSE_SEGMENT](../../../20-sql-functions/16-system-functions/fuse_segment.md)，您可以找到快照引用的段。

Databends 将实际表数据保存在 parquet 文件中，并将每个 parquet 文件视为一个块。如果您使用快照 ID 对快照运行 [FUSE_BLOCK](../../../20-sql-functions/16-system-functions/fuse_block.md)，您可以找到快照引用的块。

Databend 为每个数据库和表创建一个唯一的 ID，用于存储快照、段和块文件，并将它们保存到对象存储中的路径 `<bucket_name>/<tenant_id>/<db_id>/<table_id>/`。每个快照、段和块文件都使用 UUID（32 个字符的小写十六进制字符串）命名。

| 文件     | 格式  | 文件名                        | 存储文件夹                                      |
|----------|---------|---------------------------------|-----------------------------------------------------|
| Snapshot | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_ss/` |
| Segment  | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_sg/` |
| Block    | parquet | `<32bitUUID>_<version>.parquet` | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_b/`  |

## 表优化

在 Databend 中，建议以 100MB（未压缩）或 1,000,000 行作为理想的块大小，每个段由 1,000 个块组成。为了最大限度地优化表，至关重要的是要清楚地了解何时以及如何应用各种优化技术，例如 [段压缩](#segment-compaction)、[块压缩](#block-compaction) 和 [清除](#purging)。

- 当使用 COPY INTO 或 REPLACE INTO 命令将数据写入包含聚簇键的表时，Databend 将自动启动重新聚簇过程，以及段和块压缩过程。

- 段和块压缩支持在集群环境中进行分布式执行。您可以通过将 ENABLE_DISTRIBUTED_COMPACT 设置为 1 来启用它们。这有助于提高集群环境中的数据查询性能和可伸缩性。

  ```sql
  SET enable_distributed_compact = 1;
  ```

### 段压缩

当一个表有太多小段（每个段小于 `100 blocks`）时，压缩段。
```sql
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('your-database', 'your-table')
    LIMIT 1;
```

**语法**

```sql
OPTIMIZE TABLE [database.]table_name COMPACT SEGMENT [LIMIT <segment_count>]    
```

通过将小段合并为大段来压缩表数据。

- 选项 LIMIT 设置要压缩的最大段数。在这种情况下，Databend 将选择并压缩最新的段。

**示例**

```sql
-- Check whether need segment compact
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits');

+-------------+---------------+-------------------------------------+
| block_count | segment_count | advice                              |
+-------------+---------------+-------------------------------------+
|         751 |            32 | The table needs segment compact now |
+-------------+---------------+-------------------------------------+
    
-- Compact segment
OPTIMIZE TABLE hits COMPACT SEGMENT;
    
-- Check again
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              'The table needs segment compact now',
              'The table does not need segment compact now'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits')
    LIMIT 1;

+-------------+---------------+---------------------------------------------+
| block_count | segment_count | advice                                      |
+-------------+---------------+---------------------------------------------+
|         751 |             1 | The table does not need segment compact now |
+-------------+---------------+---------------------------------------------+
```

### 块压缩

当一个表有大量小块或当该表有很高比例的插入、删除或更新的行时，压缩块。

您可以通过检查每个块的未压缩大小是否接近 `100MB` 的完美大小来检查它。

如果大小小于 `50MB`，我们建议进行块压缩，因为它表示有太多小块：

```sql
SELECT
  block_count,
  humanize_size(bytes_uncompressed / block_count) AS per_block_uncompressed_size,
  IF(
              bytes_uncompressed / block_count / 1024 / 1024 < 50,
              'The table needs block compact now',
              'The table does not need block compact now'
    ) AS advice
FROM
  fuse_snapshot('your-database', 'your-table')
    LIMIT 1;
```

:::info
我们建议先执行段压缩，然后再执行块压缩。
:::

**语法**
```sql
OPTIMIZE TABLE [database.]table_name COMPACT [LIMIT <segment_count>]    
```
通过将小块和段合并为大块和段来压缩表数据。

- 此命令创建最新表数据的新快照（以及压缩的段和块），而不影响现有存储文件，因此在您清除历史数据之前，不会释放存储空间。

- 根据给定表的大小，完成执行可能需要相当长的时间。

- 选项 LIMIT 设置要压缩的最大段数。在这种情况下，Databend 将选择并压缩最新的段。

- Databend 将在压缩过程后自动重新聚簇聚簇表。

**示例**
```sql
OPTIMIZE TABLE my_database.my_table COMPACT LIMIT 50;
```

### 清除

清除会永久删除历史数据，包括未使用的快照、段和块，但保留期内的快照（包括此快照引用的段和块）除外。这可以节省存储空间，但可能会影响时间回溯功能。在以下情况下考虑清除：

- 存储成本是一个主要问题，并且您不需要历史数据用于时间回溯或其他目的。
- 您已经压缩了您的表，并且想要删除较旧的、未使用的的数据。

:::note
默认保留期为 24 小时的历史数据将不会被删除。要调整保留期，请使用 *data_retention_time_in_days* 设置。
:::

**语法**

```sql
OPTIMIZE TABLE <table_name> PURGE 
  [ BEFORE 
          (SNAPSHOT => '<SNAPSHOT_ID>') | 
          (TIMESTAMP => '<TIMESTAMP>'::TIMESTAMP) |
          (STREAM => <stream_name>)
  ]
  [ LIMIT <snapshot_count> ]
```

| 参数 | 描述 |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BEFORE    | 指定清除历史数据的条件。它与 `SNAPSHOT`、`TIMESTAMP` 或 `STREAM` 选项一起使用，以定义应清除数据的时间点。<br/>当指定 `BEFORE` 选项时，该命令首先选择一个基本快照（如指定选项所示）来清除历史数据。随后，它会删除在此基本快照之前生成的快照。在指定带有 `BEFORE STREAM` 的流的情况下，该命令会将创建流之前的最近快照识别为基本快照。然后，它会删除在此最近快照之前生成的快照。|
| LIMIT     | 设置要清除的最大快照数。指定后，Databend 将选择并清除最旧的快照，最多达到指定的计数。 |

**示例**

此示例演示如何使用 `BEFORE STREAM` 选项清除历史数据。

1. 创建一个名为 `t` 的表，其中包含一个列 `a`，并将两行值 1 和 2 插入到表中。

```sql
CREATE TABLE t(a INT);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
```

2. 在表 `t` 上创建一个名为 `s` 的流，并将一个值为 3 的附加行添加到表中。

```sql
CREATE STREAM s ON TABLE t;

INSERT INTO t VALUES(3);
```

3. 返回表 `t` 的快照 ID 和相应的时间戳。

```sql
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 00dd8ca67c1f461987f31a6b3a1c3c84 │ 2024-04-02 18:09:39.157702 │
│ e448bb2bf488489dae7294b0a8af38d1 │ 2024-04-02 18:09:34.986507 │
│ 2ac038dd83e741afbae543b170105d63 │ 2024-04-02 18:09:34.966336 │
└───────────────────────────────────────────────────────────────┘

-- 仅出于演示目的，将数据保留时间设置为 0。不建议在生产中使用。
SET data_retention_time_in_days = 0;
```

4. 使用 `BEFORE STREAM` 选项清除历史快照。

```sql
OPTIMIZE TABLE t PURGE BEFORE (STREAM => s);

-- 该命令选择快照 ID e448bb2bf488489dae7294b0a8af38d1 作为基本快照，该快照是在创建流“s”之前立即生成的。
-- 因此，将删除在基本快照之前生成的快照 ID 2ac038dd83e741afbae543b170105d63。
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 00dd8ca67c1f461987f31a6b3a1c3c84 │ 2024-04-02 18:09:39.157702 │
│ e448bb2bf488489dae7294b0a8af38d1 │ 2024-04-02 18:09:34.986507 │
└───────────────────────────────────────────────────────────────┘
```