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

Databend 通过其元服务层高效支持多租户，该层在系统中起着至关重要的作用：

- **元数据管理**：处理数据库、表、计算集群、事务等的元数据。
- **安全**：管理用户认证和授权，确保安全环境。

在 GitHub 的 [meta](https://github.com/datafuselabs/databend/tree/main/src/meta) 中了解更多关于元服务层的信息。

</TabItem>
<TabItem value="Query Layer" label="查询层">

Databend 的查询层处理查询计算，由多个计算集群组成，每个集群包含多个节点。
每个节点是查询层的核心单元，由以下部分组成：
- **计划器**：使用 [关系代数](https://en.wikipedia.org/wiki/Relational_algebra) 中的元素为 SQL 语句制定执行计划，结合 Projection、Filter 和 Limit 等操作符。
- **优化器**：基于规则的优化器应用预定义规则，如“谓词下推”和“修剪未使用列”，以实现最佳查询执行。
- **处理器**：根据计划器指令构建查询执行管道，遵循 Pull&Push 方法。处理器相互连接，形成一个可以在节点间分布的管道，以提高性能。

在 GitHub 的 [query](https://github.com/datafuselabs/databend/tree/main/src/query) 目录中了解更多关于查询层的信息。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend 采用 Parquet，一种开源的列式格式，并引入了自己的表格式以提升查询性能。关键特性包括：

- **二级索引**：加速跨各种分析维度的数据定位和访问。
 
- **复杂数据类型索引**：旨在加速复杂类型（如半结构化数据）的数据处理和分析。

- **段**：Databend 有效地将数据组织成段，提高数据管理和检索效率。

- **聚类**：在段内使用用户定义的聚类键来简化数据扫描。

在 GitHub 的 [storage](https://github.com/datafuselabs/databend/tree/main/src/query/storages) 中了解更多关于存储层的信息。


</TabItem>
</Tabs>