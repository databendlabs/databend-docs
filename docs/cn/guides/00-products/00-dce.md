---
title: Databend 社区版
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 是一个用 Rust 构建的开源、弹性且具有工作负载感知能力的云数仓，为 Snowflake 提供了一种经济高效的替代方案。它专为世界上最大数据集的复杂分析而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上实现极速数据分析。
- 利用数据级并行和指令级并行技术来实现[最佳性能](https://benchmark.clickhouse.com/)。
- 无需构建索引，无需手动调整，也无需确定分区或分片数据。

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持原子操作，例如 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`REPLACE`、`COPY` 和 `MERGE`。
- 提供高级功能，例如时间回溯和多目录（Apache Hive / Apache Iceberg）。
- 支持以各种格式（如 CSV、JSON 和 Parquet）[摄取半结构化数据](/guides/load-data/load)。
- 支持半结构化数据类型，例如 [ARRAY、MAP 和 JSON](/sql/sql-reference/data-types/)。
- 支持类似 Git 的 MVCC 存储，以便轻松查询、克隆和恢复历史数据。

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持各种对象存储平台。单击[此处](../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看支持平台的完整列表。
- 允许即时弹性，使用户能够根据其应用程序需求进行扩展或缩减。

</TabItem>
</Tabs>

Databend 的高层架构由 `meta-service layer`、`query layer` 和 `storage layer` 组成。

![Databend Architecture](https://github.com/databendlabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

Databend 通过其元服务层有效地支持多租户，该层在系统中起着至关重要的作用：

- **Metadata Management**：处理数据库、表、集群、事务等的元数据。
- **Security**：管理用户身份验证和授权，以确保安全的环境。

在 GitHub 上的 [meta](https://github.com/databendlabs/databend/tree/main/src/meta) 中了解有关元服务层的更多信息。

</TabItem>
<TabItem value="Query Layer" label="Query Layer">

Databend 中的查询层处理查询计算，由多个集群组成，每个集群包含多个节点。
每个节点都是查询层中的核心单元，由以下部分组成：

- **Planner**：使用[关系代数](https://en.wikipedia.org/wiki/Relational_algebra)中的元素（包括 Projection、Filter 和 Limit 等运算符）为 SQL 语句制定执行计划。
- **Optimizer**：基于规则的优化器应用预定义的规则，例如“谓词下推”和“删除未使用的列”，以实现最佳查询执行。
- **Processors**：根据 planner 指令构建查询执行管道，遵循 Pull&Push 方法。处理器相互连接，形成一个可以跨节点分布的管道，以提高性能。

在 GitHub 上的 [query](https://github.com/databendlabs/databend/tree/main/src/query) 目录中了解有关查询层的更多信息。

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend 采用 Parquet（一种开源列式格式），并引入了自己的表格式以提高查询性能。主要功能包括：

- **Secondary Indexes**：加速跨各种分析维度的数据定位和访问。

- **Complex Data Type Indexes**：旨在加速复杂类型（如半结构化数据）的数据处理和分析。

- **Segments**：Databend 将数据有效地组织成段，从而提高数据管理和检索效率。

- **Clustering**：在段内采用用户定义的聚类键来简化数据扫描。

在 GitHub 上的 [storage](https://github.com/databendlabs/databend/tree/main/src/query/storages) 中了解有关存储层的更多信息。

</TabItem>
</Tabs>
