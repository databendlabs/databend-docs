---
title: 计算集群键
---

在 Databend 中，您可以选择通过计算集群表来增强查询性能。这涉及向 Databend 提供明确的指令，以如何组织和分组存储中的行，而不是仅仅依赖数据摄取的顺序。您可以通过定义计算集群键来计算集群表，通常由一个或多个列或表达式组成。因此，Databend 根据此计算集群键排列数据，将相似的行分组到相邻的块中。这些块对应于 Databend 用于数据存储的 Parquet 文件。有关更多详细信息，请参阅 [Databend 数据存储：快照、段和块](/sql/sql-commands/ddl/table/optimize-table#databend-数据存储-快照-段和块)。

:::tip
在大多数情况下，设置计算集群键不是必需的。计算集群或重新计算集群表需要时间并消耗您的信用，尤其是在 Databend Cloud 环境中。Databend 建议主要为查询性能缓慢的大规模表定义计算集群键。
:::

计算集群键作为 Databend 的元服务层中的元数据与存储块（Parquet 文件）之间的连接。一旦为表定义了计算集群键，表的元数据将建立一个键值列表，指示列或表达式值与其各自存储块之间的连接。当执行查询时，Databend 可以使用元数据快速定位正确的块，并读取比没有设置计算集群键时更少的行。

## 计算集群键的工作原理

让我们考虑一个包含加拿大所有城市温度的表，具有三列：城市、温度和省份。

```sql
CREATE TABLE T (
    城市 VARCHAR(255),
    温度 DECIMAL(10, 2),
    省份 VARCHAR(255)
);
```

如果您的查询主要涉及根据温度检索城市，请将计算集群键设置为温度列。以下说明了给定表的数据如何在块中存储：

![Alt text](/img/sql/clustered.png)

行根据每个块（文件）中的温度列进行排序。然而，块之间的年龄范围可能会有重叠。如果查询恰好落在块的重叠范围内，则需要读取多个块。这种情况下的块数称为“深度”。因此，深度越小越好。这意味着在查询期间读取的相关块越少，查询性能越好。

要查看表的计算集群情况，请使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information)。例如，

```sql
 SELECT * FROM clustering_information('default','T');
*************************** 1. row ***************************
            计算集群键: (id)
      总块数: 451
   常量块数: 0
未计算集群块数: 0
      平均重叠: 2.1774
         平均深度: 2.4612
  块深度直方图: {"00001":32,"00002":217,"00003":164,"00004":38}
1 row in set (0.02 sec)
Read 1 rows, 448.00 B in 0.015 sec., 67.92 rows/sec., 29.71 KiB/sec.
```

| 参数                    | 描述                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 计算集群键              | 定义的计算集群键。                                                                                                                      |
| 总块数                  | 当前块数。                                                                                                                              |
| 常量块数                | 最小/最大值相等的块数，意味着每个块仅包含一个（组）计算集群键值。                                                                       |
| 未计算集群块数          | 尚未计算集群的块数。                                                                                                                    |
| 平均重叠                | 给定范围内重叠块的平均比率。                                                                                                            |
| 平均深度                | 计算集群键的重叠分区的平均深度。                                                                                                        |
| 块深度直方图            | 每个深度级别的分区数。较低深度级别的分区集中度越高，表示表的计算集群效果越好。                                                          |

### 选择计算集群键

计算集群键可以是表中的一个或多个列，或者是基于这些列的表达式。通常，您定义的计算集群键应与数据查询中应用的主要过滤器一致。例如，如果大多数查询涉及按 `order_id` 过滤数据，建议将 `order_id` 列设置为表的计算集群键。

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

另一方面，如果过滤通常基于 `region` 和 `product_category`，则使用这两个列计算集群表将是有益的：

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

在选择列作为计算集群键时，确保不同值的数量在有效查询性能和系统内最佳存储之间取得平衡。

