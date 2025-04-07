---
title: Cluster Key
---

在 Databend 中，您可以选择通过对表进行聚簇来提高查询性能。这包括向 Databend 提供关于如何在存储中组织和分组行的明确指令，而不是仅仅依赖于数据摄取的顺序。您可以通过定义一个聚簇键来聚簇表，该聚簇键通常由一个或多个列或表达式组成。因此，Databend 会根据这个聚簇键来排列数据，将相似的行分组到相邻的块中。这些块对应于 Databend 用于数据存储的 Parquet 文件。有关更多详细信息，请参阅 [Databend Data Storage: Snapshot, Segment, and Block](/sql/sql-commands/ddl/table/optimize-table#databend-data-storage-snapshot-segment-and-block)。

:::tip
在大多数情况下，设置聚簇键不是必需的。聚簇或重新聚簇表需要时间并消耗您的 credits，尤其是在 Databend Cloud 环境中。Databend 建议主要为遇到查询性能缓慢的大型表定义聚簇键。
:::

聚簇键充当 Databend Meta Service Layer 中的元数据和存储块（Parquet 文件）之间的连接。一旦为表定义了聚簇键，该表的元数据就会建立一个键值列表，指示列或表达式值与其各自存储块之间的连接。当执行查询时，Databend 可以使用元数据快速定位正确的块，并且与未设置聚簇键时相比，读取更少的行。

## 聚簇键的工作原理

让我们考虑一个包含加拿大所有城市温度的表，其中包含三列：City、Temperature 和 Province。

```sql
CREATE TABLE T (
    City VARCHAR(255),
    Temperature DECIMAL(10, 2),
    Province VARCHAR(255)
);
```

如果您的主要查询涉及根据温度检索城市，请将聚簇键设置为 Temperature 列。以下说明了如何为给定表将数据存储在块中：

![Alt text](/img/sql/clustered.png)

行根据每个块（文件）中的 Temperature 列进行排序。但是，块之间可能存在重叠的年龄范围。如果查询恰好落在块的重叠范围内，则需要读取多个块。这种情况涉及的块数称为“Depth”。因此，深度越小越好。这意味着在查询期间读取的相关块越少，查询性能就越好。

要查看表的聚簇效果如何，请使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information)。
**注意**：此函数仅适用于聚簇表。
例如，

```sql
 SELECT * FROM clustering_information('default','T');
*************************** 1. row ***************************
            cluster_key: (id)
      total_block_count: 451
   constant_block_count: 0
unclustered_block_count: 0
       average_overlaps: 2.1774
          average_depth: 2.4612
  block_depth_histogram: {"00001":32,"00002":217,"00003":164,"00004":38}
1 row in set (0.02 sec)
Read 1 rows, 448.00 B in 0.015 sec., 67.92 rows/sec., 29.71 KiB/sec.
```

| 参数                    | 描述                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| cluster_key             | 定义的聚簇键。                                                                                                                             |
| total_block_count       | 当前块的计数。                                                                                                                             |
| constant_block_count    | 最小/最大值相等的块的计数，这意味着每个块仅包含一个（组）cluster_key 值。                                                                  |
| unclustered_block_count | 尚未聚簇的块的计数。                                                                                                                         |
| average_overlaps        | 给定范围内重叠块的平均比率。                                                                                                                   |
| average_depth           | 聚簇键的重叠分区的平均深度。                                                                                                                     |
| block_depth_histogram   | 每个深度级别的分区数。较低深度处的分区集中度越高，表明表聚簇越有效。                                                                                       |

### 选择聚簇键

聚簇键可以是表中的一列或多列，也可以是基于这些列的表达式。通常，您定义的聚簇键应与数据查询中应用的主要过滤器对齐。例如，如果您的查询大多数涉及按 `order_id` 过滤数据，则建议将 `order_id` 列设置为表的聚簇键。

```sql
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    product_id INT,
    is_secondhand BOOLEAN,
    quantity INT,
    region VARCHAR,
    product_category VARCHAR,
    -- 其他列...
) CLUSTER BY (order_id);
```

另一方面，如果通常基于 `region` 和 `product_category` 进行过滤，则使用这两列对表进行聚簇将是有益的：

```sql
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    product_id INT,
    is_secondhand BOOLEAN,
    quantity INT,
    region VARCHAR,
    product_category VARCHAR,
    -- 其他列...
) CLUSTER BY (region, product_category);
```

选择列作为聚簇键时，请确保不同值的数量在有效查询性能和系统内最佳存储管理之间取得平衡。

