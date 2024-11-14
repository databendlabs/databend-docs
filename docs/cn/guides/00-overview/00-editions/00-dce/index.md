---
title: Databend 社区
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import IndexOverviewList from '@site/src/components/IndexOverviewList';

Databend 是一个开源的、弹性的、且对工作负载敏感的云数仓，使用 Rust 构建，提供了一个成本效益高的 Snowflake 替代方案。它专为处理世界上最大数据集的复杂分析而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上进行极速数据分析。
- 利用数据级并行和指令级并行技术实现[最佳性能](https://benchmark.clickhouse.com/)。
- 无需构建索引，无需手动调优，无需考虑分区或分片数据。

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持原子操作，如 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`REPLACE`、`COPY` 和 `MERGE`。
- 提供高级功能，如时间回溯和多目录（Apache Hive / Apache Iceberg）。
- 支持以各种格式（如 CSV、JSON 和 Parquet）[加载半结构化数据](/guides/load-data/load)。
- 支持半结构化数据类型，如 [ARRAY、MAP 和 JSON](/sql/sql-reference/data-types/)。
- 支持类似 Git 的 MVCC 存储，便于查询、克隆和恢复历史数据。

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持多种对象存储平台。点击[此处](../../../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看支持平台的完整列表。
- 允许即时弹性，使用户能够根据应用程序需求进行扩展或缩减。

</TabItem>
</Tabs>

通过以下主题了解更多关于 Databend 社区版的信息：

<IndexOverviewList />