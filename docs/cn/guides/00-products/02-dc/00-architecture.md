---
title: Databend Cloud 架构
sidebar_label: 架构
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Alt text](@site/static/img/documents/overview/2.png)

<Tabs groupId="databendlay">
<TabItem value="Meta-Service Layer" label="元数据服务层">

元数据服务是一个多租户服务，它将 Databend Cloud 中每个租户的元数据存储在高可用的 Raft 集群中。这些元数据包括：

- 表模式 (Table schema)：包含每个表的字段结构和存储位置信息，为查询规划提供优化依据，并为存储层写入操作提供事务原子性保证；
- 集群管理：当租户集群启动时，集群内的多个实例会注册到元数据中，并通过健康检查机制确保集群整体状态稳定；
- 安全管理：保存用户、角色和权限授予信息，保障数据访问认证与授权过程的安全可靠。

</TabItem>
<TabItem value="Compute Layer" label="计算层">

存储与计算完全分离的架构赋予 Databend Cloud 独特的计算弹性。

Databend Cloud 中的每个租户可拥有多个计算集群（Warehouse），每个集群独占计算资源，并在非活动状态超过 1 分钟后自动释放资源，以降低使用成本。

在计算集群中，查询通过高性能的 Databend 引擎执行。每个查询会经过以下子模块：

- 规划器 (Planner)：解析 SQL 语句后，根据查询类型将操作符（如投影、过滤、限制等）组合成查询计划；
- 优化器 (Optimizer)：Databend 引擎提供基于规则和成本的优化框架，实现谓词下推、连接重排序和扫描剪枝等机制，显著加速查询；
- 处理器 (Processors)：Databend 采用推拉结合的管道执行引擎，将查询物理执行组织为处理器中的流水线，并根据运行时信息动态调整配置，结合向量化表达式计算框架最大化 CPU 算力。

此外，Databend Cloud 能随查询负载变化动态增减集群节点，实现更高效、经济的计算。

</TabItem>
<TabItem value="Storage Layer" label="存储层">

Databend Cloud 的存储层基于 FuseEngine，专为低成本对象存储设计和优化。FuseEngine 高效组织数据以适配对象存储特性，支持高吞吐量的数据摄取与检索。

FuseEngine 以列式格式压缩数据并存储于对象存储，显著降低数据量和存储成本。

除数据文件外，FuseEngine 还生成索引 (Index) 信息，包括 MinMax 索引、布隆过滤器索引等。这些索引减少查询执行时的 IO 和 CPU 消耗，大幅提升性能。

</TabItem>
</Tabs>