---
title: 优化表
sidebar_position: 8
---

import DetailsWrap from '@site/src/components/DetailsWrap';

在 Databend 中优化表涉及压缩或清除历史数据以节省存储空间并提升查询性能。

<DetailsWrap>

<details>
  <summary>为什么要优化？</summary>
    <div>Databend 使用 Parquet 格式存储表中的数据，这种格式是按块组织的。此外，Databend 支持时间回溯功能，每个修改表的操作都会生成一个 Parquet 文件，捕获并反映对表所做的更改。</div><br/>

   <div>随着时间的推移，表会积累越来越多的 Parquet 文件，这可能导致性能问题和增加存储需求。为了优化表的性能，当不再需要历史 Parquet 文件时，可以删除它们。这种优化可以帮助提高查询性能并减少表使用的存储空间。</div>
</details>

</DetailsWrap>

## Databend 数据存储：快照、段和块

快照、段和块是 Databend 用于数据存储的概念。Databend 使用它们构建存储表数据的层次结构。

![](/img/sql/storage-structure.PNG)

Databend 在数据更新时自动创建表快照。快照代表表的段元数据的一个版本。

在使用 Databend 时，当您使用 [AT](../../20-query-syntax/03-query-at.md) 子句检索和查询表的以前版本的数据时，最有可能访问带有快照 ID 的快照。

快照是一个 JSON 文件，它不保存表的数据，但指示快照链接到的段。如果您对表运行 [FUSE_SNAPSHOT](../../../20-sql-functions/16-system-functions/fuse_snapshot.md)，您可以找到表的已保存快照。

段是一个 JSON 文件，它组织存储数据的存储块（至少 1 个，最多 1,000 个）。如果您对带有快照 ID 的快照运行 [FUSE_SEGMENT](../../../20-sql-functions/16-system-functions/fuse_segment.md)，您可以找到快照引用的段。

Databend 将实际的表数据保存在 parquet 文件中，并将每个 parquet 文件视为一个块。如果您对带有快照 ID 的快照运行 [FUSE_BLOCK](../../../20-sql-functions/16-system-functions/fuse_block.md)，您可以找到快照引用的块。

Databend 为每个数据库和表创建一个唯一 ID，用于存储快照、段和块文件，并将它们保存到您的对象存储中的路径 `<bucket_name>/<tenant_id>/<db_id>/<table_id>/`。每个快照、段和块文件都以 UUID（32 个字符的小写十六进制字符串）命名。

| 文件 | 格式    | 文件名                          | 存储文件夹                                          |
| ---- | ------- | ------------------------------- | --------------------------------------------------- |
| 快照 | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_ss/` |
| 段   | JSON    | `<32bitUUID>_<version>.json`    | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_sg/` |
| 块   | parquet | `<32bitUUID>_<version>.parquet` | `<bucket_name>/<tenant_id>/<db_id>/<table_id>/_b/`  |

## 表优化

