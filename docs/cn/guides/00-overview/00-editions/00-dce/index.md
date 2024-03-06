---
title: Databend 社区版
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend 是一个开源的、弹性的、适应工作负载的云数据仓库，使用 Rust 构建，提供了一个经济高效的 Snowflake 替代方案。它专为世界上最大数据集的复杂分析而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上提供极速的数据分析。
- 利用数据级并行和指令级并行技术以获得[最佳性能](https://benchmark.clickhouse.com/)。
- 无需构建索引，无需手动调优，也无需确定分区或分片数据。

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持原子操作，如 `SELECT`, `INSERT`, `DELETE`, `UPDATE`, `REPLACE`, `COPY`, 和 `MERGE`。
- 提供高级功能，如时间旅行和多目录（Apache Hive / Apache Iceberg）。
- 支持以各种格式（如 CSV、JSON 和 Parquet）[摄取半结构化数据](/guides/load-data/load)。
- 支持半结构化数据类型，如 [ARRAY, MAP, 和 JSON](/sql/sql-reference/data-types/)。
- 支持类似 Git 的 MVCC 存储，便于查询、克隆和恢复历史数据。

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持各种对象存储平台。点击[此处](../../../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看支持的平台完整列表。
- 允许即时弹性，使用户可以根据他们的应用需求进行扩展或缩减。

</TabItem>
</Tabs>

了解更多关于 Databend 社区版的以下主题：

<IndexOverviewList />