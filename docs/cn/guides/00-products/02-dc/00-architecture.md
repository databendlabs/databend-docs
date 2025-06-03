---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="Meta-Service Layer">

元数据服务是多租户服务，将 Databend Cloud 中各租户的元数据存储于高可用 Raft 集群中。元数据包含：

- 表结构：包括各表的字段结构与存储位置信息，为查询规划提供优化依据，并为存储层写入操作提供事务原子性保证；
- 集群管理：租户集群启动时，集群内多个实例将注册至元数据系统，通过健康检查机制确保集群整体运行状态；
- 安全管理：存储用户、角色及权限授予信息，保障数据访问认证与授权流程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="Compute Layer">

存储计算完全分离的架构赋予 Databend Cloud 独特的计算弹性。

Databend Cloud 各租户可创建多个计算集群（Warehouse），每个集群享有独占计算资源，并在闲置超 1 分钟后自动释放资源以降低成本。

计算集群中，查询通过高性能 Databend 引擎执行，每个查询需经以下子模块处理：

- Planner：解析 SQL 语句后，根据查询类型组合不同操作符（如 Projection、Filter、Limit 等）生成查询计划；
- Optimizer：基于规则与成本的优化器框架实现谓词下推、Join 重排序、扫描剪枝等优化机制，显著提升查询速度；
- Processors：采用推拉结合的流水线执行引擎，将物理查询组合为 Processor 内的流水线序列，并根据查询任务运行时信息动态调整流水线配置，结合向量化表达式计算框架最大化 CPU 算力。

此外，Databend Cloud 可随查询负载动态增减集群节点，实现高效经济的计算资源调度。

</TabItem>
<TabItem value="Storage Layer" label="Storage Layer">

Databend Cloud 存储层基于 FuseEngine 构建，专为低成本对象存储设计优化。该引擎根据对象存储特性高效组织数据，支持高吞吐量数据摄取与查询。

FuseEngine 以列式格式压缩数据并存储至对象存储，显著降低数据体积与存储成本。

除数据文件外，FuseEngine 还生成 MinMax 索引、Bloom Filter 索引等元数据。这些索引有效减少查询时的 IO 与 CPU 消耗，大幅提升查询性能。

</TabItem>
</Tabs>