在 Databend 中，建议目标块大小为 100MB（未压缩）或 1,000,000 行，每个段由 1,000 个块组成。为了最大化表优化，了解何时以及如何应用各种优化技术至关重要，例如 [段压缩](#segment-compaction)、[块压缩](#block-compaction) 和 [清除](#purging)。

- 当使用 COPY INTO 或 REPLACE INTO 命令将数据写入包含集群键的表时，Databend 将自动启动重新聚类过程，以及段和块压缩过程。

- 段和块压缩支持在集群环境中分布式执行。您可以通过将 ENABLE_DISTRIBUTED_COMPACT 设置为 1 来启用它们。这有助于在集群环境中提高数据查询性能和可扩展性。

  ```sql
  SET enable_distributed_compact = 1;
  ```

### 段压缩 {#segment-compaction}

当表有太多小段（每个段少于 `100 块`）时，压缩段。

```sql
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              '现在需要对表进行段压缩',
              '现在不需要对表进行段压缩'
    ) AS advice
FROM
  fuse_snapshot('your-database', 'your-table')
    LIMIT 1;
```

**语法**

```sql
OPTIMIZE TABLE [database.]table_name COMPACT SEGMENT [LIMIT <segment_count>]
```

通过将小段合并为更大的段来压缩表数据。

- 选项 LIMIT 设置要压缩的最大段数。在这种情况下，Databend 将选择并压缩最新的段。

**示例**

```sql
-- 检查是否需要段压缩
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              '现在需要对表进行段压缩',
              '现在不需要对表进行段压缩'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits');

+-------------+---------------+-------------------------------------+
| block_count | segment_count | 建议                              |
+-------------+---------------+-------------------------------------+
|         751 |            32 | 现在需要对表进行段压缩 |
+-------------+---------------+-------------------------------------+

-- 压缩段
OPTIMIZE TABLE hits COMPACT SEGMENT;

-- 再次检查
SELECT
  block_count,
  segment_count,
  IF(
              block_count / segment_count < 100,
              '现在需要对表进行段压缩',
              '现在不需要对表进行段压缩'
    ) AS advice
FROM
  fuse_snapshot('hits', 'hits')
    LIMIT 1;

+-------------+---------------+---------------------------------------------+
| block_count | segment_count | 建议                                      |
+-------------+---------------+---------------------------------------------+
|         751 |             1 | 现在不需要对表进行段压缩 |
+-------------+---------------+---------------------------------------------+
```

### 块压缩 {#block-compaction}

当表有大量小块或表有高比例的插入、删除或更新行时，压缩块。

您可以通过检查每个块的未压缩大小是否接近 `100MB` 的完美大小来进行检查。

如果大小小于 `50MB`，我们建议进行块压缩，因为这表明有太多小块：

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
我们建议首先进行段压缩，然后进行块压缩。
:::

**语法**

```sql
OPTIMIZE TABLE [database.]table_name COMPACT [LIMIT <segment_count>]
```

通过合并小块和段到更大的块和段来压缩表数据。

- 此命令创建一个新的快照（连同压缩后的段和块）来保存最新的表数据，而不影响现有的存储文件，因此在您清除历史数据之前，存储空间不会被释放。

- 根据给定表的大小，执行完成可能需要相当长的时间。

- 选项 LIMIT 设置要压缩的最大段数。在这种情况下，Databend 将选择并压缩最新的段。

- Databend 将在压缩过程后自动重新聚类一个聚类表。

**示例**

```sql
OPTIMIZE TABLE my_database.my_table COMPACT LIMIT 50;
```

### 清除 {#purging}

清除会永久移除历史数据，包括未使用的快照、段和块，但保留保留期内的快照（包括此快照引用的段和块）。这可以节省存储空间，但可能会影响时间回溯功能。当以下情况时，考虑进行清除：

- 存储成本是主要关注点，且您不需要历史数据进行时间回溯或其他目的。

- 您已压缩您的表并希望移除较旧的未使用数据。

:::note
默认保留期内的历史数据（12 小时）不会被移除。根据您的需要调整保留期，您可以使用 _retention_period_ 设置。在下面的示例部分中，您可以看到保留期最初设置为 0，使您能够向表中插入数据并立即移除历史数据。
:::

**语法**

```sql
OPTIMIZE TABLE <table_name> PURGE [BEFORE (SNAPSHOT => '<SNAPSHOT_ID>')
| (TIMESTAMP => '<TIMESTAMP>'::TIMESTAMP)] [LIMIT <snapshot_count>]
```

- `[BEFORE (SNAPSHOT => '<SNAPSHOT_ID>') 
| (TIMESTAMP => '<TIMESTAMP>'::TIMESTAMP)]`

  清除在指定快照或时间戳创建之前生成的历史数据。

- `[LIMIT <snapshot_count>]`

  设置要清除的最大快照数。Databend 将选择并清除最旧的快照。

**示例**

```sql
SET retention_period = 0;

-- 创建一个表并使用三个 INSERT 语句插入数据
CREATE TABLE t(x int);

INSERT INTO t VALUES(1);
INSERT INTO t VALUES(2);
INSERT INTO t VALUES(3);

SELECT * FROM t;

x|
-+
1|
2|
3|

-- 显示创建的快照及其时间戳
SELECT snapshot_id, segment_count, block_count, timestamp
FROM fuse_snapshot('default', 't');

snapshot_id                     |segment_count|block_count|timestamp            |
--------------------------------+-------------+-----------+---------------------+
edc9477b62c24f299c05a4d189030772|            3|          3|2022-12-26 19:33:49.0|
256f1fe2e3974ee595474b2a8cad7a39|            2|          2|2022-12-26 19:33:42.0|
1e060f7d145747578963b5a7e3b14742|            1|          1|2022-12-26 19:32:57.0|

-- 清除在新快照创建之前生成的历史数据。
OPTIMIZE TABLE t PURGE BEFORE (SNAPSHOT => '9828b23f74664ff3806f44bbc1925ea5');

SELECT snapshot_id, segment_count, block_count, timestamp
FROM fuse_snapshot('default', 't');

snapshot_id                     |segment_count|block_count|timestamp            |
--------------------------------+-------------+-----------+---------------------+
9828b23f74664ff3806f44bbc1925ea5|            1|          1|2022-12-26 19:39:27.0|

SELECT * FROM t;

x|
-+
1|
2|
3|
```
