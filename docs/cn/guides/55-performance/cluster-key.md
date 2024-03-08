---
title: 聚类键
---

在 Databend 中，您可以通过定义聚类键来增强表的查询性能，这涉及向 Databend 提供明确的指令，说明如何在存储中组织和分组行，而不是仅依赖于数据摄取的顺序。您可以通过定义一个通常由一个或多个列或表达式组成的聚类键来对表进行聚类。因此，Databend 根据这个聚类键来排列数据，将相似的行分组到相邻的块中。这些块对应于 Databend 用于数据存储的 Parquet 文件。有关更详细的信息，请参见 [Databend 数据存储：快照、段和块](/sql/sql-commands/ddl/table/optimize-table#databend-data-storage-snapshot-segment-and-block)。

:::tip
在大多数情况下，设置聚类键是不必要的。聚类或重新聚类一个表需要时间，并消耗您的积分，特别是在 Databend Cloud环境中。Databend 建议主要为那些查询性能缓慢的大型表定义聚类键。
:::

聚类键作为 Databend 元数据服务层和存储块（Parquet 文件）之间的连接。一旦为表定义了聚类键，表的元数据就会建立一个键值列表，指示列或表达式值与各自存储块之间的连接。当执行查询时，Databend 可以使用元数据快速定位正确的块，并与未设置聚类键时相比，读取更少的行。

## 聚类键的工作原理

让我们考虑一个包含加拿大所有城市温度的表，有三个列：城市、温度和省份。

```sql
CREATE TABLE T (
    City VARCHAR(255),
    Temperature DECIMAL(10, 2),
    Province VARCHAR(255)
);
```

如果您的主要查询涉及基于温度检索城市，那么将聚类键设置为温度列。以下示例说明了给定表的数据如何存储在块中：

![Alt text](@site/docs/public/img/sql/clustered.png)

每个块（文件）中的行都根据温度列进行排序。然而，块之间可以有重叠的温度范围。如果查询恰好落在块的重叠范围内，则需要读取多个块。这种情况下涉及的块数量被称为“深度”。因此，深度越小越好。这意味着在查询中需要读取的相关块越少，查询性能就越好。

要查看表的聚类情况如何，请使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information)。例如，

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

| 参数                    | 描述                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| cluster_key             | 定义的聚类键。                                                               |
| total_block_count       | 当前的块数量。                                                               |
| constant_block_count    | 最小/最大值相等的块数量，意味着每个块只包含一个（一组）聚类键值。            |
| unclustered_block_count | 尚未聚类的块数量。                                                           |
| average_overlaps        | 在给定范围内重叠块的平均比率。                                               |
| average_depth           | 聚类键重叠分区的平均深度。                                                   |
| block_depth_histogram   | 每个深度级别的分区数量。在较低深度上的分区集中度越高，表明表的聚类效果越好。 |

### 选择聚类键

聚类键可以是表中的一个或多个列，或者是基于这些列的表达式。一般来说，您定义的聚类键应该与您的数据查询中应用的主要过滤器相一致。例如，如果您的大多数查询涉及按 `order_id` 过滤数据，那么建议将 `order_id` 列设置为表的聚类键。

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
    CLUSTER BY (order_id)
);
```

另一方面，如果常常基于 `region` 和 `product_category` 进行过滤，则使用这两个列进行表的聚类将是有益的：

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
    CLUSTER BY (region, product_category)
);
```

当选择一个列作为聚类键时，请确保不同值的数量在提供有效查询性能和系统内最佳存储管理之间取得平衡。

例如，基于只包含布尔值的 `is_secondhand` 列进行表的聚类可能不会在将相似数据分组方面提供太多好处。这是因为不同值有限，聚类可能不会导致相似数据的显著物理分组，影响聚类对查询优化的潜在优势。

一个具有更多不同值的列，如 `order_id` 列，通常不是直接用作聚类键的好候选，因为它倾向于妨碍存储效率并降低数据分组的效果。然而，一个可行的替代方案是考虑使用表达式来“减少”不同值。例如，如果 `order_id` 通常包含一个日期（例如，20240116）从固定位置开始，提取它的时间组件可以作为一个更合适的聚类键。

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
    CLUSTER BY (SUBSTRING(order_id,7,8))
);
```

通过使用从 `order_id` 列中提取的日期进行表的聚类，同一天发生的交易现在被分组到相同或相邻的块中。这通常会导致更好的压缩，并减少在查询执行期间必须从存储中读取的数据量，从而有助于提高整体性能。

### 通过自定义块大小调优性能

Databend 中的块大小由 [Fuse 引擎](/sql/sql-reference/table-engines/fuse) 的 ROW_PER_BLOCK 和 BLOCK_SIZE_THRESHOLD 参数决定。当达到这些阈值之一时，Databend 会创建一个新块。您可以通过自定义包含聚类键的表的块大小来进一步提高单点和范围查询的性能。

自定义块大小以增加存储块的数量会减少查询处理期间读取的行数。这是因为，对于相同的数据集，随着块数量的增加，每个 Parquet 文件中的行数减少。

**示例**：

以下语句需要扫描近 500,000 行来处理单点查询：

![Alt text](@site/docs/public/img/sql/block-size-before.png)

优化减小了块大小，导致每个 Parquet 文件中的行数减少。

```sql
ALTER TABLE sbtest10w SET OPTIONS(ROW_PER_BLOCK=100000,BLOCK_SIZE_THRESHOLD=52428800);
```

优化后，相同查询只需要扫描 100,000 行：

![Alt text](@site/docs/public/img/sql/block-size-after.png)

:::tip
虽然减小块大小可能会减少单个查询中涉及的行数，但重要的是要注意，较小的块大小并不总是更好。在调整块大小之前，至关重要的是进行适当的性能调优和测试，以确定最佳配置。不同的数据和查询类型可能需要不同的块大小才能达到最佳性能。
:::

## 重新聚类表

一个聚类良好的表可能会在某些存储块中变得无序，这可能会对查询性能产生负面影响。例如，如果表继续进行 DML 操作（INSERT / UPDATE / DELETE），那么可能需要考虑重新聚类表。有关如何重新聚类表的信息，请参见 [RECLUSTER TABLE](/sql/sql-commands/ddl/clusterkey/dml-recluster-table)。

:::note
当使用 COPY INTO 或 REPLACE INTO 命令将数据写入包含聚类键的表时，Databend 将自动启动重新聚类过程，以及段和块的压缩过程。
:::

如果您重新聚类 [聚类键的工作原理](#how-cluster-key-works) 一节中的示例表，您可能会得到这样存储的数据：

![Alt text](@site/docs/public/img/sql/well-clustered.png)

这是最理想的情况。在大多数情况下，要达到这种情况可能需要进行不止一次的重新聚类操作。重新聚类一个表需要时间（如果包括 **FINAL** 选项则更长）和积分（当您在 Databend Cloud中时）。Databend 建议使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information) 来确定何时重新聚类表：

```sql
SELECT If(average_depth > total_block_count * 0.001
          AND average_depth > 1, 'The table needs re-cluster now',
              'The table does not need re-cluster now')
FROM CLUSTERING_INFORMATION('<your_database>', '<your_table>');
```

## 管理聚类键

在 Databend 中，您可以在创建表时设置聚类键，如果需要，您也可以更改聚类键。如果一个完全聚类的表继续有摄取或数据操作语言操作（如 INSERT、UPDATE、DELETE），您将需要重新聚类表以修复混乱。有关更多信息，请参见 [聚类键](/sql/sql-commands/ddl/clusterkey/)。
