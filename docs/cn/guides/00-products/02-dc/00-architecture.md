---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

元数据服务是一个多租户服务，它将每个租户在 Databend Cloud 中的元数据存储在一个高可用的 Raft 集群中。这些元数据包括：

- 表模式：包括每个表的字段结构和存储位置信息，为查询规划提供优化信息，并为存储层写入提供事务原子性保证；
- 集群管理：每个租户的集群启动时，集群内的多个实例将被注册为元数据，并为实例提供健康检查，以确保集群的整体健康；
- 安全管理：保存用户、角色和权限授予信息，以确保数据访问认证和授权过程的安全性和可靠性。

</TabItem>
<TabItem value="Compute Layer" label="Compute Layer">

存储和计算完全分离的架构赋予了 Databend Cloud 独特的计算弹性。

Databend Cloud 中的每个租户可以有多个计算集群 (Warehouse)，每个集群都具有独占的计算资源，并且可以在不活动超过 1 分钟时自动释放它们，以降低使用成本。

在计算集群中，查询通过高性能的 Databend 引擎执行。每个查询都将经过多个不同的子模块：

- Planner：解析 SQL 语句后，它将根据不同的查询类型将不同的运算符（如 Projection、Filter、Limit 等）组合成一个查询计划。
- Optimizer：Databend 引擎提供了一个基于规则和基于成本的优化器框架，它实现了一系列优化机制，如谓词下推、连接重排序和扫描修剪，大大加快了查询速度。
- Processors：Databend 实现了 pipeline 执行引擎的推拉组合。它将查询的物理执行组成 Processor 中的一系列 pipeline，并且可以根据查询任务的运行时信息动态调整 pipeline 配置，结合向量化表达式计算框架，最大限度地提高 CPU 的计算能力。

此外，Databend Cloud 可以随着查询工作负载的变化动态增加或减少集群中的节点，从而使计算更快、更具成本效益。

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend Cloud 的存储层基于 FuseEngine，它是为廉价对象存储而设计和优化的。FuseEngine 基于对象存储的属性高效地组织数据，从而实现高吞吐量的数据摄取和检索。

FuseEngine 以列式格式压缩数据并将其存储在对象存储中，这显着减少了数据量和存储成本。

除了存储数据文件外，FuseEngine 还会生成索引信息，包括 MinMax 索引、Bloomfilter 索引等。这些索引减少了查询执行期间的 IO 和 CPU 消耗，从而大大提高了查询性能。

</TabItem>
</Tabs>
