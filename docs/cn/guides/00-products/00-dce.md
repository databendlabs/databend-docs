---
title: Databend 社区（Community）
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 是一个用 Rust 构建的开源、弹性且工作负载感知的云数据仓库（Data Warehouse），为 Snowflake 提供了经济高效的替代方案。它专为分析世界上最大的数据集而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上进行极速数据分析。
- 利用数据级并行和指令级并行技术实现[最佳性能](https://benchmark.clickhouse.com/)。
- 无需构建索引（Index），无需手动调优，也无需考虑分区（Partition）或数据分片。

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持原子操作，如 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`REPLACE`、`COPY` 和 `MERGE`。
- 提供高级功能，如时间回溯（Time Travel）和多目录（Apache Hive / Apache Iceberg）。
- 支持[摄取半结构化数据](/guides/load-data/load)，格式包括 CSV、JSON 和 Parquet。
- 支持半结构化数据类型，如 [ARRAY、MAP 和 JSON](/sql/sql-reference/data-types/)。
- 支持类似 Git 的 MVCC 存储，便于查询（Query）、克隆和恢复历史数据。

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持各种对象存储平台。点击[这里](../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看支持平台的完整列表。
- 允许即时弹性扩展，使用户能够根据应用需求进行扩容或缩容。

</TabItem>
</Tabs>

Databend 的高级架构由`元服务层`、`查询（Query）层`和`存储层`组成。

![Databend Architecture](https://github.com/databendlabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元服务层">

Databend 通过其元服务层高效支持多租户，该层在系统中发挥关键作用：

- **元数据管理**：处理数据库、表、集群、事务（Transaction）等的元数据。
- **安全性**：管理用户身份验证和授权，确保安全环境。

在 GitHub 上的 [meta](https://github.com/databendlabs/databend/tree/main/src/meta) 中了解更多关于元服务层的信息。

</TabItem>
<TabItem value="Query Layer" label="查询（Query）层">

Databend 中的查询（Query）层处理查询（Query）计算，由多个集群组成，每个集群包含多个节点。
每个节点是查询（Query）层的核心单元，包括：

- **规划器 (Planner)**：使用[关系代数](https://en.wikipedia.org/wiki/Relational_algebra)元素为 SQL 语句制定执行计划，结合投影、过滤和限制等操作符。
- **优化器 (Optimizer)**：基于规则的查询优化器（Query Optimizer）应用预定义规则，如"谓词下推"和"未使用列的修剪"，以实现最佳查询（Query）执行。
- **处理器 (Processors)**：根据规划器指令构建查询（Query）执行管道，遵循拉取和推送方法。处理器相互连接，形成可在节点间分布的管道以提高性能。

在 GitHub 上的 [query](https://github.com/databendlabs/databend/tree/main/src/query) 目录中了解更多关于查询（Query）层的信息。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend 采用开源列式格式 Parquet，并引入自己的表格式来提升查询（Query）性能。主要特性包括：

- **二级索引（Index）**：加速跨各种分析维度的数据定位和访问。

- **复杂数据类型索引（Index）**：旨在加速复杂类型（如半结构化数据）的数据处理和分析。

- **段**：Databend 有效地将数据组织成段，提高数据管理和检索效率。

- **聚簇**：在段内使用用户定义的聚簇键（Cluster Key）来简化数据扫描。

在 GitHub 上的 [storage](https://github.com/databendlabs/databend/tree/main/src/query/storages) 中了解更多关于存储层的信息。

</TabItem>
</Tabs>