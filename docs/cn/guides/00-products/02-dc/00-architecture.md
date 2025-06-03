---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务是一个多租户服务，在高可用的 Raft 集群中存储 Databend Cloud 每个租户的元数据。这些元数据包括：

- 表结构：包含每个表的字段结构和存储位置信息，为查询规划提供优化依据，并为存储层写入保障事务原子性；
- 集群管理：租户集群启动时，集群内多个实例会注册到元数据中，通过健康检查确保集群整体状态；
- 安全管理：保存用户、角色和权限授予信息，保障数据访问认证与授权流程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储与计算完全分离的架构赋予 Databend Cloud 独特的计算弹性。

每个租户可拥有多个计算集群 (Warehouse)，每个集群独占计算资源，并在闲置超过 1 分钟后自动释放资源以降低成本。

计算集群中，查询通过高性能 Databend 引擎执行，每个查询会经过多个子模块：

- Planner：解析 SQL 语句后，根据查询类型组合操作符（如 Projection、Filter、Limit 等）生成查询计划；
- Optimizer：基于规则和成本的优化器框架实现谓词下推、连接重排序和扫描剪枝等机制，大幅加速查询；
- Processors：采用推拉结合的管道执行引擎，将物理查询组合为 Processor 中的流水线，并根据运行时信息动态调整配置，结合向量化表达式框架最大化 CPU 算力。

此外，Databend Cloud 能随查询负载变化动态增减集群节点，实现更快速、高性价比的计算。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend Cloud 存储层基于 FuseEngine，专为低成本对象存储设计优化。FuseEngine 高效组织数据以适配对象存储特性，支持高吞吐量的数据摄取与检索。

FuseEngine 以列式格式压缩数据并存储于对象存储，显著降低数据量和存储成本。

除数据文件外，FuseEngine 还生成 MinMax 索引、Bloomfilter 索引等元信息，减少查询时的 IO 和 CPU 消耗，大幅提升性能。

</TabItem>
</Tabs>