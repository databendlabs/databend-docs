---
title: Databend 架构
sidebar_label: 架构
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Databend 的高层架构由 `元服务层`、`查询层` 和 `存储层` 组成。

![Databend 架构](https://github.com/datafuselabs/databend/assets/172204/68b1adc6-0ec1-41d4-9e1d-37b80ce0e5ef)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元服务层">

Databend 通过其元服务层高效支持多租户，这在系统中扮演着至关重要的角色：

- **元数据管理**：处理数据库、表、集群、事务等的元数据。
- **安全**：管理用户认证和授权，以确保安全的环境。

在 GitHub 上了解更多关于元服务层的信息，请访问 [meta](https://github.com/datafuselabs/databend/tree/main/src/meta)。

</TabItem>
<TabItem value="Query Layer" label="查询层">

Databend 的查询层负责处理查询计算，由多个集群组成，每个集群包含若干节点。
每个节点是查询层的核心单元，包括：
- **规划器**：使用来自[关系代数](https://en.wikipedia.org/wiki/Relational_algebra)的元素为 SQL 语句开发执行计划，包括投影、过滤和限制等操作符。
- **优化器**：基于规则的优化器应用预定义规则，例如“谓词下推”和“未使用列的剪枝”，以实现最佳的查询执行。
- **处理器**：根据规划器指令构建查询执行管道，遵循 Pull&Push 方法。处理器相互连接，形成可以跨节点分布的管道，以提高性能。

在 GitHub 上了解更多关于查询层的信息，请访问 [query](https://github.com/datafuselabs/databend/tree/main/src/query) 目录。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend 使用 Parquet，一个开源的列式格式，并引入了自己的表格式来提升查询性能。主要特点包括：

- **二级索引**：加速数据定位和访问，适用于各种分析维度。
 
- **复杂数据类型索引**：旨在加速半结构化等复杂类型数据的处理和分析。

- **段**：Databend 有效地将数据组织成段，提高了数据管理和检索效率。

- **聚类**：在段内使用用户定义的聚类键来简化数据扫描。

在 GitHub 上了解更多关于存储层的信息，请访问 [storage](https://github.com/datafuselabs/databend/tree/main/src/query/storages)。

</TabItem>
</Tabs>