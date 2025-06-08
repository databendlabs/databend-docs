---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![架构图](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务是一个多租户服务，它将 Databend Cloud 中每个租户的元数据存储在高可用的 Raft 集群中。这些元数据包括：

- 表结构（Table schema）：包含每个表的字段结构和存储位置信息，为查询计划提供优化依据，并为存储层写入提供事务原子性保障；
- 集群管理（Cluster management）：租户集群启动时，集群内的多个实例会注册到元数据系统，通过健康检查机制确保集群整体运行状态；
- 安全管理（Security management）：存储用户、角色及权限授予信息，保障数据访问认证与授权流程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储计算分离架构赋予 Databend Cloud 独特的计算弹性。

每个租户可创建多个计算集群（Warehouse），各集群享有专属计算资源，并在闲置超过 1 分钟后自动释放以降低成本。

计算集群通过高性能 Databend 引擎执行查询，每个查询会经过以下核心模块：

- Planner：解析 SQL 语句后，根据查询类型组合不同算子（如 Projection、Filter、Limit 等）生成查询计划；
- 查询优化器（Query Optimizer）：基于规则和成本的优化框架，实现谓词下推、连接重排、扫描剪枝等机制，显著提升查询速度；
- Processors：采用推拉结合的 Pipeline 执行引擎，将物理查询分解为处理器内的一系列流水线，根据运行时状态动态调整流水线配置，结合向量化表达式计算框架最大化 CPU 效能。

此外，Databend Cloud 能随查询负载动态伸缩集群节点，实现高效经济的计算。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend Cloud 存储层基于专为廉价对象存储优化的 FuseEngine。该引擎根据对象存储特性高效组织数据，支持高吞吐量数据摄入与检索。

FuseEngine 以列式格式压缩数据并存储至对象存储，显著降低数据体积与存储成本。

除数据文件外，FuseEngine 还生成 MinMax 索引、Bloomfilter 索引等元数据，通过减少查询时的 I/O 与 CPU 消耗大幅提升性能。

</TabItem>
</Tabs>