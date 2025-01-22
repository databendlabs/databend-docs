---
title: Databend 社区
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 是一个开源、弹性且工作负载感知的云原生数仓，使用 Rust 构建，是 Snowflake 的经济高效替代方案。它专为分析世界上最大的数据集而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上进行极速数据分析。
- 利用数据级并行和指令级并行技术实现[最佳性能](https://benchmark.clickhouse.com/)。
- 无需构建索引，无需手动调优，也无需考虑分区或分片数据。

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`REPLACE`、`COPY` 和 `MERGE` 等原子操作。
- 提供时间回溯和多目录（Apache Hive / Apache Iceberg）等高级功能。
- 支持以 CSV、JSON 和 Parquet 等多种格式[导入半结构化数据](/guides/load-data/load)。
- 支持 [ARRAY、MAP 和 JSON](/sql/sql-reference/data-types/) 等半结构化数据类型。
- 支持类似 Git 的 MVCC 存储，便于查询、克隆和恢复历史数据。

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持多种对象存储平台。点击[此处](../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看支持的完整列表。
- 允许即时弹性扩展，用户可以根据应用需求扩展或缩减。

</TabItem>
</Tabs>

Databend 的高层架构由 `元服务层`、`查询层` 和 `存储层` 组成。

![Databend 架构](https://github.com/databendlabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元服务层">

Databend 通过其元服务层高效支持多租户，该层在系统中扮演着关键角色：

- **元数据管理**：处理数据库、表、集群、事务等的元数据。
- **安全性**：管理用户认证和授权，确保环境安全。

在 GitHub 上的 [meta](https://github.com/databendlabs/databend/tree/main/src/meta) 中了解更多关于元服务层的信息。

</TabItem>
<TabItem value="Query Layer" label="查询层">

Databend 的查询层处理查询计算，由多个集群组成，每个集群包含多个节点。
每个节点是查询层的核心单元，包含：

- **规划器**：使用[关系代数](https://en.wikipedia.org/wiki/Relational_algebra)中的元素为 SQL 语句制定执行计划，包含投影、过滤和限制等操作符。
- **优化器**：基于规则的优化器应用预定义规则，如“谓词下推”和“未使用列的剪枝”，以实现最佳查询执行。
- **处理器**：根据规划器的指令构建查询执行管道，采用 Pull&Push 方法。处理器相互连接，形成可以跨节点分布的管道，以提高性能。

在 GitHub 上的 [query](https://github.com/databendlabs/databend/tree/main/src/query) 目录中了解更多关于查询层的信息。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend 使用 Parquet 这种开源的列式格式，并引入自己的表格式以提高查询性能。主要特点包括：

- **二级索引**：加速数据定位和访问，适用于各种分析维度。

- **复杂数据类型索引**：旨在加速复杂类型（如半结构化数据）的数据处理和分析。

- **段**：Databend 有效地将数据组织成段，提高数据管理和检索效率。

- **聚类**：在段内使用用户定义的聚类键，简化数据扫描。

在 GitHub 上的 [storage](https://github.com/databendlabs/databend/tree/main/src/query/storages) 中了解更多关于存储层的信息。

</TabItem>
</Tabs>