---
title: OPTIMIZE TABLE
sidebar_position: 8
---
import FunctionDescription from '@site/src/components/FunctionDescription';

<FunctionDescription description="引入或更新: v1.2.395"/>

import DetailsWrap from '@site/src/components/DetailsWrap';

在Databend中优化表涉及压缩或清除历史数据，以节省存储空间并提高查询性能。

<DetailsWrap>

<details>
  <summary>为什么要优化?</summary>
    <div>Databend使用Parquet格式将数据存储在表中，这些数据被组织成块。此外，Databend支持时间回溯功能，其中每个修改表的操作都会生成一个Parquet文件，该文件捕获并反映了对表所做的更改。</div><br/>

   <div>随着表随着时间的推移积累了更多的Parquet文件，它可能会导致性能问题和增加的存储需求。为了优化表的性能，当不再需要历史Parquet文件时，可以删除它们。这种优化可以帮助提高查询性能并减少表使用的存储空间量。</div>
</details>

</DetailsWrap>

## Databend数据存储: 快照、段和块

快照、段和块是Databend用于数据存储的概念。Databend使用它们来构建用于存储表数据的层次结构。

![](/img/sql/storage-structure.PNG)

Databend在数据更新时自动创建表快照。快照表示表段元数据的版本。

在使用Databend时，当您使用[AT](../../20-query-syntax/03-query-at.md)子句检索和查询表数据的先前版本时，您最有可能使用快照ID访问快照。

快照是一个JSON文件，不保存表的数据，但指示快照链接到的段。如果您对表运行[FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)，您可以找到为该表保存的快照。

段是一个JSON文件，它组织存储块(至少1个，最多1,000个)，其中存储了数据。如果您使用快照ID对快照运行[FUSE_SEGMENT](../../../20-sql-functions/16-system-functions/fuse_segment.md)，您可以找到快照引用了哪些段。

Databend将实际表数据保存在parquet文件中，并将每个parquet文件视为一个块。如果您使用快照ID对快照运行[FUSE_BLOCK](../../../20-sql-functions/16-system-functions/fuse_block.md)，您可以找到快照引用了哪些块。

Databend为每个数据库和表创建一个唯一的ID，用于存储快照、段和块文件，并将它们保存到对象存储中的路径`<bucket_name>/<tenant_id>/<db_id>/<table_id>/`。每个快照、段和块文件都以UUID(32个字符的小写十六进制字符串)命名。

| 文件     | 格式  | 文件名                        | 存储文件夹                                      |
|----------|---------|---------------------------------|-----------------------------------------------------|
| 快照 | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_ss/` |
| 段  | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_sg/` |
| 块    | parquet | `<32bitUUID>_<version>.parquet` | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_b/`  |

## 表优化

在Databend中，建议的目标块大小为100MB(未压缩)或1,000,000行，每个段由1,000个块组成。为了最大化表优化，必须清楚地了解何时以及如何应用各种优化技术，例如[段压缩](#segment-compaction)、[块压缩](#block-compaction)和[清除](#purging)。

- 当使用COPY INTO或REPLACE INTO命令将数据写入包含集群键的表时，Databend将自动启动重新聚类过程，以及段和块压缩过程。

- 段和块压缩支持在集群环境中分布式执行。您可以通过将ENABLE_DISTRIBUTED_COMPACT设置为1来启用它们。这有助于提高集群环境中的数据查询性能和可扩展性。

  ```sql
  SET enable_distributed_compact = 1;
  ```

### 段压缩

当表有太多小段(每个段少于`100个块`)时，压缩段。
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

通过将小段合并为较大的段来压缩表数据。

- 选项LIMIT设置要压缩的最大段数。在这种情况下，Databend将选择并压缩最新的段。

**示例**

```sql
-- 检查是否需要段压缩
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
    
-- 压缩段
OPTIMIZE TABLE hits COMPACT SEGMENT;
    
-- 再次检查
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

当表有大量小块或表有高比例的插入、删除或更新行时，压缩块。