例如，基于仅包含布尔值的 `is_secondhand` 列计算集群表可能不会在分组相似数据方面提供太多好处。这是因为不同值有限，计算集群可能不会导致相似数据的显著物理分组，影响查询优化的潜在优势。

具有较大不同值数量的列，如 `order_id` 列，通常不是直接用作计算集群键的好候选，因为其倾向于阻碍存储效率并削弱数据分组的效果。然而，可行的替代方案是考虑使用表达式来“减少”不同值。例如，如果 `order_id` 通常包含从固定位置开始的日期（例如，20240116），则可以提取时间组件作为更合适的计算集群键。

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

通过使用从 `order_id` 列提取的日期计算集群表，发生在同一天的交易现在被分组到相同的或相邻的块中。这通常会导致压缩改进和查询执行期间必须从存储中读取的数据量减少，从而提高整体性能。

### 使用自定义块大小调整性能

Databend 中的块大小由 [Fuse 引擎](/sql/sql-reference/table-engines/fuse) 的 ROW_PER_BLOCK 和 BLOCK_SIZE_THRESHOLD 参数决定。Databend 在达到任一阈值时创建一个新块。您可以通过为包含计算集群键的表自定义块大小来进一步增强单点查询和范围查询的性能。

通过自定义块大小以增加存储块的数量，可以减少查询处理期间读取的行数。这是因为，随着相同数据集的块数量增加，每个 Parquet 文件中的行数减少。

**示例**:

以下语句需要扫描近 500,000 行来处理单点查询：

![Alt text](/img/sql/block-size-before.png)

优化减少了块大小，导致每个 Parquet 文件的行数减少。

```sql
ALTER TABLE sbtest10w SET OPTIONS(ROW_PER_BLOCK=100000,BLOCK_SIZE_THRESHOLD=52428800);
```

优化后，相同的查询只需扫描 100,000 行：

![Alt text](/img/sql/block-size-after.png)

:::tip
虽然减少块大小可能会减少单个查询中涉及的行数，但需要注意的是，较小的块大小并不总是更好。在调整块大小之前，进行适当的性能调优和测试以确定最佳配置至关重要。不同的数据和查询类型可能需要不同的块大小以实现最佳性能。
:::

## 重新计算集群表

一个良好的计算集群表可能在某些存储块中变得混乱，这可能会对查询性能产生负面影响。例如，如果表继续进行 DML 操作（INSERT / UPDATE / DELETE），可能需要考虑重新计算集群表。有关如何重新计算集群表，请参阅 [RECLUSTER TABLE](/sql/sql-commands/ddl/clusterkey/dml-recluster-table)。

:::note
当使用 COPY INTO 或 REPLACE INTO 命令将数据写入包含计算集群键的表时，Databend 将自动启动重新计算集群过程，以及段和块压缩过程。
:::

如果您重新计算集群 [计算集群键的工作原理](#计算集群键的工作原理) 部分中的示例表，您可能会得到如下存储的数据：

![Alt text](/img/sql/well-clustered.png)

这是最理想的情况。在大多数情况下，实现这种情况可能需要多次运行重新计算集群操作。重新计算集群表需要时间（如果包含 **FINAL** 选项，则时间更长）和信用（在 Databend Cloud 中）。Databend 建议使用函数 [CLUSTERING_INFORMATION](/sql/sql-functions/system-functions/clustering_information) 来确定何时重新计算集群表：

```sql
SELECT If(average_depth > total_block_count * 0.001
          AND average_depth > 1, 'The table needs re-cluster now',
              'The table does not need re-cluster now')
FROM CLUSTERING_INFORMATION('<your_database>', '<your_table>');
```

## 管理计算集群键

在 Databend 中，您可以在创建表时设置计算集群键，并在必要时更改计算集群键。如果一个完全计算集群的表继续进行摄取或数据操作语言操作（如 INSERT、UPDATE、DELETE），它可能会变得混乱，您需要重新计算集群表以修复混乱。有关更多信息，请参阅 [计算集群键](/sql/sql-commands/ddl/clusterkey/)。