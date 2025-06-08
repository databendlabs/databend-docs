---
title: Databend 社区
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 是一个开源、弹性、工作负载感知的云原生数据仓库（Data Warehouse），使用 Rust 语言构建，旨在提供高性价比的 Snowflake 替代方案。它专为分析全球最大规模的数据集而设计。

<Tabs groupId="whydatabend">
<TabItem value="Performance" label="性能">

- 在对象存储上实现极速数据分析
- 利用数据级并行和指令级并行技术实现[最佳性能](https://benchmark.clickhouse.com/)
- 无需构建索引、手动调优或处理分区/分片

</TabItem>

<TabItem value="Data Manipulation" label="数据操作">

- 支持 `SELECT`、`INSERT`、`DELETE`、`UPDATE`、`REPLACE`、`COPY` 和 `MERGE` 等原子操作
- 提供时间回溯（Time Travel）和多目录（Apache Hive / Apache Iceberg）等高级功能
- 支持以 CSV、JSON 和 Parquet 格式[加载半结构化数据](/guides/load-data/load)
- 支持 [ARRAY、MAP 和 JSON](/sql/sql-reference/data-types/) 等半结构化数据类型
- 支持类 Git 的 MVCC 存储，便于查询、克隆和恢复历史数据

</TabItem>

<TabItem value="Object Storage" label="对象存储">

- 支持多种对象存储平台，点击[此处](../10-deploy/01-deploy/00-understanding-deployment-modes.md#supported-object-storage)查看完整列表
- 支持即时弹性伸缩，按需调整资源规模

</TabItem>
</Tabs>

Databend 的高层架构由 `meta-service layer`（元服务层）、`query layer`（查询层）和 `storage layer`（存储层）组成。

![Databend Architecture](https://github.com/databendlabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元服务层（Meta-Service Layer）">

Databend 通过元服务层高效支持多租户架构，该层在系统中承担关键职能：

- **元数据管理**：处理数据库、表、集群、事务（Transaction）等元数据
- **安全性**：管理用户认证与授权，保障环境安全

在 GitHub 的 [meta](https://github.com/databendlabs/databend/tree/main/src/meta) 目录中了解更多元服务层信息

</TabItem>
<TabItem value="Query Layer" label="查询层（Query Layer）">

查询层（Query Layer）负责处理查询计算，由多个集群组成，每个集群包含若干节点。每个节点作为核心计算单元包含：

- **Planner（规划器）**：基于[关系代数](https://en.wikipedia.org/wiki/Relational_algebra)元素制定 SQL 执行计划，包含 Projection、Filter 和 Limit 等算子
- **Optimizer（优化器）**：应用"谓词下推"和"未使用列裁剪"等预定义规则的基于规则优化器
- **Processors（处理器）**：按 Pull&Push 模式构建分布式查询执行 Pipeline（流水线）

在 GitHub 的 [query](https://github.com/databendlabs/databend/tree/main/src/query) 目录中了解更多查询层（Query Layer）信息

</TabItem>
<TabItem value="Storage Layer" label="存储层（Storage Layer）">

Databend 采用 Parquet 列式存储格式并引入专属表格式提升性能，关键特性包括：

- **二级索引**：加速多维度数据定位与访问
- **复杂数据类型索引**：优化半结构化数据处理效率
- **Segments（段）**：高效数据组织单元
- **聚簇（Clustering）**：通过用户定义聚簇键（Cluster Key）优化数据扫描

在 GitHub 的 [storage](https://github.com/databendlabs/databend/tree/main/src/query/storages) 目录中了解更多存储层（Storage Layer）信息

</TabItem>
</Tabs>