您可以通过检查每个块的未压缩大小是否接近`100MB`的理想大小来检查它。

如果大小小于`50MB`，我们建议进行块压缩，因为它表示太多小块:

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
我们建议先进行段压缩，然后进行块压缩。
:::

**语法**
```sql
OPTIMIZE TABLE [database.]table_name COMPACT [LIMIT <segment_count>]    
```
通过将小块和段合并为较大的块和段来压缩表数据。

- 此命令创建表最新数据的新快照(以及压缩的段和块)，而不影响现有存储文件，因此直到您清除历史数据时，存储空间才会被释放。

- 根据给定表的大小，执行可能需要相当长的时间才能完成。

- 选项LIMIT设置要压缩的最大段数。在这种情况下，Databend将选择并压缩最新的段。

- Databend将在压缩过程后自动重新聚类聚类表。

**示例**
```sql
OPTIMIZE TABLE my_database.my_table COMPACT LIMIT 50;
```

### 清除

清除永久删除历史数据，包括未使用的快照、段和块，但保留保留期内(包括此快照引用的段和块)的快照。这可以节省存储空间，但可能会影响时间回溯功能。考虑清除时:

- 存储成本是一个主要问题，并且您不需要历史数据用于时间回溯或其他目的。
- 您已经压缩了表，并希望删除较旧的未使用数据。

:::note
默认保留期内的历史数据不会被删除。要调整保留期，请使用*data_retention_time_in_days*设置。
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

| 参数 | 描述                                                                                                                                                                          |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BEFORE    | 指定清除历史数据的条件。它与`SNAPSHOT`、`TIMESTAMP`或`STREAM`选项一起使用，以定义应清除数据的时间点。<br/>当指定`BEFORE`选项时，该命令首先选择一个基本快照，如指定的选项所示。随后，它删除在此基本快照之前生成的快照。在指定流的情况下，该命令将创建流之前最近的快照标识为基本快照。然后，它继续删除在此最近的快照之前生成的快照。|
| LIMIT     | 设置要清除的最大快照数。当指定时，Databend将选择并清除最旧的快照，最多指定数量。                                   |

**示例**

此示例演示使用`BEFORE STREAM`选项清除历史数据。

1. 创建一个名为`t`的表，其中包含单个列`a`，并向表中插入两行值1和2。

```sql
CREATE TABLE t(a INT);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
```

2. 在表`t`上创建一个名为`s`的流，并向表中添加一行值3。

```sql
CREATE STREAM s ON TABLE t;

INSERT INTO t VALUES(3);
```

3. 返回表`t`的快照ID和相应的时间戳。

```sql
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 00dd8ca67c1f461987f31a6b3a1c3c84 │ 2024-04-02 18:09:39.157702 │
│ e448bb2bf488489dae7294b0a8af38d1 │ 2024-04-02 18:09:34.986507 │
│ 2ac038dd83e741afbae543b170105d63 │ 2024-04-02 18:09:34.966336 │
└───────────────────────────────────────────────────────────────┘

-- 将数据保留时间设置为0仅用于演示目的。不建议在生产中使用。
SET data_retention_time_in_days = 0;
```

4. 使用`BEFORE STREAM`选项清除历史快照。

```sql
OPTIMIZE TABLE t PURGE BEFORE (STREAM => s);

-- 该命令选择快照ID e448bb2bf488489dae7294b0a8af38d1作为基本快照，该快照是在创建流's'之前生成的。
-- 因此，快照ID 2ac038dd83e741afbae543b170105d63，在基本快照之前生成，被删除。
SELECT snapshot_id, timestamp FROM FUSE_SNAPSHOT('default', 't');

┌───────────────────────────────────────────────────────────────┐
│            snapshot_id           │          timestamp         │
├──────────────────────────────────┼────────────────────────────┤
│ 00dd8ca67c1f461987f31a6b3a1c3c84 │ 2024-04-02 18:09:39.157702 │
│ e448bb2bf488489dae7294b0a8af38d1 │ 2024-04-02 18:09:34.986507 │
└───────────────────────────────────────────────────────────────┘
```