例如，基于仅包含布尔值的 `is_secondhand` 列对表进行聚簇可能无法在将相似数据分组在一起方面提供太多好处。这是因为不同的值受到限制，并且聚簇可能不会导致相似数据的显着物理分组，从而影响聚簇对查询优化的潜在优势。

具有大量不同值的列（例如 `order_id` 列）通常不是直接用作聚簇键的理想选择，因为它倾向于阻碍存储效率并降低数据分组的有效性。但是，一种可行的替代方法是考虑使用表达式来“减少”不同的值。例如，如果 `order_id` 通常包含从固定位置开始的日期（例如，20240116），则从中提取时间分量可以用作更合适的聚簇键。

```sql
CREATE TABLE sales (
    order_id INT,
    order_date TIMESTAMP,
    product_id INT,
    is_secondhand BOOLEAN,
    quantity INT,
    region VARCHAR,
    product_category VARCHAR,
    -- 其他列...
) CLUSTER BY (SUBSTRING(order_id,7,8));
```

通过使用从 `order_id` 列中提取的日期对表进行聚簇，现在将同一天发生的事务分组到相同或相邻的块中。这通常会导致改进的压缩，并减少在查询执行期间必须从存储中读取的数据量，从而有助于提高整体性能。

### 使用自定义块大小调整性能

Databend 中的块大小由 [Fuse Engine](/sql/sql-reference/table-engines/fuse) 的 ROW_PER_BLOCK 和 BLOCK_SIZE_THRESHOLD 参数确定。当达到任一阈值时，Databend 会创建一个新块。您可以通过为包含聚簇键的表自定义块大小来进一步提高单点和范围查询的性能。

自定义块大小以增加存储块的数量会导致在查询处理期间读取的行数减少。这是因为，随着同一数据集的块数量增加，每个 Parquet 文件中的行数会减少。

**示例**：

以下语句需要扫描近 500,000 行才能处理单点查询：

![Alt text](/img/sql/block-size-before.png)

优化会减小块大小，从而减少每个 Parquet 文件的行数。

```sql
ALTER TABLE sbtest10w SET OPTIONS(ROW_PER_BLOCK=100000,BLOCK_SIZE_THRESHOLD=52428800);
```

优化后，对于同一查询，只需要扫描 100,000 行：

![Alt text](/img/sql/block-size-after.png)

:::tip
虽然减小块大小可能会减少单个查询中涉及的行数，但重要的是要注意，较小的块大小并不总是更好。在调整块大小之前，至关重要的是进行适当的性能调整和测试，以确定最佳配置。不同的数据和查询类型可能需要不同的块大小才能获得最佳性能。
:::

## 重新聚簇表

一个聚簇良好的表可能会在某些存储块中变得无序，这可能会对查询性能产生负面影响。例如，如果表继续进行 DML 操作（INSERT / UPDATE / DELETE），则最好考虑重新聚簇表。有关如何重新聚簇表的信息，请参阅 [RECLUSTER TABLE](/sql/sql-commands/ddl/clusterkey/dml-recluster-table)。

:::note
当使用 COPY INTO 或 REPLACE INTO 命令将数据写入包含聚簇键的表时，Databend 将自动启动重新聚簇过程，以及段和块压缩过程。
:::

如果您重新聚簇 [聚簇键的工作原理](#how-cluster-key-works) 部分中的示例表，您可能会得到如下存储的数据：

![Alt text](/img/sql/well-clustered.png)

这是最理想的情况。在大多数情况下，要实现这种情况可能需要多次运行重新聚簇操作。重新聚簇表会消耗时间（如果您包含 **FINAL** 选项，则时间会更长）和 credits（当您在 Databend Cloud 中时）。Databend 建议使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information) 来确定何时重新聚簇表：

```sql
SELECT IF(average_depth > 2 * LEAST(GREATEST(total_block_count * 0.001, 1), 16),
              'The table needs re-cluster now',
              'The table does not need re-cluster now')
FROM   clustering_information('<your_database>', '<your_table>'); 
```

## 管理聚簇键

在 Databend 中，您可以在创建表时设置聚簇键，并且可以在必要时更改聚簇键。如果完全聚簇的表继续进行摄取或数据操作语言操作（例如 INSERT、UPDATE、DELETE），则可能会变得混乱，您需要重新聚簇表以修复混乱。有关更多信息，请参阅 [Cluster Key](/sql/sql-commands/ddl/clusterkey/)。