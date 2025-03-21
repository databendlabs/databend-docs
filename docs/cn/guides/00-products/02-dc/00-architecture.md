---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务是一个多租户服务，它将 Databend Cloud 中每个租户的元数据存储在一个高可用的 Raft 集群中。这些元数据包括：

- 表结构：包括每个表的字段结构和存储位置信息，为查询计划提供优化信息，并为存储层写入提供事务原子性保证；
- 集群管理：当每个租户的集群启动时，集群内的多个实例将注册为元数据，并为实例提供健康检查，以确保集群的整体健康；
- 安全管理：保存用户、角色和权限授予信息，确保数据访问认证和授权过程的安全性和可靠性。

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储与计算完全分离的架构使 Databend Cloud 具有独特的计算弹性。

Databend Cloud 中的每个租户可以拥有多个计算集群（Warehouse），每个集群拥有独占的计算资源，并且可以在闲置超过 1 分钟后自动释放这些资源，以降低使用成本。

在计算集群中，查询通过高性能的 Databend 引擎执行。每个查询将经过多个不同的子模块：

- 计划器：在解析 SQL 语句后，会根据不同的查询类型将不同的操作符（如 Projection、Filter、Limit 等）组合成查询计划。
- 优化器：Databend 引擎提供了基于规则和基于成本的优化器框架，实现了谓词下推、连接重排序、扫描剪枝等一系列优化机制，大大加速了查询。
- 处理器：Databend 实现了推拉结合的管道执行引擎。它将查询的物理执行组合成处理器中的一系列管道，并可以根据查询任务的运行时信息动态调整管道配置，结合向量化表达式计算框架，最大化 CPU 的计算能力。

此外，Databend Cloud 可以根据查询工作负载的变化动态增加或减少集群中的节点，使计算更快且更具成本效益。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend Cloud 的存储层基于 FuseEngine，它是为廉价的对象存储设计和优化的。FuseEngine 根据对象存储的特性高效地组织数据，允许高吞吐量的数据摄取和检索。

FuseEngine 以列式格式压缩数据并将其存储在对象存储中，这显著减少了数据量和存储成本。

除了存储数据文件外，FuseEngine 还生成索引信息，包括 MinMax 索引、Bloomfilter 索引等。这些索引减少了查询执行期间的 IO 和 CPU 消耗，大大提高了查询性能。

</TabItem>
</Tabs>